// ========================================================================
// === 1. CẤU HÌNH VÀ KHAI BÁO BIẾN TOÀN CỤC ==============================
// ========================================================================

// !!! QUAN TRỌNG: Dán URL Web App của bạn đã triển khai từ Google Apps Script vào đây
const API_URL = 'URL_WEB_APP_CUA_BAN_SE_DAN_VAO_DAY';

// Cấu hình menu (Nguồn: Sao chép từ thẻ <script> của file index.html gốc)
const leftMenuData = [
    {
        title: 'ADMIN',
        items: [
          {
            id: 'btnADMIN', text: 'QUẢN TRỊ', icon: 'fa-solid fa-sliders', isDropdown: true, 
            isAdmin: true,
            subItems: [
                { id: 'btnDatabase', text: 'DATABASE', pageLoader: { name: 'admin-database', title: 'QUẢN LÝ DỮ LIỆU'}, icon: 'fa-solid fa-database' },
                { id: 'btnUserInfo', text: 'QUẢN LÝ USER', pageLoader: { name: 'admin-thong-tin-thanh-vien', title: 'QUẢN LÝ THÀNH VIÊN'}, icon: 'fa-solid fa-users' },
                { id: 'btnThongBaoMenu', text: 'TẠO THÔNG BÁO MỚI', pageLoader: { name: 'thong-bao', title: 'TẠO THÔNG BÁO MỚI'}, icon: 'fa-regular fa-newspaper' },
            ]
          }
        ]
    
    },
    {
        title: '2025 - IT MTAY2',
        items: [
            { 
                id: 'btnWorkLeader', text: 'TRIỂN KHAI IT MTAY2', icon: 'fas fa-laptop-code', isDropdown: true, 
                subItems: [
                    { id: 'btnDeployMTay2', text: 'TRIỂN KHAI MIỀN TÂY 2', pageLoader: { name: 'cv-trien-khai-mtay2', title: 'TRIỂN KHAI MIỀN TÂY 2'}, icon: 'fas fa-map-marked-alt' },
                    { id: 'btnBHXToiUu', text: 'TỐI ƯU BHX 2025', pageLoader: { name: 'tk-bhx-toi-uu', title: 'TÌM KIẾM TỐI ƯU BÁCH HÓA XANH'}, icon: 'fas fa-cogs' },
                ] 
            },
            { 
                id: 'btnDailyWork', text: 'CÔNG VIỆC HÀNG NGÀY', icon: 'fas fa-calendar-alt', isDropdown: true, 
                subItems: [
                    { id: 'btnMonitor', text: 'KIỂM TRA LỖI HỆ THỐNG', pageLoader: { name: 'cv-monitor', title: 'KIỂM TRA LỖI HỆ THỐNG'}, icon: 'fas fa-eye' },
                    { id: 'btnTimSheet', text: 'TÌM SHEET CÔNG VIỆC', pageLoader: { name: 'tim-kiem-sheet', title: 'TRA CỨU DỮ LIỆU TỪ GOOGLE SHEET'}, icon: 'fa-solid fa-folder-tree' }
                ] 
            },
            { id: 'btnBTKK', text: 'LỊCH BẢO TRÌ - KIỂM KÊ', pageLoader: { name: 'cv-baotri-kiemke', title: 'LỊCH BẢO TRÌ - KIỂM KÊ'}, icon: 'fas fa-tools' },
            { 
                id: 'btnTimKiem', text: 'TÌM THÔNG TIN', icon: 'fas fa-search', isDropdown: true, 
                subItems: [
                    { id: 'btnTimSieuThi', text: 'TÌM KIẾM SIÊU THỊ', pageLoader: { name: 'tim-kiem-sieu-thi', title: 'TÌM KIẾM SIÊU THỊ'}, icon: 'fas fa-store-alt' },
                    { id: 'btnTimHangBK', text: 'TÌM HÀNG HÓA BACKUP', pageLoader: { name: 'tim-kiem-hang-bk', title: 'TÌM KIẾM HÀNG HÓA BACKUP'}, icon: 'fas fa-box-open' },
                ] 
            }
        ]
    },
    {
        title: 'TÀI LIỆU & HƯỚNG DẪN',
        items: [
            { id: 'btnTaiLieuITs', text: 'TÀI LIỆU IT', pageLoader: { name: 'phan-mem-it', title: 'TÀI LIỆU IT'}, icon: 'fas fa-book-open' },
            { id: 'btnDashboard', text: 'BẢNG ĐIỀU KHIỂN', pageLoader: { name: 'tai-lieu-dashboard', title: 'BẢNG ĐIỀU KHIỂN CHÍNH'}, icon: 'fas fa-tachometer-alt' },
            { 
                id: 'btnHuongDanIT', text: 'HƯỚNG DẪN IT', icon: 'fas fa-question-circle', isDropdown: true, 
                subItems: [
                    { id: 'btnBachHoaXanh', text: 'BÁCH HÓA XANH', pageLoader: { name: 'huong-dan-bhx', title: 'BÁCH HÓA XANH'}, icon: 'fas fa-store' },
                ] 
            }
        ]
    }
];
const rightMenuData = [
    {
        title: "TRANG CÔNG VIỆC",
        icon: "fas fa-briefcase",
        items: [
            { text: "Báo cáo nội bộ", href: "https://baocaonoibo.com", icon: "fas fa-chart-bar", className: "primary" },
            { text: "New Ticket", href: "https://newticket.tgdd.vn/ticket", icon: "fas fa-ticket-alt", className: "success" },
            { text: "Google Docs", href: "https://docs.google.com/", icon: "fas fa-file-alt", className: "info" },
        ]
    },
    {
        title: "GIẢI TRÍ",
        icon: "fas fa-gamepad",
        items: [
            { text: "YouTube", href: "https://youtube.com", icon: "fab fa-youtube" },
            { text: "Facebook", href: "https://facebook.com", icon: "fab fa-facebook" },
        ]
    }
];

