import { Club, Post, User, SubCategory } from '../types';
import { INITIAL_CLUBS, INITIAL_POSTS, INITIAL_SUB_CATEGORIES, GOOGLE_APPS_SCRIPT_URL as DEFAULT_SCRIPT_URL } from '../constants';

// KEYS cho LocalStorage
const STORAGE_KEYS = {
    USER: 'tvd_user',
    POSTS: 'tvd_posts',
    CLUBS: 'tvd_clubs',
    SUB_CATEGORIES: 'tvd_sub_categories',
    SCRIPT_URL: 'tvd_script_url'
};

// --- SETTINGS MANAGEMENT ---
export const getScriptUrl = (): string => {
    return localStorage.getItem(STORAGE_KEYS.SCRIPT_URL) || DEFAULT_SCRIPT_URL;
};

export const saveScriptUrl = (url: string) => {
    localStorage.setItem(STORAGE_KEYS.SCRIPT_URL, url.trim());
};

// --- HELPER CALL API ---
const callScriptApi = async (action: string, payload: any = {}) => {
    const scriptUrl = getScriptUrl();
    if (!scriptUrl) return null;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
        const response = await fetch(scriptUrl, {
            method: 'POST',
            redirect: "follow", 
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action, ...payload }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            const text = await response.text().catch(() => "");
            if (text.includes("You do not have permission") || response.status === 403) {
                 throw new Error("Lỗi quyền truy cập (403). Kiểm tra cài đặt Deploy.");
            }
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const text = await response.text();
        let data;
        try { data = JSON.parse(text); } 
        catch (e) { throw new Error("Server trả về dữ liệu lỗi (HTML). Vui lòng kiểm tra lại Deployment."); }

        if (data.status === 'error') throw new Error(data.error);
        return data;

    } catch (e: any) {
        clearTimeout(timeoutId);
        console.error(`Lỗi API (${action}):`, e);
        throw e;
    }
};

