export type UserRole = 'ADMIN' | 'TEACHER' | 'GUEST';

export interface User {
    id: string;
    email: string;
    name: string;
    avatar: string;
    role: UserRole;
}

export interface Club {
    id: string;
    name: string;
    description: string;
    icon: string; // Lucide icon name or emoji
    coverImage: string;
    managerEmail?: string; // Email of the teacher in charge
}

export interface SubCategory {
    id: string;
    clubId: string;
    name: string;
}

export type PostType = 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'LINK';

export interface Post {
    id: string;
    clubId: string;
    subCategoryId?: string; // New field for sub-category
    userId: string;
    authorName: string;
    authorAvatar: string;
    type: PostType;
    title: string;
    content: string; // Description or text content
    mediaUrl?: string; // URL for image, video, or doc
    thumbnailUrl?: string;
    createdAt: number; // Timestamp
    likes: number;
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: number;
}