const functionContent = document.getElementById('functionContent');
const loadingSpinner = document.getElementById('loadingSpinner');
const currentPageTitle = document.getElementById('current-page-title');
const leftSidebarContainer = document.getElementById('left-sidebar-container');
const rightSidebarContainer = document.getElementById('right-sidebar-container');
let inactivityTimer;
let isAdminAuthenticated = false;

// ========================================================================
// === 2. KHỞI TẠO ỨNG DỤNG ==============================================
// ========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const sessionId = sessionStorage.getItem('appSessionId');
    if (!sessionId) {
        window.location.href = 'login.html';
        return;
    }
    initializeApp(sessionId);
});

async function initializeApp(sessionId) {
    try {
        const validationResponse = await postAPI('verifySession', { clientSessionId: sessionId });
        if (!validationResponse.isValid) {
            sessionStorage.removeItem('appSessionId');
            alert(validationResponse.message || 'Phiên không hợp lệ. Vui lòng đăng nhập lại.');
            window.location.href = 'login.html';
            return;
        }

        const userDetails = await getAPI('getUserSessionDetails');
        isAdminAuthenticated = userDetails.isAdmin;

        document.getElementById('initial-loading-overlay').style.display = 'none';
        document.getElementById('app-container').style.display = 'flex';

        renderLeftMenu();
        renderRightMenu();
        setupGlobalEventListeners();
        updateClock();
        setInterval(updateClock, 1000);
        updateUserDisplay(userDetails);
        
        loadPage('thong-bao', 'BẢNG TIN CÔNG VIỆC');

        ['load', 'mousemove', 'mousedown', 'touchstart', 'click', 'keydown'].forEach(evt => 
            window.addEventListener(evt, resetInactivityTimer, true)
        );
        resetInactivityTimer();

    } catch (error) {
        document.body.innerHTML = `<p style="color:red; text-align:center; padding: 20px;">Lỗi kết nối đến máy chủ. Không thể khởi tạo ứng dụng. Lỗi: ${error.message}</p>`;
    }
}