// --- AUTH LOGIC ---
export const loginWithSchoolAccount = async (email: string, name: string): Promise<User> => {
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = name.trim();
    const scriptUrl = getScriptUrl();
    
    if (scriptUrl) {
        try {
            const result = await callScriptApi('LOGIN', { email: normalizedEmail });
            if (result && result.user) {
                const user: User = {
                    id: result.user.email.replace(/[^a-zA-Z0-9]/g, ''),
                    email: result.user.email,
                    name: result.user.name || normalizedName,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(result.user.name || normalizedName)}&background=0ea5e9&color=fff`,
                    role: result.user.role
                };
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
                return user;
            }
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    // Mock Login
    await new Promise(resolve => setTimeout(resolve, 800));
    let role: 'ADMIN' | 'TEACHER' | 'GUEST' = 'GUEST';
    if (normalizedEmail.includes('admin') || normalizedEmail === 'hieutruong@tvd.edu.vn') role = 'ADMIN';
    else if (normalizedEmail.endsWith('@tvd.edu.vn') || normalizedEmail.includes('gv')) role = 'TEACHER';

    const user: User = {
        id: normalizedEmail.replace(/[^a-zA-Z0-9]/g, ''), 
        email: normalizedEmail,
        name: normalizedName || email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(normalizedName || 'User')}&background=0ea5e9&color=fff`,
        role: role
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
};

export const logoutUser = async () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    window.location.reload();
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) callback(JSON.parse(savedUser));
    else callback(null);
    return () => {};
};

// --- LOCAL DATA HELPER ---
const getLocalData = <T>(key: string, initialData: T): T => {
    try {
        const data = localStorage.getItem(key);
        if (!data) return initialData;
        return JSON.parse(data);
    } catch (e) {
        return initialData;
    }
};

const setLocalData = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// --- POSTS MANAGEMENT ---
let postSubscribers: ((posts: Post[]) => void)[] = [];

const notifyPostSubscribers = () => {
    const posts = getLocalData<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    const sortedPosts = posts.sort((a, b) => b.createdAt - a.createdAt);
    postSubscribers.forEach(cb => cb(sortedPosts));
};

export const subscribeToPosts = (callback: (posts: Post[]) => void, clubId?: string) => {
    const wrappedCallback = (allPosts: Post[]) => {
        if (clubId) callback(allPosts.filter(p => p.clubId === clubId));
        else callback(allPosts);
    };

    postSubscribers.push(wrappedCallback);
    
    const localPosts = getLocalData<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    wrappedCallback(localPosts.sort((a, b) => b.createdAt - a.createdAt));

    const scriptUrl = getScriptUrl();
    if (scriptUrl) {
        callScriptApi('GET_POSTS')
            .then(result => {
                if (result && Array.isArray(result.posts)) {
                    if (result.posts.length > 0 || localPosts !== INITIAL_POSTS) {
                         setLocalData(STORAGE_KEYS.POSTS, result.posts);
                         notifyPostSubscribers();
                    }
                }
            })
            .catch(err => console.warn("Sync posts failed:", err.message));
    }

    return () => {
        postSubscribers = postSubscribers.filter(cb => cb !== wrappedCallback);
    };
};

export const getPosts = (): Post[] => {
    return getLocalData<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
};

export const addPost = async (post: Post) => {
    const posts = getLocalData<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    posts.unshift(post);
    setLocalData(STORAGE_KEYS.POSTS, posts);
    notifyPostSubscribers();

    const scriptUrl = getScriptUrl();
    if (scriptUrl) {
        try { await callScriptApi('ADD_POST', { post }); } 
        catch (e: any) { alert(`Lỗi lưu bài viết lên Server: ${e.message}`); }
    }
};

export const deletePost = async (postId: string) => {
    const posts = getLocalData<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    const newPosts = posts.filter(p => p.id !== postId);
    setLocalData(STORAGE_KEYS.POSTS, newPosts);
    notifyPostSubscribers();
    // Note: Delete API not implemented in basic version to prevent accidents
};

// --- CLUBS & SUBCATEGORIES MANAGEMENT (SYNCED) ---

// Helpers for Clubs
let clubSubscribers: ((clubs: Club[]) => void)[] = [];
const notifyClubSubscribers = () => {
    const clubs = getLocalData<Club[]>(STORAGE_KEYS.CLUBS, INITIAL_CLUBS);
    clubSubscribers.forEach(cb => cb(clubs));
};

// Helpers for SubCats
let subCatSubscribers: ((subCats: SubCategory[]) => void)[] = [];
const notifySubCatSubscribers = () => {
    const subCats = getLocalData<SubCategory[]>(STORAGE_KEYS.SUB_CATEGORIES, INITIAL_SUB_CATEGORIES);
    subCatSubscribers.forEach(cb => cb(subCats));
};

// LOAD INITIAL METADATA FROM SERVER
const syncMetadata = async () => {
    const scriptUrl = getScriptUrl();
    if (!scriptUrl) return;

    try {
        const result = await callScriptApi('GET_METADATA');
        if (result) {
            if (result.clubs && Array.isArray(result.clubs) && result.clubs.length > 0) {
                setLocalData(STORAGE_KEYS.CLUBS, result.clubs);
                notifyClubSubscribers();
            }
            if (result.subCategories && Array.isArray(result.subCategories)) {
                setLocalData(STORAGE_KEYS.SUB_CATEGORIES, result.subCategories);
                notifySubCatSubscribers();
            }
        }
    } catch (e) {
        console.warn("Sync metadata failed:", e);
    }
};

// --- CLUBS EXPORTS ---
export const getClubs = (): Club[] => getLocalData<Club[]>(STORAGE_KEYS.CLUBS, INITIAL_CLUBS);

export const subscribeToClubs = (callback: (clubs: Club[]) => void) => {
    clubSubscribers.push(callback);
    const clubs = getLocalData<Club[]>(STORAGE_KEYS.CLUBS, INITIAL_CLUBS);
    callback(clubs);
    
    // Trigger sync if first time or stale
    if (getScriptUrl()) syncMetadata();

    return () => { clubSubscribers = clubSubscribers.filter(cb => cb !== callback); };
};

export const addClub = async (club: Club) => {
    const clubs = getLocalData<Club[]>(STORAGE_KEYS.CLUBS, INITIAL_CLUBS);
    clubs.push(club);
    setLocalData(STORAGE_KEYS.CLUBS, clubs);
    notifyClubSubscribers();

    if (getScriptUrl()) {
        await callScriptApi('SYNC_CLUBS', { clubs });
    }
};

export const updateClub = async (updatedClub: Club) => {
    const clubs = getLocalData<Club[]>(STORAGE_KEYS.CLUBS, INITIAL_CLUBS);
    const index = clubs.findIndex(c => c.id === updatedClub.id);
    if (index !== -1) {
        clubs[index] = updatedClub;
        setLocalData(STORAGE_KEYS.CLUBS, clubs);
        notifyClubSubscribers();
        
        if (getScriptUrl()) {
            await callScriptApi('SYNC_CLUBS', { clubs });
        }
    }
};

export const deleteClub = async (clubId: string) => {
    const clubs = getLocalData<Club[]>(STORAGE_KEYS.CLUBS, INITIAL_CLUBS);
    const newClubs = clubs.filter(c => c.id !== clubId);
    setLocalData(STORAGE_KEYS.CLUBS, newClubs);
    notifyClubSubscribers();

    if (getScriptUrl()) {
        await callScriptApi('SYNC_CLUBS', { clubs: newClubs });
    }
};

// --- SUBCATEGORIES EXPORTS ---
export const subscribeToSubCategories = (callback: (subCats: SubCategory[]) => void) => {
    subCatSubscribers.push(callback);
    const subCats = getLocalData<SubCategory[]>(STORAGE_KEYS.SUB_CATEGORIES, INITIAL_SUB_CATEGORIES);
    callback(subCats);
    return () => { subCatSubscribers = subCatSubscribers.filter(cb => cb !== callback); };
};

export const addSubCategory = async (subCat: SubCategory) => {
    const subCats = getLocalData<SubCategory[]>(STORAGE_KEYS.SUB_CATEGORIES, INITIAL_SUB_CATEGORIES);
    subCats.push(subCat);
    setLocalData(STORAGE_KEYS.SUB_CATEGORIES, subCats);
    notifySubCatSubscribers();

    if (getScriptUrl()) {
        await callScriptApi('SYNC_SUBCATS', { subCategories: subCats });
    }
};

export const deleteSubCategory = async (subCatId: string) => {
    const subCats = getLocalData<SubCategory[]>(STORAGE_KEYS.SUB_CATEGORIES, INITIAL_SUB_CATEGORIES);
    const newSubCats = subCats.filter(s => s.id !== subCatId);
    setLocalData(STORAGE_KEYS.SUB_CATEGORIES, newSubCats);
    notifySubCatSubscribers();

    if (getScriptUrl()) {
        await callScriptApi('SYNC_SUBCATS', { subCategories: newSubCats });
    }
};

// --- FILE UPLOAD ---
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

export const uploadFileToStorage = async (file: File): Promise<string> => {
    const scriptUrl = getScriptUrl();
    if (!scriptUrl) {
        if (file.size > 500 * 1024) throw new Error("Chưa cấu hình Server: Chỉ cho phép file < 500KB.");
        return await fileToBase64(file);
    }
    try {
        const base64 = await fileToBase64(file);
        const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
        const result = await callScriptApi('UPLOAD', {
            filename: file.name,
            mimeType: file.type,
            base64: cleanBase64
        });
        if (!result || !result.url) throw new Error("Server trả về thành công nhưng không có URL.");
        return result.url;
    } catch (error: any) {
        console.error("Upload error details:", error);
        throw new Error(`Lỗi tải file: ${error.message}`);
    }
};