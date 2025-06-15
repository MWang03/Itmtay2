// ========================================================================
// === CẤU HÌNH VÀ KHỞI TẠO ===============================================
// ========================================================================

// !!! QUAN TRỌNG: Dán URL Web App của bạn đã triển khai từ Google Apps Script vào đây
const API_URL = 'https://script.google.com/macros/s/AKfycbyyplfafLTbRP0ywasghwbrP3piLZVQxrCNTGi6ifsyfzH15ZBixAa26CMriROG4OZWIQ/exec';

document.addEventListener('DOMContentLoaded', () => {
    // Nếu đã có session, không cần ở lại trang login, chuyển thẳng vào app
    if (sessionStorage.getItem('appSessionId')) {
        window.location.href = 'index.html';
        return;
    }

    // Gắn sự kiện cho các form và nút
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    document.getElementById('login-tab-button').addEventListener('click', () => showTab('login'));
    document.getElementById('signup-tab-button').addEventListener('click', () => showTab('signup'));
    
    // Gắn sự kiện cho các nút Xóa
    document.querySelector('#loginForm .btn-clear').addEventListener('click', () => clearForm('loginForm'));
    document.querySelector('#signupForm .btn-clear').addEventListener('click', () => clearForm('signupForm'));

    showTab('login'); // Hiển thị tab đăng nhập mặc định
});

// ========================================================================
// === CÁC HÀM XỬ LÝ SỰ KIỆN ===============================================
// ========================================================================

async function handleLogin(event) {
    event.preventDefault();
    showLoadingIndicator();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'login', username, password })
        });
        const result = await response.json();
        
        hideLoadingIndicator();
        if (result.success && result.sessionId) {
            // Lưu session ID vào sessionStorage để các trang khác có thể dùng
            sessionStorage.setItem('appSessionId', result.sessionId);
            // Chuyển hướng đến trang chính
            window.location.href = 'index.html';
        } else {
            showErrorAlert(result.message || 'Đăng nhập thất bại.');
        }
    } catch (error) {
        hideLoadingIndicator();
        showPopup('Lỗi hệ thống', 'Không thể kết nối đến máy chủ. ' + error.message, 'error');
    }
}

async function handleSignup(event) {
    event.preventDefault();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (password !== confirmPassword) {
        showErrorAlert('Mật khẩu xác nhận không khớp!');
        return;
    }
    
    showLoadingIndicator();
    const username = document.getElementById('signupUsername').value;
    const fullName = document.getElementById('signupFullName').value;
    const phone = document.getElementById('signupPhone').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'register', username, password, fullName, phone })
        });
        const result = await response.json();
        
        hideLoadingIndicator();
        if (result.success) {
            document.getElementById('signupForm').reset();
            showPopup('Đăng ký thành công!', result.message, 'success', () => {
                showTab('login');
            });
        } else {
            showPopup('Đăng ký thất bại', result.message, 'error');
        }
    } catch (error) {
        hideLoadingIndicator();
        showPopup('Lỗi hệ thống', 'Không thể kết nối đến máy chủ. ' + error.message, 'error');
    }
}

// ========================================================================
// === CÁC HÀM TIỆN ÍCH CHO GIAO DIỆN (Lấy từ script gốc của login.html) ====
// ========================================================================
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    document.getElementById(tabName + 'Tab').classList.add('active');
    document.getElementById(tabName + '-tab-button').classList.add('active');
}

function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) form.reset();
}

function showLoadingIndicator() { 
    const indicator = document.getElementById('loadingIndicator');
    if(indicator) indicator.style.display = 'flex'; 
}

function hideLoadingIndicator() { 
    const indicator = document.getElementById('loadingIndicator');
    if(indicator) indicator.style.display = 'none'; 
}

let errorAlertTimeout;
function showErrorAlert(message) {
    const alertBox = document.getElementById('errorAlert');
    const msgSpan = document.getElementById('errorAlertMessage');
    if (!alertBox || !msgSpan) return;
    
    msgSpan.textContent = message;
    alertBox.classList.add('show');
    clearTimeout(errorAlertTimeout);
    errorAlertTimeout = setTimeout(() => {
        alertBox.classList.remove('show');
    }, 4000);
}

function showPopup(titleText, messageText, type, onCloseCallback = null) {
    const overlay = document.getElementById('popupOverlay');
    const container = document.getElementById('popupContainer');
    const icon = document.getElementById('popupIcon');
    const title = document.getElementById('popupTitle');
    const msg = document.getElementById('popupMessage');
    const closeBtn = document.getElementById('popupCloseBtn');

    if (!overlay || !container || !icon || !title || !msg || !closeBtn) return;
    
    title.textContent = titleText;
    msg.textContent = messageText;
    container.className = `popup-container ${type}`;
    icon.innerHTML = (type === 'success') ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>';
    overlay.classList.add('show');

    const closeHandler = () => {
        overlay.classList.remove('show');
        if (typeof onCloseCallback === 'function') {
            onCloseCallback();
        }
        closeBtn.removeEventListener('click', closeHandler);
        overlay.removeEventListener('click', overlayHandler);
    };

    const overlayHandler = (event) => {
        if (event.target === overlay) {
            closeHandler();
        }
    };
    
    closeBtn.addEventListener('click', closeHandler);
    overlay.addEventListener('click', overlayHandler);
}