// ========================================================================
// === 3. HÀM TẢI TRANG VÀ GỌI API =========================================
// ========================================================================
async function loadPage(pageName, pageTitle) {
    if (!pageName) return;
    functionContent.innerHTML = '';
    loadingSpinner.style.display = 'block';
    currentPageTitle.textContent = pageTitle;

    try {
        const response = await fetch(`${pageName}.html`);
        if (!response.ok) throw new Error(`Không thể tải trang ${pageName}.html (HTTP ${response.status})`);
        
        const html = await response.text();
        loadingSpinner.style.display = 'none';
        functionContent.innerHTML = html;

        const initFunctionName = `init_${pageName.replace(/-/g, '_')}`;
        if (typeof window[initFunctionName] === 'function') {
            window[initFunctionName]();
        }
    } catch (error) {
        loadingSpinner.style.display = 'none';
        functionContent.innerHTML = `<p style="color: red; padding: 20px;">Lỗi tải nội dung: ${error.message}</p>`;
    }
}

async function getAPI(action, params = {}) {
    const url = new URL(API_URL);
    url.searchParams.append('action', action);
    for (const key in params) {
        url.searchParams.append(key, params[key]);
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Lỗi mạng khi gọi API: ${response.statusText}`);
    return response.json();
}

async function postAPI(action, body = {}) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action, ...body })
    });
    if (!response.ok) throw new Error(`Lỗi mạng khi gọi API: ${response.statusText}`);
    return response.json();
}

// ========================================================================
// === 4. LOGIC CỦA CÁC TRANG (INIT FUNCTIONS) ============================
// ========================================================================

async function init_thong_bao() {
    const contentDiv = document.getElementById('notification-page-content');
    if (!contentDiv) return;
    const spinner = contentDiv.querySelector('#loading-spinner-local');
    
    try {
        const allNotifications = await getAPI('getNotifications');
        if (spinner) spinner.style.display = 'none';

        if (allNotifications.error) throw new Error(allNotifications.message);

        const trienKhaiData = allNotifications.filter(item => item.category === 'Triển khai');
        const noiBoData = allNotifications.filter(item => item.category === 'Nội bộ');

        const createColumnHtml = (title, data) => {
            let columnHtml = `<div class="content-column"><h2 class="column-title">${title}</h2><div class="notification-list">`;
            if (data.length > 0) {
                data.forEach(item => {
                    const newBadgeHtml = item.isNew ? '<span class="new-badge">NEW</span>' : '';
                    const typeBadgeHtml = item.type ? `<span class="type-badge type-${item.type.toLowerCase().replace(/[/\\s&]/g, '-')}">${item.type}</span>` : '';
                    const linkButtonHtml = item.link ? `<a href="${item.link}" target="_blank" class="notification-link-btn-pb3"><i class="fas fa-link"></i> Link chi tiết</a>` : '';
                    const updateDateHtml = item.updateDate ? `<span class="update-date-badge"><i class="fas fa-calendar-check"></i> ${item.updateDate}</span>` : '';
                    const deadlineHtml = item.deadline ? `<span class="deadline-badge"><i class="fas fa-hourglass-half"></i> Deadline: ${item.deadline}</span>` : '';
                    columnHtml += `<div class="notification-card-pb3 collapsed"><div class="notification-header-pb3"><i class="${item.icon || 'fas fa-bell'} icon"></i><h4>${item.title}</h4>${typeBadgeHtml}${newBadgeHtml}<i class="fas fa-chevron-down expand-icon"></i></div><div class="notification-message-pb3">${item.message}<div class="notification-footer-pb3"><div class="footer-left">${updateDateHtml}</div><div class="footer-center">${deadlineHtml}</div><div class="footer-right">${linkButtonHtml}</div></div></div></div>`;
                });
            } else {
                columnHtml += '<p>Không có thông báo nào.</p>';
            }
            columnHtml += '</div></div>';
            return columnHtml;
        };
        
        contentDiv.innerHTML = `<div class="columns-container-pb2">${createColumnHtml('<i class="fas fa-bullhorn"></i> THÔNG BÁO TRIỂN KHAI', trienKhaiData)}${createColumnHtml('<i class="fas fa-users"></i> THÔNG BÁO MTAY2', noiBoData)}</div>`;

        contentDiv.addEventListener('click', function(event) {
            if (event.target.closest('a')) return;
            const clickedCard = event.target.closest('.notification-card-pb3');
            if (!clickedCard) return;
            document.querySelectorAll('.notification-card-pb3').forEach(card => {
                if (card !== clickedCard) card.classList.add('collapsed');
            });
            clickedCard.classList.toggle('collapsed');
        });
    } catch (error) {
        if (spinner) spinner.style.display = 'none';
        contentDiv.innerHTML = `<p style="color: red;">Lỗi tải dữ liệu thông báo: ${error.message}</p>`;
    }
}

function init_tim_kiem_sieu_thi() {
    const maSTInput = document.getElementById('maSTInput');
    const searchButton = document.getElementById('searchButton');
    const clearButton = document.getElementById('clearButton');
    const buttonText = document.getElementById('buttonText');
    const resultOutput = document.getElementById('resultOutput');
    const errorMessage = document.getElementById('errorMessage');
    const loadingMessage = document.getElementById('loadingMessage');
    const suggestionsBox = document.getElementById('suggestions-box');
    
    let isSearching = false;

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
        const createRow = (icon, label, value, delay) => `<div class="result-row" style="animation-delay: ${delay}s;"><i class="fas ${icon} result-icon"></i><span class="result-label">${label}</span><span class="result-value">${value}</span></div>`;
        return `<div class="result-card"><div class="result-main-title">KẾT QUẢ TÌM KIẾM: ${data.maCN}</div><div class="result-section"><div class="result-section-title"><i class="fas fa-info-circle"></i> THÔNG TIN SIÊU THỊ</div>${createRow('fa-barcode', 'Mã CN:', `<strong>${data.maCN}</strong>`, 0.1)}${createRow('fa-store', 'Tên ST:', `<strong>${data.tenST}</strong>`, 0.2)}${createRow('fa-calendar-alt', 'Khai Trương:', data.khaiTruong, 0.3)}${createRow('fa-map-marker-alt', 'Maps:', `<a href="${data.maps}" target="_blank">Xem trên bản đồ</a>`, 0.4)}${createRow('fa-user-cog', 'IT KV:', data.itKV, 0.5)}${createRow('fa-user-shield', 'Admin:', data.admin, 0.6)}</div><div class="result-section"><div class="result-section-title"><i class="fas fa-tools"></i> BẢO TRÌ - KIỂM KÊ</div>${createRow('fa-calendar-check', 'Ngày BT-KK:', data.ngayBTKK, 0.7)}${createRow('fa-file-alt', 'BC Bảo Trì:', data.bcBT, 0.8)}${createRow('fa-clipboard-check', 'BC Kiểm Kê:', data.bcKK, 0.9)}</div></div>`;
    }

    async function handleSuggestionInput() {
        if (isSearching) return;
        const inputText = maSTInput.value;
        if (inputText.length < 2) {
            suggestionsBox.style.display = 'none';
            return;
        }
        
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
        suggestionsBox.style.display = 'none';
        resultOutput.style.display = 'none';
        errorMessage.textContent = '';
        maSTInput.classList.remove('error');
        if (!maST.trim()) {
            errorMessage.textContent = 'Vui lòng nhập Mã Siêu Thị để tìm kiếm.';
            maSTInput.classList.add('error');
            resetButtonState();
            return;
        }
        searchButton.disabled = true;
        buttonText.textContent = 'Đang tìm...';
        loadingMessage.style.display = 'block';

        try {
            const response = await getAPI('searchStore', { maST: maST });
            if (response && response.error) {
                errorMessage.textContent = 'Lỗi: ' + response.message;
            } else if (response) {
                resultOutput.innerHTML = formatResult(response);
                resultOutput.style.display = 'block';
            } else {
                errorMessage.textContent = 'Không tìm thấy thông tin cho Mã Siêu Thị: "' + maST + '".';
                maSTInput.classList.add('error');
            }
        } catch (error) {
            errorMessage.textContent = 'Lỗi kết nối máy chủ: ' + error.message;
        } finally {
            resetButtonState();
        }
    }

    maSTInput.addEventListener('input', handleSuggestionInput);
    maSTInput.addEventListener('keypress', (event) => { if (event.key === 'Enter') { event.preventDefault(); searchStore(); } });
    document.addEventListener('click', (event) => { if (!maSTInput.contains(event.target)) { suggestionsBox.style.display = 'none'; } });
    searchButton.addEventListener('click', searchStore);
    clearButton.addEventListener('click', clearSearch);
}

function init_tim_kiem_hang_bk() {
    const maKhoSelect = document.getElementById('maKhoSelect');
    const maUserInput = document.getElementById('maUserInput');
    const searchButton = document.getElementById('searchButton');
    const clearButton = document.getElementById('clearButton');
    const buttonText = document.getElementById('buttonText');
    const resultTableContainer = document.getElementById('resultTableContainer');
    const resultTableBody = document.getElementById('resultTableBody');
    const errorMessage = document.getElementById('errorMessage');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const loadingMessage = document.getElementById('loadingMessage');

    function resetButtonState() {
        searchButton.disabled = false;
        buttonText.textContent = 'Tìm Kiếm';
        loadingMessage.style.display = 'none';
    }

    function clearSearch() {
        maKhoSelect.value = '';
        maUserInput.value = '';
        resultTableContainer.style.display = 'none';
        resultTableBody.innerHTML = '';
        errorMessage.textContent = '';
        noResultsMessage.style.display = 'none';
        maKhoSelect.classList.remove('input-error');
        maUserInput.classList.remove('input-error');
        resetButtonState();
    }

    async function searchTimHangBK() {
        const maKho = maKhoSelect.value;
        const maUser = maUserInput.value.trim();
        resultTableContainer.style.display = 'none';
        resultTableBody.innerHTML = '';
        errorMessage.textContent = '';
        noResultsMessage.style.display = 'none';
        maKhoSelect.classList.remove('input-error');
        maUserInput.classList.remove('input-error');

        let hasError = false;
        if (!maKho) { errorMessage.textContent += 'Vui lòng chọn Mã Kho. '; maKhoSelect.classList.add('input-error'); hasError = true; }
        if (!maUser) { errorMessage.textContent += 'Vui lòng nhập Mã Nhân Viên. '; maUserInput.classList.add('input-error'); hasError = true; }
        if (hasError) return;

        searchButton.disabled = true;
        buttonText.textContent = 'Đang tìm...';
        loadingMessage.style.display = 'block';

        try {
            const results = await getAPI('searchHangBK', { maKho: maKho, maUser: maUser });
            if (results && results.length > 0) {
                results.forEach(d => {
                    const row = resultTableBody.insertRow();
                    Object.values(d).forEach(text => row.insertCell().textContent = text);
                });
                resultTableContainer.style.display = 'block';
            } else {
                noResultsMessage.style.display = 'block';
                resultTableContainer.style.display = 'block';
            }
        } catch (error) {
            errorMessage.textContent = 'Đã xảy ra lỗi: ' + error.message;
        } finally {
            resetButtonState();
        }
    }
    
    searchButton.addEventListener('click', searchTimHangBK);
    clearButton.addEventListener('click', clearSearch);
}

async function init_tim_kiem_sheet() {
    const dropdown = document.getElementById('sheetDropdown');
    const resultContainer = document.getElementById('resultContainer');
    if (!dropdown || !resultContainer) return;

    async function loadSheetData() {
        const selectedSheet = dropdown.value;
        if (!selectedSheet) {
            resultContainer.innerHTML = '<p>Vui lòng chọn một sheet để xem dữ liệu.</p>';
            return;
        }
        resultContainer.innerHTML = '<div class="spinner"></div>';
        try {
            const data = await getAPI('getDataFromSheet', { sheetName: selectedSheet });
            if (!data || data.length === 0) {
                resultContainer.innerHTML = '<p>Không có dữ liệu trong sheet này.</p>';
                return;
            }
            let tableHtml = '<table class="result-table"><thead><tr>';
            data[0].forEach(headerCell => { tableHtml += `<th>${headerCell || ''}</th>`; });
            tableHtml += '</tr></thead><tbody>';
            for (let i = 1; i < data.length; i++) {
                tableHtml += '<tr>';
                data[i].forEach(cell => { tableHtml += `<td>${cell === null ? '' : cell}</td>`; });
                tableHtml += '</tr>';
            }
            tableHtml += '</tbody></table>';
            resultContainer.innerHTML = tableHtml;
        } catch (error) {
            resultContainer.innerHTML = `<p style="color: red;">Lỗi khi tải dữ liệu: ${error.message}</p>`;
        }
    }
    
    dropdown.addEventListener('change', loadSheetData);
    
    try {
        resultContainer.innerHTML = '<div class="spinner"></div>';
        const sheetNames = await getAPI('getAllSheetNames');
        dropdown.innerHTML = '<option value="">-- Chọn một sheet --</option>';
        if (sheetNames && sheetNames.length > 0) {
            sheetNames.forEach(name => dropdown.add(new Option(name, name)));
        }
        resultContainer.innerHTML = '<p>Vui lòng chọn một sheet để xem dữ liệu.</p>';
    } catch (error) {
        resultContainer.innerHTML = `<p style="color: red;">Lỗi tải danh sách sheet: ${error.message}</p>`;
    }
}

function init_tk_bhx_toi_uu() {
    const searchBtn = document.getElementById('searchBtn');
    const resultsContainer = document.getElementById('results-container-bhx');
    const spinner = document.getElementById('loadingSpinner-bhx');
    const userInputElement = document.getElementById('maUserInput');
    const storeInputElement = document.getElementById('maSieuThiInput');

    function escapeHtml(unsafe) { return unsafe === null || typeof unsafe === 'undefined' ? '' : unsafe.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }

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

        try {
            const results = await getAPI('searchBHX', { maUser: maUserValue, maSieuThi: maSieuThiValue });
            spinner.style.display = 'none';
            if (results && results.length > 0) {
                let tableHtml = '<table class="results-table-bhx"><thead><tr><th>Mã ST</th><th>Tên ST</th><th>Mã User</th><th>Model</th><th>SL Tồn</th><th>SL Thiếu</th><th>SL Dư</th><th>Ghi Chú</th></tr></thead><tbody>';
                results.forEach(row => {
                    tableHtml += `<tr><td>${escapeHtml(row.maSieuThi)}</td><td>${escapeHtml(row.tenSieuThi)}</td><td>${escapeHtml(row.maUser)}</td><td>${escapeHtml(row.model)}</td><td>${escapeHtml(row.slTon)}</td><td>${escapeHtml(row.slThieu)}</td><td>${escapeHtml(row.slDu)}</td><td>${escapeHtml(row.ghiChu)}</td></tr>`;
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

    searchBtn.addEventListener('click', searchData);
}

async function init_tai_lieu_dashboard() {
    const container = document.querySelector('.dashboard-container');
    if (!container) return;
    container.innerHTML = '<div class="spinner"></div>';

    try {
        // Render các nút tĩnh
        container.innerHTML = `
            <a href="https://newticket.tgdd.vn/ticket" target="_blank" class="card-link">
                <div class="dashboard-card"><img src="https://i.imgur.com/VytCI2i.png" alt="New Ticket" class="card-image"><div class="card-content"><i class="fas fa-ticket-alt card-icon" style="color: #22c55e;"></i><div class="card-text"><h3>New Ticket</h3><p>Mở trang tạo ticket mới</p></div></div></div>
            </a>
            <a href="https://baocaonoibo.com" target="_blank" class="card-link">
                <div class="dashboard-card"><img src="https://i.imgur.com/r6s2s1h.png" alt="Báo cáo" class="card-image"><div class="card-content"><i class="fas fa-chart-bar card-icon" style="color: #1d4ed8;"></i><div class="card-text"><h3>Báo cáo nội bộ</h3><p>Xem các báo cáo kinh doanh</p></div></div></div>
            </a>`;
        
        // Lấy và render các nút động
        const buttons = await getAPI('getDashboardButtons');
        if (buttons && buttons.length > 0) {
            buttons.forEach(button => {
                const card = document.createElement('a');
                card.href = `https://docs.google.com/spreadsheets/d/${button.spreadsheetId}/edit`;
                card.target = '_blank';
                card.className = 'card-link';
                card.innerHTML = `<div class="dashboard-card"><div class="card-content"><i class="${button.icon} card-icon"></i><div class="card-text"><h3>${button.title}</h3><p>Mở bảng tính: ${button.sheetName || 'Chính'}</p></div></div></div>`;
                container.appendChild(card);
            });
        }
    } catch (error) {
        container.innerHTML = `<p style="color:red">Lỗi tải dữ liệu dashboard: ${error.message}</p>`;
    }
}

