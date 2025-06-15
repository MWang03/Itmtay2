// ========================================================================
// === 1. CẤU HÌNH VÀ KHAI BÁO BIẾN ========================================
// ========================================================================

// !!! QUAN TRỌNG: Dán URL Web App của bạn vào đây
const API_URL = 'https://script.google.com/macros/s/AKfycbwceH1HPGGp7ZBrTY1OdGRuNbf6bECF_4wJJ1zvTEo7LDDgQYttW0LRObRzAD17Aa_g6w/exec';

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
                { id: 'btnThongBao', text: 'TẠO THÔNG BÁO MỚI', pageLoader: { name: 'thong-bao', title: 'TẠO THÔNG BÁO MỚI'}, icon: 'fa-regular fa-newspaper' },
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

// DOM Elements
const functionContent = document.getElementById('functionContent');
const loadingSpinner = document.getElementById('loadingSpinner');
const currentPageTitle = document.getElementById('current-page-title');
const leftSidebarContainer = document.getElementById('left-sidebar-container');
const rightSidebarContainer = document.getElementById('right-sidebar-container');
let inactivityTimer;

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

        // Nếu session hợp lệ, hiển thị App
        const overlay = document.getElementById('initial-loading-overlay');
        const appContainer = document.getElementById('app-container');
        if(overlay) overlay.style.display = 'none';
        if(appContainer) {
            appContainer.style.display = 'flex';
            appContainer.style.flexDirection = 'column';
            appContainer.style.height = '100vh';
        }

        renderLeftMenu();
        renderRightMenu();
        setupGlobalEventListeners();
        updateClock();
        setInterval(updateClock, 1000);
        
        const userDetails = await getAPI('getUserSessionDetails');
        updateUserDisplay(userDetails);
        
        loadPage('thong-bao', 'BẢNG TIN CÔNG VIỆC');

        // Setup inactivity timer
        resetInactivityTimer();
        ['load', 'mousemove', 'mousedown', 'touchstart', 'click', 'keydown'].forEach(evt => 
            window.addEventListener(evt, resetInactivityTimer, true)
        );

    } catch (error) {
        document.body.innerHTML = `<p style="color:red; text-align:center; padding: 20px;">Lỗi kết nối đến máy chủ. Không thể khởi tạo ứng dụng. Vui lòng thử lại. Lỗi: ${error.message}</p>`;
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
        console.error("Lỗi loadPage:", error);
    }
}

async function getAPI(action, params = {}) {
    const url = new URL(API_URL);
    url.searchParams.append('action', action);
    for (const key in params) {
        url.searchParams.append(key, params[key]);
    }
    const response = await fetch(url);
    return response.json();
}

async function postAPI(action, body = {}) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action, ...body })
    });
    return response.json();
}


// ========================================================================
// === 4. LOGIC CỦA CÁC TRANG (INIT FUNCTIONS) ============================
// ========================================================================

async function init_thong_bao() { /* ... Code đã cung cấp ở câu trả lời trước ... */ }
function init_tim_kiem_hang_bk() { /* ... Code đã cung cấp ở câu trả lời trước ... */ }
function init_tk_bhx_toi_uu() { /* ... Code đã cung cấp ở câu trả lời trước ... */ }
async function init_tim_kiem_sheet() { /* ... Code đã cung cấp ở câu trả lời trước ... */ }
function init_tim_kiem_sieu_thi() { /* ... Code đã cung cấp ở câu trả lời trước ... */ }
async function init_tai_lieu_dashboard() { /* ... Code đã cung cấp ở câu trả lời trước ... */ }

// Thêm các hàm init cho các trang tĩnh nếu cần gắn sự kiện đơn giản
function init_cv_baotri_kiemke() { console.log("Trang Lịch bảo trì đã tải."); }
// ... các hàm init khác nếu cần

// ========================================================================
// === 5. HÀM TIỆN ÍCH VÀ GIAO DIỆN (Lấy từ script gốc của index.html) ====
// ========================================================================
function setupGlobalEventListeners() {
    document.getElementById('logoutButton').addEventListener('click', () => {
        const modal = document.getElementById('customConfirmModal');
        if (modal) modal.style.display = 'flex';
    });

    document.getElementById('confirmBtnYes').addEventListener('click', async () => {
        await postAPI('logout'); // Gọi API để xóa session phía server
        sessionStorage.removeItem('appSessionId');
        window.location.href = 'login.html';
    });

    document.getElementById('confirmBtnNo').addEventListener('click', () => {
        const modal = document.getElementById('customConfirmModal');
        if (modal) modal.style.display = 'none';
    });
    
    document.getElementById('btnGoHomeHeader').addEventListener('click', () => loadPage('thong-bao', 'BẢNG TIN CÔNG VIỆC'));
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
    }, 1800000); // 30 phút
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
            if (item.isDropdown) {
                // Logic tạo dropdown
            } else {
                const a = document.createElement('a');
                a.href = '#';
                a.id = item.id;
                a.className = `menu-button-sidebar ${item.className || ''}`;
                a.innerHTML = `<i class="${item.icon} icon"></i><span>${item.text}</span>`;
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (item.pageLoader) {
                        loadPage(item.pageLoader.name, item.pageLoader.title);
                    }
                });
                menuItemsContainer.appendChild(a);
            }
        });
        sectionDiv.appendChild(menuItemsContainer);
        wrapper.appendChild(sectionDiv);
    });
}

function renderRightMenu() {
    // ... logic render right menu tương tự ...
}

// ... các hàm tiện ích khác từ script gốc như collapseSidebar, v.v. ...
