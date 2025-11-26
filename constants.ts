
import { Project, ScheduleItem } from './types';

export const SCHOOL_NAME = "Trường Trung Học Cơ Sở Nguyễn Bỉnh Khiêm";
export const BOOTH_NUMBER = "17";

export const FESTIVAL_CONTEXT = `
Bạn là trợ lý ảo AI tại gian hàng số 17 của Trường Trung Học Cơ Sở Nguyễn Bỉnh Khiêm tham gia "Ngày hội Chung tay Cải cách hành chính và Chuyển đổi số năm 2025" tại phường Hòa Khánh.
Thời gian: 28/11/2025 - 29/11/2025.
Địa điểm: Trung tâm hành chính phường Hòa Khánh, 168 Nguyễn Sinh Sắc.

Lịch trình chung của ngày hội:
- 28/11 (Chiều): Khai mạc gian hàng, Cài định danh mức 2, Triển lãm.
- 29/11 (Sáng 07h30): Khai mạc chính thức, ra mắt Chatbox, ký kết hợp tác.
- 29/11 (Sáng 09h00-11h00): Đấu trường Robotic dành cho học sinh TH, THCS.
- 29/11 (Sáng 09h30-11h00): Chấm chọn sản phẩm STEM lần 1.
- 29/11 (Chiều 14h00-16h00): Hội thi Dân vũ - Flashmob.
- 29/11 (Chiều 15h00-16h30): Chấm chọn sản phẩm STEM lần 2.
- 29/11 (Tối 20h30): Tổng kết trao thưởng.

Thông tin về trường THCS Nguyễn Bỉnh Khiêm:
- Gian hàng trưng bày: Mô hình khoa học, sản phẩm STEM, hoạt động chuyển đổi số.
- Tham gia Đấu trường Robotic.
- Tham gia thi Dân vũ.
`;

// Local Image for STEM (User uploaded to public/sunflower.png)
const STEM_COVER_IMAGE = "/sunflower.png";

// Unsplash Image for AI
const AI_COVER_IMAGE = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop";