// ========================================================================
// === 5. HÀM TIỆN ÍCH VÀ GIAO DIỆN ========================================
// ========================================================================
function setupGlobalEventListeners() {
    document.getElementById('logoutButton').addEventListener('click', () => {
        document.getElementById('customConfirmModal').style.display = 'flex';
    });
    document.getElementById('confirmBtnYes').addEventListener('click', async () => {
        document.getElementById('customConfirmModal').style.display = 'none';
        await postAPI('logout');
        sessionStorage.removeItem('appSessionId');
        window.location.href = 'login.html';
    });
    document.getElementById('confirmBtnNo').addEventListener('click', () => {
        document.getElementById('customConfirmModal').style.display = 'none';
    });
    document.getElementById('btnGoHomeHeader').addEventListener('click', () => loadPage('thong-bao', 'BẢNG TIN CÔNG VIỆC'));
    
    const adminLoginModal = document.getElementById('adminLoginModal');
    document.getElementById('adminLoginCancel').addEventListener('click', () => { adminLoginModal.style.display = 'none'; });
    document.getElementById('adminLoginSubmit').addEventListener('click', handleAdminLogin);
    document.getElementById('adminPassword').addEventListener('keypress', (e) => { if (e.key === 'Enter') handleAdminLogin(); });
}

