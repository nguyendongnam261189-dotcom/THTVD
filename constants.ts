
import { Project, ScheduleItem } from './types';

export const SCHOOL_NAME = "TRƯỜNG TRUNG HỌC CƠ SỞ NGUYỄN BỈNH KHIÊM";
export const BOOTH_NUMBER = "40";

export const FESTIVAL_CONTEXT = `
Bạn là trợ lý ảo AI tại gian hàng số 40 của Trường Trung Học Cơ Sở Nguyễn Bỉnh Khiêm tham gia "Ngày hội Chung tay Cải cách hành chính và Chuyển đổi số năm 2025" tại phường Hòa Khánh.
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

// HƯỚNG DẪN:
// 1. Tải ảnh hoa hướng dương của bạn lên thư mục 'public' và đổi tên thành 'sunflower.png'
// 2. Tải ảnh đại diện AI của bạn lên thư mục 'public' và đổi tên thành 'ai.png'

const STEM_COVER_IMAGE = "/sunflower.png";
const AI_COVER_IMAGE = "/ai.png";


export const PROJECTS: Project[] = [
    // --- STEM PROJECTS ---
    {
        id: '1',
        title: 'Bản đồ Việt Nam thông minh - Smartmap 34',
        category: 'Environment',
        group: 'STEM',
        description: 'Mô hình bản đồ tương tác giúp tìm hiểu địa lý và môi trường Việt Nam.',
        coverImage: "/01.png", // Map illustration
        imageUrl: "/01.png", // Map illustration
        authors: 'Nguyễn Thị Diệu Hiền, Phan Thị Ngọc Lý',
        demoUrl: 'https://sites.google.com/view/stemthcsnguyenbinhkhiem/b%E1%BA%A3n-%C4%91%E1%BB%93-vi%E1%BB%87t-nam-th%C3%B4ng-minh-smartmap-34'
    },
    {
        id: '2',
        title: 'Renewable Energy Usage Model',
        category: 'Environment',
        group: 'STEM',
        description: 'Mô hình năng lượng tái tạo tích hợp AI, tối ưu hóa việc sử dụng năng lượng sạch.',
        coverImage: "/02.png", // Renewable energy
        imageUrl:  "/02.png", // Renewable energy
        authors: 'Phạm Kiều Oanh, Dương Thị Mỹ Lệ',
        demoUrl: 'https://sites.google.com/view/stemthcsnguyenbinhkhiem/renewable-energy-usage-model-m%C3%B4-h%C3%ACnh-n%C4%83ng-l%C6%B0%E1%BB%A3ng-t%C3%A1i-t%E1%BA%A1o-t%C3%ADch-h%E1%BB%A3p-ai'
    },
    {
        id: '3',
        title: 'Hệ thống giám sát môi trường IoT & Chatbot',
        category: 'IT',
        group: 'STEM',
        description: 'Hệ thống giám sát và điều khiển chất lượng môi trường, phòng chống cháy nổ sử dụng IOT và CHATBOT.',
        coverImage: "/03.png", // IoT
        imageUrl:  "/03.png", // IoT
        authors: 'Nguyễn Thị Thu Lợi',
        demoUrl: 'https://sites.google.com/view/stemthcsnguyenbinhkhiem/h%E1%BB%87-th%E1%BB%91ng-gi%C3%A1m-s%C3%A1t-v%C3%A0-%C4%91i%E1%BB%81u-khi%E1%BB%83n-ch%E1%BA%A5t-l%C6%B0%E1%BB%A3ng-m%C3%B4i-tr%C6%B0%E1%BB%9Dng-ph%C3%B2ng-ch%E1%BB%91ng-ch%C3%A1y-n%E1%BB%95'
    },
    {
        id: '4',
        title: 'Dự án: “Đà Nẵng, kế thừa và phát triển”',
        category: 'Technology',
        group: 'STEM',
        description: 'Mô hình thể hiện sự phát triển đô thị bền vững của Đà Nẵng.',
        coverImage: "/04.png", // Danang/City
        imageUrl:  "/04.png", // Danang/City
        authors: 'Nguyễn Thị Hoài Thi, Trần Nguyễn Huyền Trang',
        demoUrl: 'https://sites.google.com/view/stemthcsnguyenbinhkhiem/d%E1%BB%B1-%C3%A1n-%C4%91%C3%A0-n%E1%BA%B5ng-k%E1%BA%BF-th%E1%BB%ABa-v%C3%A0-ph%C3%A1t-tri%E1%BB%83n'
    },
    {
        id: '5',
        title: 'Nấm Bào Ngư tái sinh',
        category: 'Environment',
        group: 'STEM',
        description: 'Mô hình nuôi trồng nấm bào ngư tận dụng phế phẩm nông nghiệp, bảo vệ môi trường.',
        coverImage: "/05.png", // Mushrooms
        imageUrl:  "/05.png", // Mushrooms
        authors: 'Nguyễn Thị Yến, Lê Thị Nết',
        demoUrl: 'https://www.google.com/search?q=https://sites.google.com/view/stemthcsnguyenbinhkhiem/n%25E1%25BA%25A5m-b%25C3%25A%C3%A0o-ng%25C6%25B0-t%25C3%25A%C3%A1i-sinh'
    },
    {
        id: '6',
        title: 'Vườn thông minh',
        category: 'Technology',
        group: 'STEM',
        description: 'Hệ thống chăm sóc cây tự động sử dụng công nghệ cảm biến.',
        coverImage: "/06.png", // Smart garden
        imageUrl:  "/06.png", // Smart garden
        authors: 'Hoàng Thị Sương',
        demoUrl: 'https://thingsboard.cloud/dashboards/all'
    },
    {
        id: '7',
        title: 'Hộp bút thông minh',
        category: 'Technology',
        group: 'STEM',
        description: 'Hộp bút tích hợp các tính năng công nghệ hỗ trợ học tập.',
        coverImage: "/07.png", // Stationary
        imageUrl:  "/07.png", // Stationary
        authors: 'Hoàng Thị Sương',
        demoUrl: 'https://sites.google.com/view/stemthcsnguyenbinhkhiem/h%E1%BB%99p-b%C3%BAt-th%C3%B4ng-minh'
    },
    {
        id: '8',
        title: 'Mô hình cảnh báo lũ và sạt lỡ đất',
        category: 'Technology',
        group: 'STEM',
        description: 'Hệ thống cảnh báo sớm thiên tai giúp giảm thiểu thiệt hại.',
        coverImage:"/08.png", // Flood/Disaster
        imageUrl:  "/08.png", // Flood/Disaster
        authors: 'Nguyễn Thị A Kim, Lê Thị Thanh Thương',
        demoUrl: 'https://sites.google.com/view/stemthcsnguyenbinhkhiem/m%C3%B4-h%C3%ACnh-c%E1%BA%A3nh-b%C3%A1o-l%C5%A9-v%C3%A0-s%E1%BA%A1t-l%E1%BB%9F-%C4%91%E1%BA%A5t'
    },
    {
        id: '9',
        title: 'Testing Smart Board',
        category: 'IT',
        group: 'STEM',
        description: 'Bảng trắc nghiệm Tiếng Anh thông minh tích hợp AI.',
        coverImage: "/09.png", // Smart board
        imageUrl:  "/09.png", // Smart board
        authors: 'Phạm Kiều Oanh, Dương Thị Mỹ Lệ',
        demoUrl: 'https://sites.google.com/view/stemthcsnguyenbinhkhiem/testing-smart-board-b%E1%BA%A3ng-tr%E1%BA%AFc-nghi%E1%BB%87m-ti%E1%BA%BFng-anh-th%C3%B4ng-minh-t%C3%ADch-h%E1%BB%A3p-ai'
    },
    {
        id: '10',
        title: 'Website thư viện học liệu số',
        category: 'IT',
        group: 'STEM',
        description: 'Website thư viện học liệu số và tương tác liên môn.',
        coverImage:  "/10.png", // Library
        imageUrl:  "/10.png", // Library
        authors: 'Huỳnh Quốc Khánh',
        demoUrl: 'https://khoahoctunhien.edu.vn/'
    },
    {
        id: '11',
        title: 'VISION CONTROL',
        category: 'IT',
        group: 'STEM',
        description: 'Ứng dụng xử lý hình ảnh và máy chiếu để chuyển bảng thường thành bảng tương tác thông minh.',
        coverImage: "/11.png", // Vision
        imageUrl:  "/11.png", // Vision
        authors: 'Trịnh Hoàng Sơn',
        demoUrl: 'https://sites.google.com/view/stemthcsnguyenbinhkhiem/vision-control-%E1%BB%A9ng-d%E1%BB%A5ng-x%E1%BB%AD-l%C3%BD-h%C3%ACnh-%E1%BA%A3nh-v%C3%A0-m%C3%A1y-chi%E1%BA%BFu-%C4%91%E1%BB%83-chuy%E1%BB%83n-b%E1%BA%A3ng-th%C6%B0%E1%BB%9Dng'
    },
    {
        id: '12',
        title: 'Công viên Toán học',
        category: 'Math',
        group: 'STEM',
        description: 'Mô hình công viên tích hợp các kiến thức toán học trực quan.',
        coverImage: "/12.png", // Math park
        imageUrl:  "/12.png", // Math park
        authors: 'Nguyễn Thị Vân',
        demoUrl: 'https://sites.google.com/view/stemthcsnguyenbinhkhiem/c%C3%B4ng-vi%C3%AAn-to%C3%A1n-h%E1%BB%8Dc'
    },
    {
        id: '13',
        title: 'SpiralArt - Nghệ thuật từ chuyển động',
        category: 'Math',
        group: 'STEM',
        description: 'Vẽ hoa văn toán học Spirograph – Nghệ thuật từ chuyển động đều.',
        coverImage: "/13.png", // Spiral art
        imageUrl:  "/13.png", // Spiral art
        authors: 'Trần Thiên Ân, Nguyễn Đức Khôi',
        demoUrl: 'https://sites.google.com/view/stemthcsnguyenbinhkhiem/spiralart-v%E1%BA%BD-hoa-v%C4%83n-to%C3%A1n-h%E1%BB%8Dc-spirograph-ngh%E1%BB%87-thu%E1%BA%ADt-t%E1%BB%AB-chuy%E1%BB%83n-%C4%91%E1%BB%99ng-%C4%91%E1%BB%81u'
    },
    // --- AI APPLICATIONS ---
    {
        id: '14',
        title: 'Ứng dụng AI để tạo video hoạt hình',
        category: 'SocialScience',
        group: 'AI',
        description: 'Học liệu số hỗ trợ dạy học thông qua video hoạt hình.',
        coverImage: "/cover14.avif",
        imageUrl: "/cover14.avif", 
        authors: 'Võ Thị Thu Bình',
        demoUrl: 'https://sites.google.com/view/stemthcsnguyenbinhkhiem/%E1%BB%A9ng-d%E1%BB%A5ng-ai-%C4%91%E1%BB%83-t%E1%BA%A1o-video-ho%E1%BA%A1t-h%C3%ACnh'
    },
    {
        id: '15',
        title: 'Bảo tàng số - triển lãm Toán học',
        category: 'Math',
        group: 'AI',
        description: 'Cá nhân hóa học tập thông qua bảo tàng số tương tác.',
        coverImage: "/cover15.avif",
        imageUrl: "/cover15.avif", // Museum
        authors: 'Trần Thiên Ân',
        demoUrl: 'https://sites.google.com/view/stemthcsnguyenbinhkhiem/b%E1%BA%A3o-t%C3%A0ng-s%E1%BB%91-tri%E1%BB%83n-l%C3%A3m-to%C3%A1n-h%E1%BB%8Dc'
    },
    {
        id: '16',
        title: 'Ứng dụng AI thiết kế bài giảng Ngữ Văn 6',
        category: 'SocialScience',
        group: 'AI',
        description: 'Thiết kế bài giảng học liệu số môn Ngữ Văn sử dụng các công cụ AI.',
        coverImage: "/cover16.avif",
        imageUrl: "/cover16.avif", // Books
        authors: 'Nguyễn Thị Diệu Hiền',
        demoUrl: 'https://sites.google.com/view/stemthcsnguyenbinhkhiem/%E1%BB%A9ng-d%E1%BB%A5ng-c%C3%A1c-c%C3%B4ng-c%E1%BB%A5-ai-%C4%91%E1%BB%83-thi%E1%BA%BFt-k%E1%BA%BF-b%C3%A0i-gi%E1%BA%A3ng-ng%E1%BB%AF-v%C4%83n-6'
    },
    {
        id: '17',
        title: 'Bài giảng có giọng nói AI và video sinh động',
        category: 'Technology',
        group: 'AI',
        description: 'Thiết kế bài giảng điện tử sinh động với sự hỗ trợ của AI Voice.',
        coverImage: "/cover17.avif",
        imageUrl: "/cover17.avif", // Sound wave
        authors: 'Nguyễn Thị Như Ngọc',
        demoUrl: 'https://www.google.com/search?q=https://sites.google.com/view/stemthcsnguyenbinhkhiem/thi%25E1%25BA%25BFt-k%25E1%25BA%25BF-b%25C3%25A0i-gi%25E1%25BA%25A3ng-c%25C3%25B3-gi%25E1%25BB%258Dng-n%25C3%25B3i-ai-v%25C3%25A0-video-sinh-%25C4%2591i%25E1%25BB%2599ng'
    },
    {
        id: '18',
        title: 'Trò chơi Toán học bằng Canva AI & ChatGPT',
        category: 'Math',
        group: 'AI',
        description: 'Học liệu số và xây dựng công cụ kiểm tra đánh giá môn Toán.',
        coverImage: "/cover18.avif",
        imageUrl: "/cover18.avif", // Math game
        authors: 'Nguyễn Phước Diễm',
        demoUrl: 'https://sites.google.com/view/stemthcsnguyenbinhkhiem/thi%E1%BA%BFt-k%E1%BA%BF-tr%C3%B2-ch%C6%A1i-to%C3%A1n-h%E1%BB%8Dc-b%E1%BA%B1ng-canva-ai-v%C3%A0-chatgpt'
    },
    {
        id: '19',
        title: 'Thiết kế hệ thống phân tích học lực bằng AI',
        category: 'IT',
        group: 'AI',
        description: 'Hệ thống quản lí lớp học và thống kê kết quả học tập thông minh.',
        coverImage: "/cover19.avif",
        imageUrl: "/cover19.avif", // Analytics
        authors: 'Phạm Tường Vy',
        demoUrl: 'http://sites.google.com/view/stemthcsnguyenbinhkhiem/thi%E1%BA%BFt-k%E1%BA%BF-h%E1%BB%87-th%E1%BB%91ng-ph%C3%A2n-t%C3%ADch-h%E1%BB%8Dc-l%E1%BB%B1c-b%E1%BA%B1ng-ai'
    },
    {
        id: '20',
        title: 'Ứng dụng NotebookLM trong môn Tiếng Anh',
        category: 'SocialScience',
        group: 'AI',
        description: 'Trợ lý học tập thông minh cho học sinh môn Tiếng Anh.',
        coverImage: "/cover20.avif",
        imageUrl: "/cover20.avif", // English learning
        authors: 'Lê Thanh Nghi',
        demoUrl: 'https://sites.google.com/view/stemthcsnguyenbinhkhiem/%E1%BB%A9ng-d%E1%BB%A5ng-notebooklm-trong-m%C3%B4n-ti%E1%BA%BFng-anh'
    },
    {
        id: '21',
        title: 'Học kể truyện cùng AI',
        category: 'SocialScience',
        group: 'AI',
        description: 'Bài nói và nghe: Kể lại một truyện cổ tích với sự hỗ trợ của AI.',
        coverImage: "/cover21.avif",
        imageUrl: "/cover21.avif", // Story book
        authors: 'Nguyễn Phạm Minh Nguyệt',
        demoUrl: 'https://sites.google.com/view/stemthcsnguyenbinhkhiem/h%E1%BB%8Dc-k%E1%BB%83-truy%E1%BB%87n-c%C3%B9ng-ai-b%C3%A0i-n%C3%B3i-v%C3%A0-nghe-k%E1%BB%83-l%E1%BA%A1i-m%E1%BB%99t-truy%E1%BB%87n-c%E1%BB%95-t%C3%ADch'
    },
    {
        id: '22',
        title: 'Ứng dụng AI trong thiết kế bài giảng điện tử',
        category: 'Technology',
        group: 'AI',
        description: 'Xây dựng và thiết kế bài giảng điện tử hiện đại.',
        coverImage: "/cover22.avif",
        imageUrl: "/cover22.avif", // Digital code
        authors: 'Dương Thị Mỹ Lệ',
        demoUrl: 'https://sites.google.com/view/stemthcsnguyenbinhkhiem/%E1%BB%A9ng-d%E1%BB%A5ng-c%C3%A1c-c%C3%B4ng-c%E1%BB%A5-ai-trong-x%C3%A2y-d%E1%BB%B1ng-v%C3%A0-thi%E1%BA%BFt-k%E1%BA%BF-b%C3%A0i-gi%E1%BA%A3ng-%C4%91i%E1%BB%87n-t%E1%BB%AD'
    },
    {
        id: '23',
        title: 'PeriClick - Bảng tuần hoàn tương tác',
        category: 'NaturalScience',
        group: 'AI',
        description: 'Trợ lý học tập cho học sinh trong môn Hóa học.',
        coverImage: "/cover23.avif",
        imageUrl: "/cover23.avif", // Chemistry
        authors: 'Huỳnh Quốc Khánh',
        demoUrl: 'https://khoahoctunhien.edu.vn/'
    },
    {
        id: '24',
        title: 'Hệ thống đánh giá năng lực học sinh',
        category: 'IT',
        group: 'AI',
        description: 'Công cụ phân tích đánh giá, cá nhân hóa lộ trình học tập cho học sinh.',
        coverImage: "/cover24.avif",
        imageUrl: "/cover24.avif", // Chart
        authors: 'Nguyễn Đông Nam, Nguyễn Trung',
        demoUrl: 'https://script.google.com/macros/s/AKfycbzqBr83WXuI_dpgbktFNOreNywO4VSpDxOwhQDQVeu6SJc7uKN6xo2RDYpLPw16-1A4/exec'
    },
    {
        id: '25',
        title: 'Bài giảng điện tử: Ethylic Alcohol',
        category: 'NaturalScience',
        group: 'AI',
        description: 'Ứng dụng các công cụ AI trong thiết kế bài giảng điện tử Hóa học.',
        coverImage: "/cover25.avif",
        imageUrl: "/cover25.avif", // Chemical structure
        authors: 'Hoàng Thị Lệ Thủy',
        demoUrl: 'https://sites.google.com/view/stemthcsnguyenbinhkhiem/%E1%BB%A9ng-d%E1%BB%A5ng-c%C3%A1c-c%C3%B4ng-c%E1%BB%A5-ai-trong-thi%E1%BA%BFt-k%E1%BA%BF-b%C3%A0i-gi%E1%BA%A3ng-%C4%91i%E1%BB%87n-t%E1%BB%AD-b%C3%A0i-26-ethylic-a'
    }
];

export const SCHEDULE: ScheduleItem[] = [
    {
        id: '1',
        time: '14:00 - 28/11',
        title: 'Khai trương gian hàng',
        location: 'Gian hàng số 40',
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
