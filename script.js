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
function init_tim_kiem_hang_bk() {
    // Nguồn: Chuyển đổi từ thẻ <script> của file tim-kiem-hang-bk.html
    
    // Bước 1: Lấy tất cả các phần tử DOM cần thiết.
    // Code này sẽ chạy sau khi HTML của trang đã được tải vào, nên sẽ không bị lỗi.
    const maKhoSelect = document.getElementById('maKhoSelect');
    const maUserInput = document.getElementById('maUserInput');
    const maUserSelect = document.getElementById('maUserSelect');
    const searchButton = document.getElementById('searchButton');
    const clearButton = document.getElementById('clearButton'); // THÊM MỚI: Lấy nút Xóa
    const buttonText = document.getElementById('buttonText');
    const resultTableContainer = document.getElementById('resultTableContainer');
    const resultTableBody = document.getElementById('resultTableBody');
    const errorMessage = document.getElementById('errorMessage');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const loadingMessage = document.getElementById('loadingMessage');

    // Bước 2: Chuyển các hàm trợ giúp vào bên trong.
    // Chúng sẽ trở thành các hàm cục bộ, không ảnh hưởng đến các trang khác.
    function resetButtonState() {
        searchButton.disabled = false;
        buttonText.textContent = 'Tìm Kiếm';
        loadingMessage.style.display = 'none';
    }

    function clearSearch() {
        maKhoSelect.value = '';
        maUserInput.value = '';
        maUserSelect.value = '';
        resultTableContainer.style.display = 'none';
        resultTableBody.innerHTML = '';
        errorMessage.textContent = '';
        noResultsMessage.style.display = 'none';
        maKhoSelect.classList.remove('input-error');
        maUserInput.classList.remove('input-error');
        resetButtonState();
    }

    // Bước 3: Gắn sự kiện cho các nút bằng addEventListener.
    // Đây là cách làm hiện đại thay cho "onclick" trong HTML.
    searchButton.addEventListener('click', searchTimHangBK);
    clearButton.addEventListener('click', clearSearch);

    // Bước 4: Viết lại hàm tìm kiếm chính sử dụng async/await và getAPI.
    async function searchTimHangBK() {
        const maKho = maKhoSelect.value;
        const maUser = maUserInput.value.trim();

        // Reset giao diện
        resultTableContainer.style.display = 'none';
        resultTableBody.innerHTML = '';
        errorMessage.textContent = '';
        noResultsMessage.style.display = 'none';
        maKhoSelect.classList.remove('input-error');
        maUserInput.classList.remove('input-error');

        // Kiểm tra điều kiện (giữ nguyên)
        let hasError = false;
        if (!maKho) {
            errorMessage.textContent = 'Vui lòng chọn Mã Kho. ';
            maKhoSelect.classList.add('input-error');
            hasError = true;
        }
        if (!maUser) {
            errorMessage.textContent += 'Vui lòng nhập hoặc chọn Mã Nhân Viên.';
            maUserInput.classList.add('input-error');
            hasError = true;
        }
        if (hasError) {
            return;
        }

        // Hiển thị trạng thái loading
        searchButton.disabled = true;
        buttonText.textContent = 'Đang tìm...';
        loadingMessage.style.display = 'block';

        // === PHẦN THAY THẾ QUAN TRỌNG NHẤT ===
        // Thay thế google.script.run bằng lời gọi getAPI
        try {
            // Gọi API với action là 'searchHangBK' và truyền tham số
            const results = await getAPI('searchHangBK', { maKho: maKho, maUser: maUser });

            resetButtonState();
            console.log("Dữ liệu nhận được từ API:", results);

            if (results && results.length > 0) {
                results.forEach(rowData => {
                    const row = resultTableBody.insertRow();
                    row.insertCell().textContent = rowData.maNV;
                    row.insertCell().textContent = rowData.maTaiSan;
                    row.insertCell().textContent = rowData.tenTaiSan;
                    row.insertCell().textContent = rowData.loaiTaiSan;
                    row.insertCell().textContent = rowData.ngayNhap;
                    row.insertCell().textContent = rowData.trangThai;
                    row.insertCell().textContent = rowData.maKho;
                    row.insertCell().textContent = rowData.tenKho;
                    row.insertCell().textContent = rowData.userVaTenSoHuu;
                });
                resultTableContainer.style.display = 'block';
            } else {
                noResultsMessage.style.display = 'block';
                resultTableContainer.style.display = 'block'; // Hiển thị container để thấy thông báo
            }

        } catch (error) {
            // Xử lý lỗi nếu lời gọi API thất bại
            resetButtonState();
            errorMessage.textContent = 'Đã xảy ra lỗi kết nối: ' + error.message;
            console.error("Lỗi gọi API:", error);
        }
    }
}