async function handleAdminLogin() {
    const adminLoginModal = document.getElementById('adminLoginModal');
    const adminUsername = document.getElementById('adminUsername');
    const adminPassword = document.getElementById('adminPassword');
    const adminLoginError = document.getElementById('adminLoginError');
    const adminLoginSubmit = document.getElementById('adminLoginSubmit');
    const username = adminUsername.value.trim();
    const password = adminPassword.value;
    if (!username || !password) {
        adminLoginError.textContent = 'Vui lòng nhập đủ thông tin.';
        return;
    }
    adminLoginSubmit.disabled = true;
    adminLoginError.textContent = '';
    try {
        const response = await postAPI('verifyAdmin', { username, password });
        if (response.success) {
            isAdminAuthenticated = true;
            adminLoginModal.style.display = 'none';
            adminUsername.value = '';
            adminPassword.value = '';

            alert('Xác thực Admin thành công! Vui lòng nhấp lại vào menu Admin.');
            renderLeftMenu(); // Vẽ lại menu để loại bỏ lớp bảo vệ
        } else {
            isAdminAuthenticated = false;
            adminLoginError.textContent = response.message || 'Lỗi không xác định.';
            adminPassword.value = '';
        }
    } catch (error) {
        isAdminAuthenticated = false;
        adminLoginError.textContent = 'Lỗi kết nối: ' + error.message;
    } finally {
        adminLoginSubmit.disabled = false;
    }
}