export const PROJECTS: Project[] = [
    // --- STEM PROJECTS ---
    {
        id: '1',
        title: 'Bản đồ Việt Nam thông minh - Smartmap 34',
        category: 'Environment',
        group: 'STEM',
        description: 'Mô hình bản đồ tương tác giúp tìm hiểu địa lý và môi trường Việt Nam.',
        coverImage: STEM_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop', // Map illustration
        authors: 'Nguyễn Thị Diệu Hiền, Phan Thị Ngọc Lý',
        demoUrl: 'https://example.com/demo/smartmap'
    },
    {
        id: '2',
        title: 'Renewable Energy Usage Model',
        category: 'Environment',
        group: 'STEM',
        description: 'Mô hình năng lượng tái tạo tích hợp AI, tối ưu hóa việc sử dụng năng lượng sạch.',
        coverImage: STEM_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=800&auto=format&fit=crop', // Renewable energy
        authors: 'Phạm Kiều Oanh, Dương Thị Mỹ Lệ',
        demoUrl: 'https://example.com/demo/energy'
    },
    {
        id: '3',
        title: 'Hệ thống giám sát môi trường IoT & Chatbot',
        category: 'IT',
        group: 'STEM',
        description: 'Hệ thống giám sát và điều khiển chất lượng môi trường, phòng chống cháy nổ sử dụng IOT và CHATBOT.',
        coverImage: STEM_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=800&auto=format&fit=crop', // IoT
        authors: 'Nguyễn Thị Thu Lợi',
        demoUrl: 'https://example.com/demo-iot'
    },
    {
        id: '4',
        title: 'Dự án: “Đà Nẵng, kế thừa và phát triển”',
        category: 'Technology',
        group: 'STEM',
        description: 'Mô hình thể hiện sự phát triển đô thị bền vững của Đà Nẵng.',
        coverImage: STEM_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1533653163339-17d456184cf4?q=80&w=800&auto=format&fit=crop', // Danang/City
        authors: 'Nguyễn Thị Hoài Thi, Trần Nguyễn Huyền Trang',
        demoUrl: 'https://example.com/demo/danang'
    },
    {
        id: '5',
        title: 'Nấm Bào Ngư tái sinh',
        category: 'Environment',
        group: 'STEM',
        description: 'Mô hình nuôi trồng nấm bào ngư tận dụng phế phẩm nông nghiệp, bảo vệ môi trường.',
        coverImage: STEM_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1632363065275-f12b6f10359f?q=80&w=800&auto=format&fit=crop', // Mushrooms
        authors: 'Nguyễn Thị Yến, Lê Thị Nết',
        demoUrl: 'https://example.com/demo/mushroom'
    },
    {
        id: '6',
        title: 'Vườn thông minh',
        category: 'Technology',
        group: 'STEM',
        description: 'Hệ thống chăm sóc cây tự động sử dụng công nghệ cảm biến.',
        coverImage: STEM_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=800&auto=format&fit=crop', // Smart garden
        authors: 'Hoàng Thị Sương',
        demoUrl: 'https://example.com/demo/garden'
    },
    {
        id: '7',
        title: 'Hộp bút thông minh',
        category: 'Technology',
        group: 'STEM',
        description: 'Hộp bút tích hợp các tính năng công nghệ hỗ trợ học tập.',
        coverImage: STEM_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae91?q=80&w=800&auto=format&fit=crop', // Stationary
        authors: 'Hoàng Thị Sương',
        demoUrl: 'https://example.com/demo/pencilbox'
    },
    {
        id: '8',
        title: 'Mô hình cảnh báo lũ và sạt lỡ đất',
        category: 'Technology',
        group: 'STEM',
        description: 'Hệ thống cảnh báo sớm thiên tai giúp giảm thiểu thiệt hại.',
        coverImage: STEM_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1454789476662-bdd716092aac?q=80&w=800&auto=format&fit=crop', // Flood/Disaster
        authors: 'Nguyễn Thị A Kim, Lê Thị Thanh Thương',
        demoUrl: 'https://example.com/demo/flood'
    },
    {
        id: '9',
        title: 'Testing Smart Board',
        category: 'IT',
        group: 'STEM',
        description: 'Bảng trắc nghiệm Tiếng Anh thông minh tích hợp AI.',
        coverImage: STEM_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop', // Smart board
        authors: 'Phạm Kiều Oanh, Dương Thị Mỹ Lệ',
        demoUrl: 'https://example.com/smart-board'
    },
    {
        id: '10',
        title: 'Website thư viện học liệu số',
        category: 'IT',
        group: 'STEM',
        description: 'Website thư viện học liệu số và tương tác liên môn.',
        coverImage: STEM_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1507842217121-ad0773cf4a0f?q=80&w=800&auto=format&fit=crop', // Library
        authors: 'Huỳnh Quốc Khánh',
        demoUrl: 'https://example.com/library'
    },
    {
        id: '11',
        title: 'VISION CONTROL',
        category: 'IT',
        group: 'STEM',
        description: 'Ứng dụng xử lý hình ảnh và máy chiếu để chuyển bảng thường thành bảng tương tác thông minh.',
        coverImage: STEM_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop', // Vision
        authors: 'Trịnh Hoàng Sơn',
        demoUrl: 'https://example.com/vision-control'
    },
    {
        id: '12',
        title: 'Công viên Toán học',
        category: 'Math',
        group: 'STEM',
        description: 'Mô hình công viên tích hợp các kiến thức toán học trực quan.',
        coverImage: STEM_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop', // Math park
        authors: 'Nguyễn Thị Vân',
        demoUrl: 'https://example.com/demo/mathpark'
    },
    {
        id: '13',
        title: 'SpiralArt - Nghệ thuật từ chuyển động',
        category: 'Math',
        group: 'STEM',
        description: 'Vẽ hoa văn toán học Spirograph – Nghệ thuật từ chuyển động đều.',
        coverImage: STEM_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1596443686812-2f45229eebc3?q=80&w=800&auto=format&fit=crop', // Spiral art
        authors: 'Trần Thiên Ân, Nguyễn Đức Khôi',
        demoUrl: 'https://example.com/demo/spiral'
    },
    // --- AI APPLICATIONS ---
    {
        id: '14',
        title: 'Ứng dụng AI để tạo video hoạt hình',
        category: 'SocialScience',
        group: 'AI',
        description: 'Học liệu số hỗ trợ dạy học thông qua video hoạt hình.',
        coverImage: AI_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b79931434f3?q=80&w=800&auto=format&fit=crop', // Animation
        authors: 'Võ Thị Thu Bình',
        demoUrl: 'https://example.com/demo/animation'
    },
    {
        id: '15',
        title: 'Bảo tàng số - triển lãm Toán học',
        category: 'Math',
        group: 'AI',
        description: 'Cá nhân hóa học tập thông qua bảo tàng số tương tác.',
        coverImage: AI_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?q=80&w=800&auto=format&fit=crop', // Museum
        authors: 'Trần Thiên Ân',
        demoUrl: 'https://example.com/demo/museum'
    },
    {
        id: '16',
        title: 'Ứng dụng AI thiết kế bài giảng Ngữ Văn 6',
        category: 'SocialScience',
        group: 'AI',
        description: 'Thiết kế bài giảng học liệu số môn Ngữ Văn sử dụng các công cụ AI.',
        coverImage: AI_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop', // Books
        authors: 'Nguyễn Thị Diệu Hiền',
        demoUrl: 'https://example.com/demo/lit'
    },
    {
        id: '17',
        title: 'Bài giảng có giọng nói AI và video sinh động',
        category: 'Technology',
        group: 'AI',
        description: 'Thiết kế bài giảng điện tử sinh động với sự hỗ trợ của AI Voice.',
        coverImage: AI_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?q=80&w=800&auto=format&fit=crop', // Sound wave
        authors: 'Nguyễn Thị Như Ngọc',
        demoUrl: 'https://example.com/demo/voice'
    },
    {
        id: '18',
        title: 'Trò chơi Toán học bằng Canva AI & ChatGPT',
        category: 'Math',
        group: 'AI',
        description: 'Học liệu số và xây dựng công cụ kiểm tra đánh giá môn Toán.',
        coverImage: AI_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop', // Math game
        authors: 'Nguyễn Phước Diễm',
        demoUrl: 'https://example.com/demo/mathgame'
    },
    {
        id: '19',
        title: 'Thiết kế hệ thống phân tích học lực bằng AI',
        category: 'IT',
        group: 'AI',
        description: 'Hệ thống quản lí lớp học và thống kê kết quả học tập thông minh.',
        coverImage: AI_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop', // Analytics
        authors: 'Phạm Tường Vy',
        demoUrl: 'https://example.com/demo/analytics'
    },
    {
        id: '20',
        title: 'Ứng dụng NotebookLM trong môn Tiếng Anh',
        category: 'SocialScience',
        group: 'AI',
        description: 'Trợ lý học tập thông minh cho học sinh môn Tiếng Anh.',
        coverImage: AI_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop', // English learning
        authors: 'Lê Thanh Nghi',
        demoUrl: 'https://example.com/demo/english'
    },
    {
        id: '21',
        title: 'Học kể truyện cùng AI',
        category: 'SocialScience',
        group: 'AI',
        description: 'Bài nói và nghe: Kể lại một truyện cổ tích với sự hỗ trợ của AI.',
        coverImage: AI_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop', // Story book
        authors: 'Nguyễn Phạm Minh Nguyệt',
        demoUrl: 'https://example.com/demo/story'
    },
    {
        id: '22',
        title: 'Ứng dụng AI trong thiết kế bài giảng điện tử',
        category: 'Technology',
        group: 'AI',
        description: 'Xây dựng và thiết kế bài giảng điện tử hiện đại.',
        coverImage: AI_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop', // Digital code
        authors: 'Dương Thị Mỹ Lệ',
        demoUrl: 'https://example.com/demo/lesson'
    },
    {
        id: '23',
        title: 'PeriClick - Bảng tuần hoàn tương tác',
        category: 'NaturalScience',
        group: 'AI',
        description: 'Trợ lý học tập cho học sinh trong môn Hóa học.',
        coverImage: AI_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=800&auto=format&fit=crop', // Chemistry
        authors: 'Huỳnh Quốc Khánh',
        demoUrl: 'https://example.com/demo/periclick'
    },
    {
        id: '24',
        title: 'Hệ thống đánh giá năng lực học sinh',
        category: 'IT',
        group: 'AI',
        description: 'Công cụ phân tích đánh giá, cá nhân hóa lộ trình học tập cho học sinh.',
        coverImage: AI_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop', // Chart
        authors: 'Nguyễn Đông Nam, Nguyễn Trung',
        demoUrl: 'https://script.google.com/macros/s/AKfycbxTqbV3sx8Hvl9EDvN52xbyU0JCDsunEUj5Apmy3h0Ws7RStiro4ftCNk5NQ-Y1urB1/exec'
    },
    {
        id: '25',
        title: 'Bài giảng điện tử: Ethylic Alcohol',
        category: 'NaturalScience',
        group: 'AI',
        description: 'Ứng dụng các công cụ AI trong thiết kế bài giảng điện tử Hóa học.',
        coverImage: AI_COVER_IMAGE,
        imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop', // Chemical structure
        authors: 'Hoàng Thị Lệ Thủy',
        demoUrl: 'https://example.com/demo/chemistry'
    }
];

