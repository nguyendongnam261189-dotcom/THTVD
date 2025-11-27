export interface Project {
    id: string;
    title: string;
    category: 'Environment' | 'Technology' | 'IT' | 'Math' | 'NaturalScience' | 'SocialScience';
    group: 'STEM' | 'AI';
    description: string;
    coverImage: string;
    imageUrl: string;
    authors: string;
    videoUrl?: string;
    demoUrl?: string;
}

export interface ScheduleItem {
    id: string;
    time: string;
    title: string;
    location: string;
    description?: string;
    isHighlight?: boolean;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    isThinking?: boolean;
}

export enum AppView {
    HOME = 'HOME',
    GALLERY = 'GALLERY',
    SCHEDULE = 'SCHEDULE',
    AI_GUIDE = 'AI_GUIDE',
    ABOUT = 'ABOUT'
}