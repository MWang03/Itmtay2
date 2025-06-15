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
function init_tk_bhx_toi_uu() {
    // Nguồn: Chuyển đổi từ thẻ <script> của file tk-bhx-toi-uu.html
    
    // Bước 1: Lấy các phần tử DOM cần thiết
    const searchBtn = document.getElementById('searchBtn');
    const resultsContainer = document.getElementById('results-container-bhx');
    const spinner = document.getElementById('loadingSpinner-bhx');
    const userInputElement = document.getElementById('maUserInput');
    const storeInputElement = document.getElementById('maSieuThiInput');

    // Bước 2: Gắn sự kiện cho nút tìm kiếm
    searchBtn.addEventListener('click', searchData);

    // Bước 3: Hàm hỗ trợ (giữ nguyên từ script gốc)
    function escapeHtml(unsafe) {
        if (unsafe === null || typeof unsafe === 'undefined') {
            return '';
        }
        return unsafe.toString()
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
    }

    // Bước 4: Viết lại hàm tìm kiếm chính sử dụng async/await và getAPI
    async function searchData() {
        const maUserValue = userInputElement ? userInputElement.value : '';
        const maSieuThiValue = storeInputElement ? storeInputElement.value : '';
        
        resultsContainer.innerHTML = '';
        spinner.style.display = 'block';

        if (!maUserValue || maUserValue.trim() === '') {
            spinner.style.display = 'none';
            resultsContainer.innerHTML = '<p class="message-bhx error-message-bhx">Vui lòng nhập Mã USER để tìm kiếm.</p>';
            return;
        }

        // === PHẦN THAY THẾ QUAN TRỌNG ===
        try {
            // Gọi API với action 'searchBHX' và truyền tham số
            const results = await getAPI('searchBHX', { 
                maUser: maUserValue, 
                maSieuThi: maSieuThiValue 
            });
            
            spinner.style.display = 'none';

            if (results && results.length > 0) {
                let tableHtml = '<table class="results-table-bhx"><thead><tr>' +
                    '<th>Mã ST</th><th>Tên ST</th><th>Mã User</th><th>Model</th>' +
                    '<th>SL Tồn</th><th>SL Thiếu</th><th>SL Dư</th><th>Ghi Chú</th>' +
                    '</tr></thead><tbody>';

                results.forEach(function(row) {
                    tableHtml += '<tr>' +
                        `<td>${escapeHtml(row.maSieuThi)}</td>` +
                        `<td>${escapeHtml(row.tenSieuThi)}</td>` +
                        `<td>${escapeHtml(row.maUser)}</td>` +
                        `<td>${escapeHtml(row.model)}</td>` +
                        `<td>${escapeHtml(row.slTon)}</td>` +
                        `<td>${escapeHtml(row.slThieu)}</td>` +
                        `<td>${escapeHtml(row.slDu)}</td>` +
                        `<td>${escapeHtml(row.ghiChu)}</td>` +
                        '</tr>';
                });

                tableHtml += '</tbody></table>';
                resultsContainer.innerHTML = tableHtml;
            } else {
                resultsContainer.innerHTML = '<p class="message-bhx no-results-message-bhx">Không tìm thấy dữ liệu nào phù hợp.</p>';
            }

        } catch (error) {
            spinner.style.display = 'none';
            resultsContainer.innerHTML = `<p class="message-bhx error-message-bhx">Đã xảy ra lỗi: ${error.message}</p>`;
        }
    }
}
async function init_tim_kiem_sheet() {
    // Nguồn: Chuyển đổi và nâng cấp từ thẻ <script> của file tim-kiem-sheet.html

    // Bước 1: Lấy các phần tử DOM
    const dropdown = document.getElementById('sheetDropdown');
    const resultContainer = document.getElementById('resultContainer');

    if (!dropdown || !resultContainer) {
        console.error("Lỗi: Không tìm thấy phần tử dropdown hoặc result container.");
        return;
    }

    // Bước 2: Viết hàm để tải và hiển thị dữ liệu sheet
    async function loadSheetData() {
        const selectedSheet = dropdown.value;
        if (!selectedSheet) {
            resultContainer.innerHTML = '<p class="loading-message">Vui lòng chọn một sheet để xem dữ liệu.</p>';
            return;
        }

        resultContainer.innerHTML = '<div class="spinner"></div>'; // Hiển thị spinner

        // === PHẦN THAY THẾ QUAN TRỌNG ===
        try {
            // Gọi API để lấy dữ liệu thô (mảng 2 chiều)
            const data = await getAPI('getDataFromSheet', { sheetName: selectedSheet });

            if (!data || data.length === 0) {
                resultContainer.innerHTML = '<p>Không có dữ liệu trong sheet này.</p>';
                return;
            }

            // Xây dựng bảng HTML từ dữ liệu thô ở phía frontend
            let tableHtml = '<table border="1" style="border-collapse: collapse; width: 100%; font-size: 14px;">';
            // Dòng tiêu đề
            tableHtml += '<thead style="background-color:#f1f1f1; font-weight:bold;"><tr>';
            data[0].forEach(headerCell => {
                tableHtml += `<th>${headerCell || ''}</th>`;
            });
            tableHtml += '</tr></thead>';

            // Các dòng dữ liệu
            tableHtml += '<tbody>';
            for (let i = 1; i < data.length; i++) {
                tableHtml += '<tr>';
                data[i].forEach(cell => {
                    tableHtml += `<td>${cell === null ? '' : cell}</td>`;
                });
                tableHtml += '</tr>';
            }
            tableHtml += '</tbody></table>';

            resultContainer.innerHTML = tableHtml;

        } catch (error) {
            resultContainer.innerHTML = `<p style="color: red;">Lỗi khi tải dữ liệu: ${error.message}</p>`;
        }
    }
    
    // Bước 3: Gắn sự kiện change cho dropdown
    dropdown.addEventListener('change', loadSheetData);
    
    // Bước 4: Tải danh sách sheet cho lần đầu tiên
    try {
        // Gọi API để lấy danh sách tên các sheet
        const sheetNames = await getAPI('getAllSheetNames');

        dropdown.innerHTML = '<option value="">-- Chọn một sheet --</option>'; // Xóa "Đang tải..."
        if (sheetNames && sheetNames.length > 0) {
            sheetNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                dropdown.appendChild(option);
            });
        } else {
            dropdown.innerHTML += '<option value="">-- Không có sheet nào --</option>';
        }
        resultContainer.innerHTML = '<p class="loading-message">Vui lòng chọn một sheet để xem dữ liệu.</p>';
        
    } catch (error) {
        dropdown.innerHTML = '<option value="">-- Lỗi tải danh sách sheet --</option>';
        resultContainer.innerHTML = `<p style="color: red;">Lỗi tải danh sách sheet: ${error.message}</p>`;
    }
}
function init_tim_kiem_sieu_thi() {
    // Nguồn: Chuyển đổi từ thẻ <script> của file tim-kiem-sieu-thi.html

    // Bước 1: Lấy các phần tử DOM
    const maSTInput = document.getElementById('maSTInput');
    const searchButton = document.getElementById('searchButton');
    const clearButton = document.getElementById('clearButton');
    const buttonText = document.getElementById('buttonText');
    const resultOutput = document.getElementById('resultOutput');
    const errorMessage = document.getElementById('errorMessage');
    const loadingMessage = document.getElementById('loadingMessage');
    const suggestionsBox = document.getElementById('suggestions-box');
    
    let isSearching = false; // Biến kiểm soát trạng thái tìm kiếm

    // Bước 2: Chuyển các hàm trợ giúp vào bên trong
    function resetButtonState() {
        isSearching = false; 
        searchButton.disabled = false;
        buttonText.textContent = 'Tìm Kiếm';
        loadingMessage.style.display = 'none';
    }

    function clearSearch() {
        maSTInput.value = '';
        resultOutput.style.display = 'none';
        errorMessage.textContent = '';
        maSTInput.classList.remove('error');
        suggestionsBox.style.display = 'none';
        resetButtonState();
    }

    function formatResult(data) {
        // Hàm này giữ nguyên logic từ script gốc
        const createRow = (icon, label, value, delay) => `
            <div class="result-row" style="animation-delay: ${delay}s;">
                <i class="fas ${icon} result-icon"></i>
                <span class="result-label">${label}</span>
                <span class="result-value">${value}</span>
            </div>`;
        
        return `
        <div class="result-card">
            <div class="result-main-title">KẾT QUẢ TÌM KIẾM: ${data.maCN}</div>
            <div class="result-section">
                <div class="result-section-title"><i class="fas fa-info-circle"></i> THÔNG TIN SIÊU THỊ</div>
                ${createRow('fa-barcode', 'Mã CN:', `<strong>${data.maCN}</strong>`, 0.1)}
                ${createRow('fa-store', 'Tên ST:', `<strong>${data.tenST}</strong>`, 0.2)}
                ${createRow('fa-calendar-alt', 'Khai Trương:', data.khaiTruong, 0.3)}
                ${createRow('fa-map-marker-alt', 'Maps:', `<a href="${data.maps}" target="_blank">Xem trên bản đồ</a>`, 0.4)}
                ${createRow('fa-user-cog', 'IT KV:', data.itKV, 0.5)}
                ${createRow('fa-user-shield', 'Admin:', data.admin, 0.6)}
            </div>
            <div class="result-section">
                <div class="result-section-title"><i class="fas fa-tools"></i> BẢO TRÌ - KIỂM KÊ</div>
                ${createRow('fa-calendar-check', 'Ngày BT-KK:', data.ngayBTKK, 0.7)}
                ${createRow('fa-file-alt', 'BC Bảo Trì:', data.bcBT, 0.8)}
                ${createRow('fa-clipboard-check', 'BC Kiểm Kê:', data.bcKK, 0.9)}
            </div>
        </div>`;
    }

    // Bước 3: Viết lại các hàm xử lý sự kiện với getAPI
    async function handleSuggestionInput() {
        if (isSearching) return;
        const inputText = maSTInput.value;
        if (inputText.length < 2) {
            suggestionsBox.style.display = 'none';
            return;
        }
        
        // THAY THẾ: Gọi API để lấy gợi ý
        const suggestions = await getAPI('getStoreSuggestions', { partialCode: inputText });
        
        if (suggestions && suggestions.length > 0) {
            suggestionsBox.innerHTML = '';
            suggestions.forEach(suggestion => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.innerHTML = `<span class="code">${suggestion.code}</span><span class="name">${suggestion.name}</span>`;
                item.onclick = () => {
                    maSTInput.value = suggestion.code;
                    suggestionsBox.style.display = 'none';
                    searchStore();
                };
                suggestionsBox.appendChild(item);
            });
            suggestionsBox.style.display = 'block';
        } else {
            suggestionsBox.style.display = 'none';
        }
    }
    
    async function searchStore() {
        isSearching = true; 
        const maST = maSTInput.value;
        
        // ... (phần reset giao diện và kiểm tra lỗi giữ nguyên) ...
        
        // THAY THẾ: Gọi API để tìm kiếm
        try {
            const response = await getAPI('searchStore', { maST: maST });
            resetButtonState();
            if (response && response.error) {
                errorMessage.textContent = 'Lỗi: ' + response.message;
            } else if (response) {
                resultOutput.innerHTML = formatResult(response);
                resultOutput.style.display = 'block';
            } else {
                errorMessage.textContent = 'Không tìm thấy thông tin cho Mã Siêu Thị: "' + maST + '".';
            }
        } catch (error) {
            resetButtonState();
            errorMessage.textContent = 'Lỗi kết nối máy chủ: ' + error.message;
        }
    }

    // Bước 4: Gắn các event listener
    maSTInput.addEventListener('input', handleSuggestionInput);
    maSTInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchStore();
        }
    });
    document.addEventListener('click', (event) => {
        if (!maSTInput.contains(event.target)) {
            suggestionsBox.style.display = 'none';
        }
    });
    searchButton.addEventListener('click', searchStore);
    clearButton.addEventListener('click', clearSearch);
}
async function init_tai_lieu_dashboard() {
    // Nguồn: Logic được viết lại dựa trên hàm getDashboardButtons trong Code.gs
    // và giao diện trong tai-lieu-dashboard.html
    const container = document.querySelector('.dashboard-container');
    if (!container) return;
    
    container.innerHTML = '<div class="spinner"></div>'; // Hiển thị loading

    // THAY THẾ: Gọi API để lấy danh sách các nút
    try {
        const buttons = await getAPI('getDashboardButtons');
        container.innerHTML = ''; // Xóa spinner

        // Render các nút tĩnh trước
        container.insertAdjacentHTML('beforeend', `
            <a href="https://newticket.tgdd.vn/ticket" target="_blank" class="card-link">
                <div class="dashboard-card">
                    <img src="https://i.imgur.com/VytCI2i.png" alt="New Ticket" class="card-image">
                    <div class="card-content">
                        <i class="fas fa-ticket-alt card-icon" style="color: #22c55e;"></i>
                        <div class="card-text"><h3>New Ticket</h3><p>Mở trang tạo ticket mới</p></div>
                    </div>
                </div>
            </a>
            <a href="https://baocaonoibo.com" target="_blank" class="card-link">
                <div class="dashboard-card">
                    <img src="https://i.imgur.com/r6s2s1h.png" alt="Báo cáo" class="card-image">
                    <div class="card-content">
                        <i class="fas fa-chart-bar card-icon" style="color: #1d4ed8;"></i>
                        <div class="card-text"><h3>Báo cáo nội bộ</h3><p>Xem các báo cáo kinh doanh</p></div>
                    </div>
                </div>
            </a>
        `);

        // Render các nút động từ API
        if (buttons && buttons.length > 0) {
            buttons.forEach(button => {
                const card = document.createElement('div');
                card.className = 'dashboard-card card-link';
                card.style.cursor = 'pointer';
                card.innerHTML = `
                    <div class="card-content">
                        <i class="${button.icon} card-icon"></i>
                        <div class="card-text">
                            <h3>${button.title}</h3>
                            <p>Mở bảng tính: ${button.sheetName || 'Chính'}</p>
                        </div>
                    </div>
                `;
                // Gắn sự kiện để mở sheet trong tab mới
                card.addEventListener('click', () => {
                    const url = `https://docs.google.com/spreadsheets/d/${button.spreadsheetId}/edit#gid=${button.sheetName ? getSheetIdByName(button.sheetName) : '0'}`;
                    window.open(url, '_blank');
                });
                container.appendChild(card);
            });
        }

    } catch (error) {
        container.innerHTML = `<p style="color:red">Lỗi tải dữ liệu dashboard: ${error.message}</p>`;
    }
}