function renderLeftMenu() {
    const wrapper = leftSidebarContainer.querySelector('.sidebar-content-wrapper');
    wrapper.innerHTML = '';
    leftMenuData.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'menu-section';
        sectionDiv.innerHTML = `<h3 class="menu-section-title"><span>${section.title}</span></h3>`;
        const menuItemsContainer = document.createElement('div');
        menuItemsContainer.className = 'menu-items-container';

        section.items.forEach(item => {
            if (item.isAdmin && !isAdminAuthenticated) {
                // Nếu là menu admin và chưa xác thực, không render gì cả hoặc render mờ đi
                return; 
            }
            if (item.isDropdown) {
                // Logic vẽ dropdown
                const dropdownDiv = document.createElement('div');
                // ... code vẽ dropdown ...
                menuItemsContainer.appendChild(dropdownDiv);
            } else {
                const button = document.createElement('a');
                button.href = '#';
                button.id = item.id;
                button.className = 'menu-button-sidebar';
                button.innerHTML = `<i class="${item.icon} icon"></i><span>${item.text}</span>`;
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (item.pageLoader) {
                        loadPage(item.pageLoader.name, item.pageLoader.title);
                    }
                });
                menuItemsContainer.appendChild(button);
            }
        });
        sectionDiv.appendChild(menuItemsContainer);
        wrapper.appendChild(sectionDiv);
    });
}

