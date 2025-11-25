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

export const PROJECTS: Project[] = [
    {
        id: '1',
        title: 'Hệ thống tưới cây tự động IoT',
        category: 'IoT',
        description: 'Mô hình sử dụng cảm biến độ ẩm đất và ESP8266 để tự động tưới nước và gửi thông báo về điện thoại.',
        imageUrl: 'https://picsum.photos/600/400?random=1',
        authors: 'Nhóm Tin học K9'
    },
    {
        id: '2',
        title: 'Robot vận chuyển hàng hóa',
        category: 'Robotics',
        description: 'Robot dò line và tránh vật cản, được lập trình để tham gia cuộc thi Đấu trường Robotic.',
        imageUrl: 'https://picsum.photos/600/400?random=2',
        authors: 'CLB Robotics'
    },
    {
        id: '3',
        title: 'Mô hình Tế bào Động vật 3D',
        category: 'STEM',
        description: 'Mô hình học cụ trực quan làm từ vật liệu tái chế, hỗ trợ môn Sinh học.',
        imageUrl: 'https://picsum.photos/600/400?random=3',
        authors: 'Tổ Sinh - Hóa'
    },
    {
        id: '4',
        title: 'Phần mềm Quản lý Thư viện số',
        category: 'Software',
        description: 'Ứng dụng web giúp tra cứu sách và quản lý mượn trả, tích hợp mã QR.',
        imageUrl: 'https://picsum.photos/600/400?random=4',
        authors: 'Nguyễn Văn A - 9/2'
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