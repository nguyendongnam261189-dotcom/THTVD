import React, { useState, useEffect } from 'react';
import { User, Club, Post, SubCategory } from '../types';
import { 
    subscribeToClubs, subscribeToPosts, logoutUser, 
    addPost, deletePost, uploadFileToStorage,
    addClub, updateClub, deleteClub,
    subscribeToSubCategories, addSubCategory, deleteSubCategory,
    getScriptUrl, saveScriptUrl
} from '../services/storage';
import { 
    Menu, X, Plus, LogOut, Search, Image as ImageIcon, 
    Video, FileText, Link as LinkIcon, Bot, MoreVertical, Trash2,
    Upload, Globe, Eye, Download, Settings, Edit, Save, Check, Ban, ChevronRight, Hash, ExternalLink,
    LayoutTemplate
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { generateResponse } from '../services/geminiService';

interface DashboardProps {
    user: User;
    onLogout: () => void;
}

const AVAILABLE_ICONS = ['BookOpen', 'Calculator', 'Languages', 'Bot', 'Flag', 'Music', 'Palette', 'Dumbbell', 'Microscope', 'Globe', 'Cpu', 'Code', 'Heart', 'Star'];

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    
    // Selection State
    const [selectedClubId, setSelectedClubId] = useState<string | null>(null); // null = All
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);

    const [isSidebarOpen, setSidebarOpen] = useState(true);
    
    // Modals
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showAI, setShowAI] = useState(false);
    const [showManageClubs, setShowManageClubs] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [viewPost, setViewPost] = useState<Post | null>(null);
    
    // Upload State
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostType, setNewPostType] = useState<'IMAGE' | 'VIDEO' | 'DOCUMENT'>('IMAGE');
    const [uploadMode, setUploadMode] = useState<'LINK' | 'FILE'>('LINK');
    const [newPostUrl, setNewPostUrl] = useState(''); // Stores URL
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // NEW: Preview URL

    const [targetClubId, setTargetClubId] = useState('');
    const [targetSubCategoryId, setTargetSubCategoryId] = useState(''); // New State for creating post
    const [isUploading, setIsUploading] = useState(false);

    // AI Chat State
    const [aiInput, setAiInput] = useState('');
    const [aiMessages, setAiMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Manage Clubs State
    const [editingClub, setEditingClub] = useState<Club | null>(null);
    const [isEditing, setIsEditing] = useState(false); // true = edit mode, false = create mode
    const [newSubCatName, setNewSubCatName] = useState(''); // For adding subcategory in modal

    // Settings State
    const [scriptUrlInput, setScriptUrlInput] = useState('');

    // REAL-TIME DATA SUBSCRIPTION
    useEffect(() => {
        // Subscribe to Clubs
        const unsubscribeClubs = subscribeToClubs((fetchedClubs) => {
            setClubs(fetchedClubs);
            if (!targetClubId && fetchedClubs.length > 0) {
                setTargetClubId(fetchedClubs[0].id);
            }
        });

        // Subscribe to SubCategories
        const unsubscribeSubCats = subscribeToSubCategories((fetchedSubCats) => {
            setSubCategories(fetchedSubCats);
        });

        // Subscribe to Posts (fetching all initially, filtering locally for simpler logic with subcats)
        const unsubscribePosts = subscribeToPosts((fetchedPosts) => {
            setPosts(fetchedPosts);
        });

        return () => {
            unsubscribeClubs();
            unsubscribeSubCats();
            unsubscribePosts();
        };
    }, []);

    const handleLogout = () => {
        logoutUser();
        onLogout();
    };

    // --- HELPER: Filtered Posts ---
    const getFilteredPosts = () => {
        let filtered = posts;
        if (selectedClubId) {
            filtered = filtered.filter(p => p.clubId === selectedClubId);
        }
        if (selectedSubCategoryId) {
            filtered = filtered.filter(p => p.subCategoryId === selectedSubCategoryId);
        }
        return filtered;
    };

    const filteredPosts = getFilteredPosts();

    // --- HELPER: Handle File Selection & Preview ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        // GIỚI HẠN DUNG LƯỢNG nếu không dùng Script URL
        if (!getScriptUrl() && file.size > 500 * 1024) { 
            alert("File quá lớn (>500KB) cho bộ nhớ trình duyệt! Hãy cấu hình Script URL trong Cài đặt hoặc dùng Link Drive.");
            // Reset input
            e.target.value = '';
            return;
        }
        setSelectedFile(file);

        // Tạo Preview URL ngay lập tức
        if (file.type.startsWith('image/')) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        } else {
            setPreviewUrl(null);
        }
    };

    // Clean up preview URL when modal closes or file changes
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const resetUploadForm = () => {
        setShowUploadModal(false);
        setNewPostTitle('');
        setNewPostContent('');
        setNewPostUrl('');
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadMode('LINK');
        setTargetSubCategoryId('');
    }

    // --- HELPER: Process Youtube Links ---
    const getYoutubeEmbed = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let finalUrl = newPostUrl;

            // 1. Upload File if needed
            if (uploadMode === 'FILE' && selectedFile) {
                finalUrl = await uploadFileToStorage(selectedFile);
            } 
            // 2. Format Youtube Link if needed
            else if (newPostType === 'VIDEO' && uploadMode === 'LINK') {
                finalUrl = getYoutubeEmbed(newPostUrl);
            }

            const post: Post = {
                id: Date.now().toString(),
                clubId: targetClubId || (clubs[0]?.id || ''),
                subCategoryId: targetSubCategoryId || undefined,
                userId: user.id,
                authorName: user.name,
                authorAvatar: user.avatar,
                type: newPostType,
                title: newPostTitle,
                content: newPostContent,
                mediaUrl: finalUrl,
                createdAt: Date.now(),
                likes: 0
            };

            await addPost(post);
            resetUploadForm();
            
        } catch (error) {
            console.error("Error creating post:", error);
            // Hiển thị lỗi rõ ràng từ service (File quá lớn hoặc Bộ nhớ đầy)
            alert("LỖI ĐĂNG BÀI: " + (error as any).message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeletePost = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa bài này?")) {
             await deletePost(id);
             if (viewPost?.id === id) setViewPost(null);
        }
    }

    const handleAiSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!aiInput.trim()) return;
        
        const msg = aiInput;
        setAiInput('');
        setAiMessages(prev => [...prev, { role: 'user', text: msg }]);
        setIsAiLoading(true);

        const response = await generateResponse(msg);
        setAiMessages(prev => [...prev, { role: 'model', text: response }]);
        setIsAiLoading(false);
    }

    // --- CLUB & SUB-CATEGORY MANAGEMENT HANDLERS ---
    const initCreateClub = () => {
        setEditingClub({
            id: '',
            name: '',
            description: '',
            icon: 'Star',
            coverImage: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80'
        });
        setIsEditing(false);
        setNewSubCatName('');
    }

    const initEditClub = (club: Club) => {
        setEditingClub({...club});
        setIsEditing(true);
        setNewSubCatName('');
    }

    const handleSaveClub = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingClub || !editingClub.name) return;

        try {
            if (isEditing) {
                await updateClub(editingClub);
            } else {
                const newClub = { ...editingClub, id: Date.now().toString() };
                await addClub(newClub);
            }
            setEditingClub(null); // Reset form
        } catch (err: any) {
            alert("Lỗi khi lưu danh mục: " + err.message);
        }
    };

    const handleDeleteClub = async (id: string) => {
        if(confirm("CẢNH BÁO: Xóa danh mục này sẽ ẩn tất cả các bài viết thuộc về nó. Bạn có chắc không?")) {
            await deleteClub(id);
            if (editingClub?.id === id) setEditingClub(null);
        }
    }

    const handleAddSubCategory = async () => {
        if (!editingClub || !newSubCatName.trim()) return;
        
        // If creating a new club, we can't add subcategories yet because we don't have a real ID
        if (!isEditing) {
            alert("Vui lòng lưu Danh mục chính trước khi thêm danh mục con.");
            return;
        }

        const newSub: SubCategory = {
            id: Date.now().toString(),
            clubId: editingClub.id,
            name: newSubCatName.trim()
        };
        
        try {
            await addSubCategory(newSub);
            setNewSubCatName('');
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDeleteSubCategory = async (id: string) => {
        if(confirm("Xóa danh mục con này?")) {
            await deleteSubCategory(id);
        }
    };
    
    // --- SETTINGS HANDLERS ---
    const openSettings = () => {
        setScriptUrlInput(getScriptUrl());
        setShowSettings(true);
    };

    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        saveScriptUrl(scriptUrlInput);
        setShowSettings(false);
        alert("Đã lưu cấu hình!");
    };


    const ClubIcon = ({ name, className }: { name: string, className?: string }) => {
        const IconComponent = (Icons as any)[name] || Icons.Box;
        return <IconComponent className={className} />;
    };

    // --- RENDER CONTENT VIEWER ---
    const renderContentPreview = (post: Post, isFullView: boolean) => {
        if (!post.mediaUrl) return null;

        if (post.type === 'IMAGE') {
            return (
                <img 
                    src={post.mediaUrl} 
                    className={`w-full object-cover ${isFullView ? 'max-h-[70vh] object-contain bg-black' : 'h-auto'}`} 
                    loading="lazy" 
                />
            );
        }
        
        if (post.type === 'VIDEO') {
            if (isFullView) {
                // Youtube iframe
                if (post.mediaUrl.includes('youtube') || post.mediaUrl.includes('youtu.be')) {
                    return (
                        <div className="aspect-video w-full bg-black">
                            <iframe src={post.mediaUrl} className="w-full h-full" allowFullScreen></iframe>
                        </div>
                    );
                }
                // Direct video file (from storage or link)
                return <video src={post.mediaUrl} controls className="w-full max-h-[70vh] bg-black" />;
            }
            // Thumbnail view for video
            return (
                <div className="aspect-video w-full bg-slate-800 flex items-center justify-center relative">
                    <Video size={48} className="text-white/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                        </div>
                    </div>
                </div>
            );
        }

        if (post.type === 'DOCUMENT') {
            if (isFullView) {
                // If it's a PDF
                if (post.mediaUrl.toLowerCase().includes('.pdf') || post.mediaUrl.startsWith('data:application/pdf')) {
                    return <iframe src={post.mediaUrl} className="w-full h-[70vh] border-none bg-white" />;
                }
                // Word/Excel etc -> Google Viewer
                const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(post.mediaUrl)}&embedded=true`;
                return <iframe src={googleDocsUrl} className="w-full h-[70vh] border-none"></iframe>;
            }

            return (
                <div className="p-4 bg-white/5 mx-4 rounded-xl flex items-center gap-3">
                    <FileText className="text-secondary" size={24} />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Tài liệu đính kèm</p>
                        <p className="text-xs text-white/50 truncate">Nhấp để xem trước</p>
                    </div>
                </div>
            );
        }
        return null;
    }

    return (
        <div className="flex h-screen bg-slate-900 overflow-hidden text-white font-sans">
            {/* Sidebar */}
            <aside 
                className={`${isSidebarOpen ? 'w-64' : 'w-0 md:w-20'} bg-surface border-r border-white/5 transition-all duration-300 flex flex-col z-20 absolute md:relative h-full`}
            >
                <div className="p-4 flex items-center gap-3 border-b border-white/5 h-16">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                        <Icons.School size={20} className="text-white" />
                    </div>
                    <span className={`font-bold text-lg whitespace-nowrap overflow-hidden transition-all ${!isSidebarOpen && 'md:hidden'}`}>
                        TVD Hub
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                    <button 
                        onClick={() => { setSelectedClubId(null); setSelectedSubCategoryId(null); if(window.innerWidth < 768) setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                            selectedClubId === null ? 'bg-primary text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <Icons.LayoutGrid size={20} className="shrink-0" />
                        <span className={`${!isSidebarOpen && 'md:hidden'}`}>Tổng quan</span>
                    </button>

                    <div className={`mt-4 mb-2 px-3 text-xs font-bold text-white/30 uppercase tracking-wider flex justify-between items-center ${!isSidebarOpen && 'md:hidden'}`}>
                        <span>Danh mục / CLB</span>
                    </div>

                    {clubs.map(club => (
                        <div key={club.id} className="mb-1">
                            <button
                                onClick={() => { 
                                    if (selectedClubId === club.id) {
                                        // Toggle? No, just selecting filtering.
                                    }
                                    setSelectedClubId(club.id); 
                                    setSelectedSubCategoryId(null); // Reset subcat when changing club
                                    if(window.innerWidth < 768) setSidebarOpen(false); 
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                                    selectedClubId === club.id ? 'bg-white/10 text-white border border-white/10' : 'text-white/60 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <ClubIcon name={club.icon} className="shrink-0 w-5 h-5" />
                                <span className={`truncate text-sm flex-1 text-left ${!isSidebarOpen && 'md:hidden'}`}>
                                    {club.name}
                                </span>
                                {selectedClubId === club.id && isSidebarOpen && (
                                    <ChevronRight size={14} className="text-white/30" />
                                )}
                            </button>

                            {/* Sub Categories List (Only show if sidebar open and club selected) */}
                            {selectedClubId === club.id && isSidebarOpen && (
                                <div className="ml-4 pl-3 border-l border-white/10 mt-1 space-y-1 animate-fade-in">
                                    {subCategories.filter(s => s.clubId === club.id).map(sub => (
                                        <button
                                            key={sub.id}
                                            onClick={() => { setSelectedSubCategoryId(sub.id); }}
                                            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                                                selectedSubCategoryId === sub.id ? 'text-primary bg-primary/10 font-bold' : 'text-white/50 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full ${selectedSubCategoryId === sub.id ? 'bg-primary' : 'bg-white/20'}`} />
                                            <span className="truncate">{sub.name}</span>
                                        </button>
                                    ))}
                                    {subCategories.filter(s => s.clubId === club.id).length === 0 && (
                                        <div className="px-3 py-1 text-[10px] text-white/20 italic">Không có mục con</div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-white/5 space-y-2">
                    {user.role === 'ADMIN' && (
                        <button 
                            onClick={() => { setShowManageClubs(true); initCreateClub(); }}
                            className="flex items-center gap-3 text-emerald-400 hover:text-emerald-300 w-full px-2 py-2 rounded-lg hover:bg-emerald-500/10 transition-colors"
                        >
                            <LayoutTemplate size={20} className="shrink-0" />
                            <span className={`${!isSidebarOpen && 'md:hidden'}`}>Quản lý hệ thống</span>
                        </button>
                    )}
                    <button 
                        onClick={openSettings}
                        className="flex items-center gap-3 text-indigo-400 hover:text-indigo-300 w-full px-2 py-2 rounded-lg hover:bg-indigo-500/10 transition-colors"
                    >
                        <Settings size={20} className="shrink-0" />
                        <span className={`${!isSidebarOpen && 'md:hidden'}`}>Cài đặt</span>
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-rose-400 hover:text-rose-300 w-full px-2 py-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                    >
                        <LogOut size={20} className="shrink-0" />
                        <span className={`${!isSidebarOpen && 'md:hidden'}`}>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative w-full">
                {/* Header */}
                <header className="h-16 bg-surface/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg">
                            <Menu size={20} />
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-medium truncate">
                                {selectedClubId ? clubs.find(c => c.id === selectedClubId)?.name : 'Tất cả hoạt động'}
                            </h2>
                            {selectedSubCategoryId && (
                                <span className="text-xs text-primary flex items-center gap-1">
                                    <ChevronRight size={10} /> 
                                    {subCategories.find(s => s.id === selectedSubCategoryId)?.name}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setShowAI(!showAI)}
                            className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                        >
                            <Bot size={18} />
                            <span className="hidden md:inline text-xs font-bold">Trợ lý AI</span>
                        </button>
                        <button 
                            onClick={() => {
                                setTargetClubId(selectedClubId || (clubs[0]?.id || ''));
                                setTargetSubCategoryId(selectedSubCategoryId || '');
                                setShowUploadModal(true);
                            }}
                            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">Đăng bài</span>
                        </button>
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-white/20" />
                    </div>
                </header>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#0f172a]">
                    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                        {filteredPosts.map(post => (
                            <div 
                                key={post.id} 
                                onClick={() => setViewPost(post)}
                                className="break-inside-avoid bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:-translate-y-1 group cursor-pointer"
                            >
                                {/* Header */}
                                <div className="p-4 flex items-center gap-3">
                                    <img src={post.authorAvatar} className="w-8 h-8 rounded-full" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{post.authorName}</p>
                                        <p className="text-xs text-white/40">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                    <div className="flex gap-1">
                                         {(user.role === 'ADMIN' || user.id === post.userId) && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}
                                                className="text-white/20 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Media Preview (Clickable) */}
                                {renderContentPreview(post, false)}

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                                    <p className="text-sm text-white/70 line-clamp-3">{post.content}</p>
                                    
                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                        <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider ${
                                            post.type === 'VIDEO' ? 'bg-rose-500/20 text-rose-400' :
                                            post.type === 'DOCUMENT' ? 'bg-indigo-500/20 text-indigo-400' :
                                            'bg-emerald-500/20 text-emerald-400'
                                        }`}>
                                            {post.type}
                                        </span>
                                        <span className="text-xs text-white/30 truncate max-w-[100px]">
                                            {clubs.find(c => c.id === post.clubId)?.name}
                                        </span>
                                        {post.subCategoryId && (
                                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/5 text-white/50 truncate max-w-[80px]">
                                                {subCategories.find(s => s.id === post.subCategoryId)?.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="text-white/20" size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-white/50">Chưa có bài đăng nào</h3>
                            <p className="text-white/30 mt-2">
                                {selectedSubCategoryId 
                                    ? "Danh mục con này chưa có nội dung." 
                                    : "Hãy là người đầu tiên chia sẻ nội dung!"}
                            </p>
                        </div>
                    )}
                </div>

                {/* AI Sidebar */}
                {showAI && (
                    <div className="absolute top-16 bottom-0 right-0 w-full md:w-96 bg-surface border-l border-white/10 shadow-2xl z-30 flex flex-col animate-fade-in">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-indigo-900/20">
                            <h3 className="font-bold flex items-center gap-2">
                                <Bot size={20} className="text-indigo-400" />
                                Trợ lý Học liệu
                            </h3>
                            <button onClick={() => setShowAI(false)} className="hover:bg-white/10 p-1 rounded"><X size={18}/></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {aiMessages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white/10 text-white/80'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isAiLoading && <div className="text-white/30 text-xs italic">AI đang suy nghĩ...</div>}
                        </div>
                        <form onSubmit={handleAiSubmit} className="p-3 border-t border-white/5 bg-black/20">
                            <input 
                                value={aiInput}
                                onChange={e => setAiInput(e.target.value)}
                                placeholder="Hỏi về tài liệu, ý tưởng..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                            />
                        </form>
                    </div>
                )}
            </main>

            {/* --- MANAGE CLUBS MODAL (ADMIN) --- */}
            {showManageClubs && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl h-[80vh] bg-surface rounded-2xl border border-white/10 flex overflow-hidden shadow-2xl">
                        
                        {/* Left: List */}
                        <div className="w-1/3 border-r border-white/10 flex flex-col bg-slate-900/50">
                            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                                <h3 className="font-bold">Danh sách Mục</h3>
                                <button onClick={() => { initCreateClub(); }} className="bg-primary/20 text-primary p-1.5 rounded-lg hover:bg-primary/30"><Plus size={18} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                {clubs.map(club => (
                                    <div key={club.id} onClick={() => initEditClub(club)} className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-colors ${editingClub?.id === club.id ? 'bg-primary text-white' : 'hover:bg-white/5'}`}>
                                        <ClubIcon name={club.icon} className="w-5 h-5 opacity-70" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{club.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div className="flex-1 flex flex-col bg-surface">
                            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                                <h3 className="font-bold text-lg">{isEditing ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục mới'}</h3>
                                <button onClick={() => setShowManageClubs(false)} className="hover:bg-white/10 p-2 rounded-full"><X size={20}/></button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6">
                                {editingClub ? (
                                    <form onSubmit={handleSaveClub} className="space-y-5">
                                        {/* Main Club Info */}
                                        <div className="space-y-5 border-b border-white/10 pb-6">
                                            <div>
                                                <label className="block text-xs font-medium text-white/50 mb-1">Tên Danh mục / CLB</label>
                                                <input 
                                                    required
                                                    value={editingClub.name}
                                                    onChange={e => setEditingClub({...editingClub, name: e.target.value})}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                                                    placeholder="VD: CLB Tin Học"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-white/50 mb-1">Mô tả ngắn</label>
                                                <textarea 
                                                    value={editingClub.description}
                                                    onChange={e => setEditingClub({...editingClub, description: e.target.value})}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                                                    rows={3}
                                                    placeholder="Mô tả mục đích hoạt động..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-white/50 mb-1">Biểu tượng (Icon)</label>
                                                <div className="grid grid-cols-7 gap-2">
                                                    {AVAILABLE_ICONS.map(icon => (
                                                        <button
                                                            type="button"
                                                            key={icon}
                                                            onClick={() => setEditingClub({...editingClub, icon: icon})}
                                                            className={`p-2 rounded-lg flex items-center justify-center transition-all ${editingClub.icon === icon ? 'bg-primary text-white scale-110 shadow-lg' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                                                        >
                                                            <ClubIcon name={icon} className="w-5 h-5" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-white/50 mb-1">Ảnh bìa (URL)</label>
                                                <input 
                                                    value={editingClub.coverImage}
                                                    onChange={e => setEditingClub({...editingClub, coverImage: e.target.value})}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none text-sm"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>

                                        {/* Sub Categories Management (Only in Edit Mode) */}
                                        {isEditing && (
                                            <div className="space-y-3">
                                                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider">Danh mục con (Tháng / Học kì / Chuyên môn)</label>
                                                
                                                <div className="flex gap-2 mb-3">
                                                    <input 
                                                        value={newSubCatName}
                                                        onChange={e => setNewSubCatName(e.target.value)}
                                                        placeholder="VD: Tháng 1, Học kì 1..."
                                                        className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none"
                                                    />
                                                    <button 
                                                        type="button"
                                                        onClick={handleAddSubCategory}
                                                        disabled={!newSubCatName.trim()}
                                                        className="bg-white/10 hover:bg-primary hover:text-white px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                                                    >
                                                        Thêm
                                                    </button>
                                                </div>

                                                <div className="bg-black/20 rounded-xl overflow-hidden border border-white/5">
                                                    {subCategories.filter(s => s.clubId === editingClub.id).length === 0 ? (
                                                        <p className="p-3 text-xs text-white/30 text-center">Chưa có danh mục con</p>
                                                    ) : (
                                                        <div className="divide-y divide-white/5">
                                                            {subCategories.filter(s => s.clubId === editingClub.id).map(sub => (
                                                                <div key={sub.id} className="p-3 flex justify-between items-center group">
                                                                    <span className="text-sm">{sub.name}</span>
                                                                    <button 
                                                                        type="button"
                                                                        onClick={() => handleDeleteSubCategory(sub.id)}
                                                                        className="text-white/20 hover:text-rose-400 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    >
                                                                        <X size={14} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 pt-4">
                                            <button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                                                <Save size={18} /> Lưu thay đổi
                                            </button>
                                            {isEditing && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleDeleteClub(editingClub.id)}
                                                    className="px-4 border border-rose-500/50 text-rose-400 hover:bg-rose-500/10 rounded-xl"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-white/30">
                                        Chọn một mục để chỉnh sửa hoặc nhấn + để thêm mới
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- SETTINGS MODAL --- */}
            {showSettings && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-surface w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Settings size={22} className="text-indigo-400"/>
                                Cài đặt hệ thống
                            </h3>
                            <button onClick={() => setShowSettings(false)} className="hover:bg-white/10 p-2 rounded-full"><X size={20}/></button>
                        </div>
                        
                        <form onSubmit={handleSaveSettings} className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white/80">URL Google Apps Script (Web App)</label>
                                <input 
                                    value={scriptUrlInput}
                                    onChange={e => setScriptUrlInput(e.target.value)}
                                    placeholder="https://script.google.com/macros/s/..."
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                />
                                <div className="text-xs text-white/40 bg-white/5 p-3 rounded-lg leading-relaxed">
                                    <strong>Tại sao cần?</strong> Mặc định trình duyệt chỉ lưu được khoảng 5MB. Để tải file lớn lên Google Drive, bạn cần triển khai Script Web App.
                                    <br/><br/>
                                    <strong>Cách lấy Link:</strong>
                                    <ol className="list-decimal ml-4 mt-1 space-y-1">
                                        <li>Tạo Google Apps Script mới.</li>
                                        <li>Dán mã xử lý doPost.</li>
                                        <li>Nhấn "Triển khai" (Deploy) &rarr; "Tùy chọn mới" (New deployment).</li>
                                        <li>Chọn loại "Web app". "Who has access" chọn "Anyone" (Bất kỳ ai).</li>
                                        <li>Copy URL Web App dán vào đây.</li>
                                    </ol>
                                </div>
                            </div>
                            
                            <div className="pt-2 flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => { setScriptUrlInput(''); }} 
                                    className="px-4 py-2 rounded-xl border border-white/10 text-white/60 hover:text-white"
                                >
                                    Xóa / Mặc định
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl"
                                >
                                    Lưu cài đặt
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- POST DETAIL MODAL --- */}
            {viewPost && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] bg-surface rounded-2xl flex flex-col md:flex-row overflow-hidden border border-white/10 relative">
                        <button 
                            onClick={() => setViewPost(null)}
                            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white"
                        >
                            <X size={24} />
                        </button>

                        {/* Media Section */}
                        <div className="w-full md:w-2/3 bg-black flex items-center justify-center overflow-hidden">
                            {renderContentPreview(viewPost, true)}
                        </div>

                        {/* Info Section */}
                        <div className="w-full md:w-1/3 bg-surface p-6 flex flex-col overflow-y-auto border-l border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <img src={viewPost.authorAvatar} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="font-bold">{viewPost.authorName}</p>
                                    <p className="text-xs text-white/50">{new Date(viewPost.createdAt).toLocaleDateString('vi-VN')}</p>
                                </div>
                            </div>
                            
                            <h2 className="text-xl font-bold mb-4">{viewPost.title}</h2>
                            <p className="text-white/80 leading-relaxed whitespace-pre-wrap mb-6 flex-1">
                                {viewPost.content}
                            </p>

                            <div className="mt-auto pt-6 border-t border-white/10">
                                {viewPost.type === 'DOCUMENT' && !viewPost.mediaUrl?.startsWith('data:') && (
                                     <a 
                                        href={viewPost.mediaUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition-colors mb-3"
                                     >
                                        <Download size={18} /> Tải tài liệu gốc
                                     </a>
                                )}
                                <div className="flex flex-wrap gap-2">
                                     <span className="text-xs bg-white/5 px-3 py-1 rounded-full text-white/50 border border-white/5">
                                        {clubs.find(c => c.id === viewPost.clubId)?.name}
                                     </span>
                                     {viewPost.subCategoryId && (
                                        <span className="text-xs bg-primary/10 px-3 py-1 rounded-full text-primary border border-primary/20">
                                            {subCategories.find(s => s.id === viewPost.subCategoryId)?.name}
                                        </span>
                                     )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- UPLOAD MODAL --- */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-surface border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Đăng bài mới</h3>
                            <button onClick={resetUploadForm} className="hover:bg-white/10 p-2 rounded-full"><X size={20}/></button>
                        </div>

                        <form onSubmit={handleCreatePost} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-white/50 mb-1">Chọn chuyên mục</label>
                                <select 
                                    value={targetClubId}
                                    onChange={e => {
                                        setTargetClubId(e.target.value);
                                        setTargetSubCategoryId(''); // Reset subcat when changing club
                                    }}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                                >
                                    {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            {/* Sub Category Selection */}
                            {targetClubId && subCategories.some(s => s.clubId === targetClubId) && (
                                <div>
                                    <label className="block text-xs font-medium text-white/50 mb-1">Chi tiết (Tháng/Kỳ/Chuyên đề) - Tùy chọn</label>
                                    <select 
                                        value={targetSubCategoryId}
                                        onChange={e => setTargetSubCategoryId(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                                    >
                                        <option value="">-- Chung / Không xác định --</option>
                                        {subCategories.filter(s => s.clubId === targetClubId).map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-white/50 mb-1">Tiêu đề</label>
                                <input 
                                    required
                                    value={newPostTitle}
                                    onChange={e => setNewPostTitle(e.target.value)}
                                    placeholder="Nhập tiêu đề..."
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                                />
                            </div>

                            <div className="flex gap-2 mb-2">
                                <button type="button" onClick={() => setNewPostType('IMAGE')} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${newPostType === 'IMAGE' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-white/10 text-white/50'}`}>Hình ảnh</button>
                                <button type="button" onClick={() => setNewPostType('VIDEO')} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${newPostType === 'VIDEO' ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'border-white/10 text-white/50'}`}>Video</button>
                                <button type="button" onClick={() => setNewPostType('DOCUMENT')} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${newPostType === 'DOCUMENT' ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'border-white/10 text-white/50'}`}>Tài liệu</button>
                            </div>

                            {/* UPLOAD METHOD TABS */}
                            <div className="bg-black/20 p-1 rounded-xl flex mb-2">
                                <button 
                                    type="button" 
                                    onClick={() => setUploadMode('LINK')}
                                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${uploadMode === 'LINK' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'}`}
                                >
                                    <Globe size={14}/> Dùng Link
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setUploadMode('FILE')}
                                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${uploadMode === 'FILE' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'}`}
                                >
                                    <Upload size={14}/> Tải file lên
                                </button>
                            </div>

                            <div className="min-h-[80px] flex flex-col justify-center">
                                {uploadMode === 'LINK' ? (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-white/50 mb-1">Đường dẫn (URL)</label>
                                            <div className="flex gap-2">
                                                <input 
                                                    value={newPostUrl}
                                                    onChange={e => setNewPostUrl(e.target.value)}
                                                    placeholder={newPostType === 'VIDEO' ? "Link Youtube..." : "Link ảnh/Google Drive..."}
                                                    className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none text-sm"
                                                />
                                                <a 
                                                    href="https://drive.google.com/" 
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-white/10 hover:bg-white/20 p-3 rounded-xl flex items-center justify-center text-white/70 hover:text-white transition-colors"
                                                    title="Mở Google Drive để tải file"
                                                >
                                                    <ExternalLink size={20} />
                                                </a>
                                            </div>
                                            <p className="text-[10px] text-white/30 mt-1 ml-1">
                                                *Mẹo: Tải file lên Drive của bạn, chọn 'Chia sẻ' -> 'Bất kỳ ai có đường dẫn', rồi dán link vào đây.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-primary/50 transition-colors bg-black/20">
                                            <input 
                                                type="file" 
                                                id="file-upload"
                                                className="hidden"
                                                accept={newPostType === 'IMAGE' ? "image/*" : newPostType === 'VIDEO' ? "video/*" : ".pdf,.doc,.docx,.ppt"}
                                                onChange={handleFileChange}
                                            />
                                            <label htmlFor="file-upload" className="cursor-pointer block">
                                                <div className="flex flex-col items-center gap-2 text-white/40">
                                                    <Upload size={24} />
                                                    <span className="text-sm">Nhấp để chọn file từ máy</span>
                                                    {!getScriptUrl() && <span className="text-[10px] text-rose-400 font-medium">Giới hạn 500KB (Chưa cấu hình Script)</span>}
                                                    {getScriptUrl() && <span className="text-[10px] text-emerald-400 font-medium">Đã kết nối Drive Script</span>}
                                                </div>
                                            </label>
                                        </div>
                                        
                                        {/* PREVIEW IMAGE/VIDEO */}
                                        {(selectedFile || previewUrl) && (
                                            <div className="relative bg-black/40 rounded-xl p-2 border border-white/10 flex items-center gap-3">
                                                 {previewUrl && newPostType === 'IMAGE' ? (
                                                    <img src={previewUrl} className="w-16 h-16 object-cover rounded-lg bg-black" />
                                                 ) : (
                                                    <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center">
                                                        {newPostType === 'VIDEO' ? <Video size={24} className="text-white/50"/> : <FileText size={24} className="text-white/50"/>}
                                                    </div>
                                                 )}
                                                 <div className="flex-1 min-w-0">
                                                     <p className="text-sm text-emerald-400 font-medium truncate">{selectedFile?.name}</p>
                                                     <p className="text-xs text-white/40">{(selectedFile?.size || 0) / 1024 < 1000 ? Math.round((selectedFile?.size || 0) / 1024) + ' KB' : Math.round((selectedFile?.size || 0) / 1024 / 1024 * 10) / 10 + ' MB'}</p>
                                                 </div>
                                                 <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-rose-400">
                                                     <X size={16} />
                                                 </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-white/50 mb-1">Nội dung chi tiết</label>
                                <textarea 
                                    required
                                    value={newPostContent}
                                    onChange={e => setNewPostContent(e.target.value)}
                                    rows={4}
                                    placeholder="Mô tả nội dung..."
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none resize-none"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={isUploading || (!newPostUrl && uploadMode === 'LINK') || (!selectedFile && uploadMode === 'FILE')}
                                className="w-full bg-primary hover:bg-primary/90 disabled:bg-white/10 disabled:text-white/30 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                                        Đang tải lên...
                                    </>
                                ) : "Đăng ngay"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;