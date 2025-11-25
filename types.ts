export interface Project {
    id: string;
    title: string;
    category: 'STEM' | 'Robotics' | 'Software' | 'IoT';
    description: string;
    imageUrl: string;
    authors: string;
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