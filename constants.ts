import { Club, Post, User, SubCategory } from './types';

export const APP_NAME = "TVD EDU HUB";
export const SCHOOL_NAME = "TIỂU HỌC TRẦN VĂN DƯ";

// --- CẤU HÌNH LƯU TRỮ ---
// Để kích hoạt tính năng lưu vào Admin Drive:
// 1. Tạo Google Apps Script Web App (Xem hướng dẫn)
// 2. Dán URL vào bên dưới.
// Nếu để trống (""), hệ thống sẽ dùng LocalStorage (giới hạn 500KB).
export const GOOGLE_APPS_SCRIPT_URL = ""; 

// Mock Data for Initial Setup

export const INITIAL_CLUBS: Club[] = [
    {
        id: 'clb-toan',
        name: 'CLB Toán Tuổi Thơ',
        description: 'Vừa học vừa chơi với các con số, phát triển tư duy logic cho học sinh tiểu học.',
        icon: 'Calculator',
        coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'clb-tienganh',
        name: 'English Kids Club',
        description: 'Môi trường giao tiếp tiếng Anh vui nhộn qua bài hát và trò chơi.',
        icon: 'Languages',
        coverImage: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'clb-stem',
        name: 'STEM & Khoa Học Vui',
        description: 'Khám phá thế giới khoa học qua các thí nghiệm đơn giản và lắp ráp mô hình.',
        icon: 'Bot',
        coverImage: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'to-tiengviet',
        name: 'Tổ Tiếng Việt',
        description: 'Rèn luyện chữ đẹp, kể chuyện và tình yêu tiếng Việt.',
        icon: 'BookOpen',
        coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'hoat-dong-doan-doi',
        name: 'Hoạt động Đội - Sao',
        description: 'Hình ảnh sinh hoạt Sao Nhi đồng và Đội Thiếu niên Tiền phong.',
        icon: 'Flag',
        coverImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    }
];

export const INITIAL_SUB_CATEGORIES: SubCategory[] = [
    { id: 'sub-toan-hk1', clubId: 'clb-toan', name: 'Học kì 1' },
    { id: 'sub-toan-hk2', clubId: 'clb-toan', name: 'Học kì 2' },
    { id: 'sub-toan-violympic', clubId: 'clb-toan', name: 'Luyện thi Violympic' },
    { id: 'sub-ta-starters', clubId: 'clb-tienganh', name: 'Starters / Movers' },
    { id: 'sub-ta-flyers', clubId: 'clb-tienganh', name: 'Flyers / TOEFL Primary' },
    { id: 'sub-stem-recycle', clubId: 'clb-stem', name: 'Tái chế sáng tạo' },
    { id: 'sub-stem-khampha', clubId: 'clb-stem', name: 'Khám phá tự nhiên' },
];

export const MOCK_ADMIN: User = {
    id: 'admin-01',
    email: 'admin@tvd.edu.vn',
    name: 'Admin Trường',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=0ea5e9&color=fff',
    role: 'ADMIN'
};

// Generate some sample posts
export const INITIAL_POSTS: Post[] = [
    {
        id: 'post-1',
        clubId: 'clb-stem',
        subCategoryId: 'sub-stem-recycle',
        userId: 'teacher-1',
        authorName: 'Cô Thu Bình',
        authorAvatar: 'https://ui-avatars.com/api/?name=Thu+Binh&background=random',
        type: 'VIDEO',
        title: 'Hướng dẫn làm chậu cây từ chai nhựa',
        content: 'Video hướng dẫn các em học sinh khối 4, 5 tái chế chai nhựa thành chậu cây xinh xắn.',
        mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Demo Link
        createdAt: Date.now() - 10000000,
        likes: 12
    },
    {
        id: 'post-2',
        clubId: 'clb-toan',
        subCategoryId: 'sub-toan-hk1',
        userId: 'teacher-2',
        authorName: 'Thầy Minh',
        authorAvatar: 'https://ui-avatars.com/api/?name=Minh&background=random',
        type: 'IMAGE',
        title: 'Ngày hội Trạng Nguyên Nhí',
        content: 'Những khoảnh khắc đáng nhớ của các sĩ tử nhí trong ngày hội toán học.',
        mediaUrl: 'https://images.unsplash.com/photo-1577896335452-faad63300040?auto=format&fit=crop&w=800&q=80',
        createdAt: Date.now() - 5000000,
        likes: 24
    },
    {
        id: 'post-3',
        clubId: 'clb-tienganh',
        subCategoryId: 'sub-ta-flyers',
        userId: 'teacher-3',
        authorName: 'Ms. Sarah',
        authorAvatar: 'https://ui-avatars.com/api/?name=Sarah&background=random',
        type: 'DOCUMENT',
        title: 'Cambridge Flyers Vocabulary List',
        content: 'Danh sách từ vựng luyện thi chứng chỉ Cambridge Flyers mới nhất.',
        mediaUrl: '#',
        createdAt: Date.now() - 2000000,
        likes: 45
    }
];