export const SCHEDULE: ScheduleItem[] = [
    {
        id: '1',
        time: '14:00 - 28/11',
        title: 'Khai trương gian hàng',
        location: 'Gian hàng số 17',
        description: 'Đón tiếp đại biểu và khách tham quan.'
    },
    {
        id: '2',
        time: '09:00 - 29/11',
        title: 'Thi Đấu trường Robotic',
        location: 'Khu vực thi đấu (Gần gian hàng Công ty KSH)',
        description: 'Đội tuyển trường tham gia thi đấu.',
        isHighlight: true
    },
    {
        id: '3',
        time: '09:30 - 29/11',
        title: 'Chấm thi sản phẩm STEM (Vòng 1)',
        location: 'Tại gian hàng',
        description: 'Ban giám khảo chấm điểm các mô hình.'
    },
    {
        id: '4',
        time: '14:00 - 29/11',
        title: 'Hội thi Dân vũ - Flashmob',
        location: 'Sân khấu chính',
        description: 'Đội văn nghệ trường biểu diễn.',
        isHighlight: true
    },
    {
        id: '5',
        time: '15:00 - 29/11',
        title: 'Chấm thi sản phẩm STEM (Vòng 2)',
        location: 'Tại gian hàng',
        description: 'Vòng chấm điểm quyết định.'
    }
];
