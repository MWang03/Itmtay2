// ============================================================
// === 1. CẤU HÌNH VÀ KHAI BÁO BIẾN ============================
// ============================================================
// PHẦN THÊM MỚI: Thay thế URL này bằng URL Web App của bạn sau khi triển khai
const API_URL = 'https://script.google.com/macros/s/AKfycbwCpOj3lKBBMUqDSeKoimocQwwA4VjaUWag4p-1hl5yLjNKAd5GXNGgAO2RZyTvdx9jUQ/exec';

// Cấu hình menu (Nguồn: Sao chép từ thẻ <script> của file index.html gốc)
const leftMenuData = [ /* ... Toàn bộ cấu hình menu của bạn ... */ ];
const rightMenuData = [ /* ... Toàn bộ cấu hang menu của bạn ... */ ];

// DOM Elements
const functionContent = document.getElementById('functionContent');
const loadingSpinner = document.getElementById('loadingSpinner');
const currentPageTitle = document.getElementById('current-page-title');
// ... các element khác

// ============================================================
// === 2. KHỞI TẠO ỨNG DỤNG ====================================
// ============================================================

// PHẦN THÊM MỚI: Listener chính để khởi động App
document.addEventListener('DOMContentLoaded', () => {
    const sessionId = sessionStorage.getItem('appSessionId');
    if (!sessionId) {
        // Nếu không có session, chuyển hướng đến trang đăng nhập
        window.location.href = 'login.html';
        return;
    }
    // Nếu có session, xác thực và khởi tạo App
    initializeApp(sessionId);
});

async function initializeApp(sessionId) {
    // PHẦN THÊM MỚI: Xác thực session với backend
    const validationResponse = await postAPI('verifySession', { clientSessionId: sessionId });
    
    if (!validationResponse.isValid) {
        sessionStorage.removeItem('appSessionId');
        alert(validationResponse.message || 'Phiên không hợp lệ. Vui lòng đăng nhập lại.');
        window.location.href = 'login.html';
        return;
    }

    // Nếu session hợp lệ, hiển thị App và tải dữ liệu
    document.getElementById('initial-loading-overlay').style.display = 'none';
    document.getElementById('app-container').style.display = 'flex';
    document.getElementById('app-container').style.flexDirection = 'column';


    renderLeftMenu();
    renderRightMenu();
    // ... (Toàn bộ các hàm khởi tạo giao diện từ script gốc) ...

    loadPage('thong-bao', 'BẢNG TIN CÔNG VIỆC');
}

// ============================================================
// === 3. HÀM TẢI TRANG VÀ GỌI API (PHẦN THÊM MỚI) =============
// ============================================================
async function loadPage(pageName, pageTitle) {
    // ... (Code hàm loadPage đã cung cấp ở câu trả lời trước, dùng fetch để tải HTML) ...
}

async function getAPI(action, params = {}) {
    // Hàm chung để gọi các API GET
    const url = new URL(API_URL);
    url.searchParams.append('action', action);
    for (const key in params) {
        url.searchParams.append(key, params[key]);
    }
    const response = await fetch(url);
    return response.json();
}

async function postAPI(action, body = {}) {
    // Hàm chung để gọi các API POST
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action, ...body })
    });
    return response.json();
}

// ============================================================
// === 4. LOGIC CỦA CÁC TRANG (INIT FUNCTIONS) =================
// ============================================================
// PHẦN THÊM MỚI: Đây là nơi logic từ các thẻ <script> của file con được chuyển vào
async function init_thong_bao() {
    const contentDiv = document.getElementById('notification-page-content');
    const spinner = document.getElementById('loading-spinner-local');
    
    const data = await getAPI('getNotifications');
    
    spinner.style.display = 'none';
    if (data.error) {
        contentDiv.innerHTML = `<p style="color: red;">Lỗi: ${data.message}</p>`;
        return;
    }
    // Gọi hàm render giao diện thông báo (hàm này được chuyển từ script gốc)
    renderNotificationPage(data);
}

function init_tim_kiem_sieu_thi() {
    const searchButton = document.getElementById('searchButton');
    const clearButton = document.getElementById('clearButton');
    const maSTInput = document.getElementById('maSTInput');
    // ...

    searchButton.addEventListener('click', async () => {
        // ... (hiển thị loading)
        const result = await getAPI('searchStore', { maST: maSTInput.value });
        // ... (ẩn loading, hiển thị kết quả/lỗi)
    });

    clearButton.addEventListener('click', () => { /* ... */ });
}

// ... Thêm các hàm init_... khác cho các trang còn lại ...