function renderRightMenu() {
    const wrapper = rightSidebarContainer.querySelector('.sidebar-content-wrapper');
    wrapper.innerHTML = '';
    rightMenuData.forEach(section => {
        const title = document.createElement('h3');
        title.innerHTML = `<i class="${section.icon}"></i><span>${section.title}</span>`;
        const menuSection = document.createElement('div');
        menuSection.className = 'right-menu-section';
        section.items.forEach(item => {
            const link = document.createElement('a');
            link.href = item.href;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = `link-button-right ${item.className || ''}`;
            link.innerHTML = `<i class="${item.icon} icon"></i><span>${item.text}</span>`;
            menuSection.appendChild(link);
        });
        wrapper.appendChild(title);
        wrapper.appendChild(menuSection);
    });
}

function updateUserDisplay(details) {
    const userNameDisplay = document.getElementById('userNameDisplay');
    if (!userNameDisplay) return;
    if (details.isAdmin) {
        userNameDisplay.innerHTML = `Xin chào, ${details.fullName} <i class="fas fa-user-shield" style="color: #ef4444;"></i>`;
    } else {
        userNameDisplay.textContent = `Xin chào, ${details.fullName}`;
    }
}

function updateClock() {
    const now = new Date();
    const timeEl = document.getElementById('clock-time');
    const dateEl = document.getElementById('clock-date');
    if(timeEl) timeEl.textContent = now.toLocaleTimeString('vi-VN');
    if(dateEl) dateEl.textContent = now.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });
}

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        sessionStorage.removeItem('appSessionId');
        alert('Bạn đã bị đăng xuất do không hoạt động.');
        window.location.href = 'login.html';
    }, 1800000); // 30 phút = 1800000 ms
}
