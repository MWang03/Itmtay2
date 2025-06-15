// ========================================================================
// === 1. CẤU HÌNH VÀ BIẾN TOÀN CỤC ========================================
// Nguồn: Giữ nguyên từ file Code.gs gốc của bạn
// ========================================================================
const SPREADSHEET_ID = '1iHRNl-vYyKYM2NMNxgMc74JZTFGGHMycJt0BwH0yXBQ';
const HANG_BK_SPREADSHEET_ID = '1Vqm7mlGZcq9iEUGEPV-dA_WR7K5SPmAjOFa9H7ZGIoM';
const TIMSHEET_SPREADSHEET_ID = '1wHssBOfsJ9UW39LjDea3x_syvXLb75WV2l1qq702clQ';
const USER_DATA_SPREADSHEET_ID = '1iHRNl-vYyKYM2NMNxgMc74JZTFGGHMycJt0BwH0yXBQ';
const BHX_TOI_UU_SPREADSHEET_ID = '11fQP7ga6Yr0B60-GbliCOZqJGA5qVmOVb00MO4dpHJk';

const SHEET_SEARCH_INFO = 'DB-IT';
const SHEET_WORK_TRACKING = 'WorkTrackingData';
const SHEET_STAFF_INFO = 'StaffInfoData';
const SHEET_HANG_BK_NAMES = ['5341', '13727', '13728'];
const USER_SHEET_NAME = 'Users';
const SHEET_BHX_TOI_UU = 'Tối_Ưu_BHX';


// ========================================================================
// === 2. BỘ ĐIỀU HƯỚNG API (API ROUTER) - PHẦN LÕI CỦA BACKEND MỚI ======
// ========================================================================

/**
 * Xử lý các yêu cầu GET từ frontend.
 * Dùng để lấy và truy vấn dữ liệu.
 * @param {object} e - Đối tượng sự kiện chứa các tham số URL.
 * @returns {ContentService} - Dữ liệu trả về dưới dạng JSON.
 */
function doGet(e) {
  const action = e.parameter.action;
  let result;
  try {
    switch (action) {
      case 'getUserSessionDetails':
        result = getUserSessionDetails();
        break;
      case 'searchStore':
        result = searchStoreByMaST(e.parameter.maST);
        break;
      case 'searchHangBK':
        result = searchTimHangBKData(e.parameter.maKho, e.parameter.maUser);
        break;
      case 'searchBHX':
        result = searchBHXToiUuData(e.parameter.maUser, e.parameter.maSieuThi);
        break;
      case 'getNotifications':
        result = getNotificationsForPage();
        break;
      case 'getStoreSuggestions':
        result = getStoreSuggestions(e.parameter.partialCode);
        break;
      case 'getDashboardButtons':
        result = getDashboardButtons();
        break;
      case 'getAllSheetNames':
        result = getAllSheetNamesFromFile();
        break;
      case 'getDataFromSheet':
        // Thêm tham số 'true' để chỉ lấy dữ liệu, không lấy HTML
        result = getDataFromSheet(e.parameter.sheetName, true); 
        break;
      default:
        result = { error: true, message: 'Hành động GET không hợp lệ.' };
    }
  } catch (err) {
    result = { error: true, message: 'Lỗi máy chủ: ' + err.message, stack: err.stack };
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Xử lý các yêu cầu POST từ frontend.
 * Dùng để gửi dữ liệu (đăng nhập, đăng ký, lưu form), bảo mật hơn GET.
 * @param {object} e - Đối tượng sự kiện chứa nội dung POST.
 * @returns {ContentService} - Dữ liệu trả về dưới dạng JSON.
 */
function doPost(e) {
  const requestData = JSON.parse(e.postData.contents);
  const action = requestData.action;
  let result;
  try {
    switch (action) {
      case 'login':
        result = handleLogin(requestData.username, requestData.password);
        break;
      case 'register':
        result = handleRegister(requestData.username, requestData.password, requestData.fullName, requestData.phone);
        break;
      case 'logout':
        result = logoutUser();
        break;
      case 'verifySession':
        result = verifySession(requestData.clientSessionId);
        break;
      case 'verifyAdmin':
        result = verifyAdminLogin(requestData.username, requestData.password);
        break;
      case 'appendData':
        result = { success: true, message: appendData(requestData.formData) };
        break;
      case 'saveWorkTracking':
        result = { success: true, message: saveWorkTracking(requestData.formData) };
        break;
      case 'saveStaffInfo':
        result = { success: true, message: saveStaffInfo(requestData.formData) };
        break;
      default:
        result = { error: true, message: 'Hành động POST không hợp lệ.' };
    }
  } catch (err) {
    result = { error: true, message: 'Lỗi máy chủ: ' + err.message, stack: err.stack };
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function getUserSessionDetails() {
  const userProps = PropertiesService.getUserProperties();
  return {
    fullName: userProps.getProperty('fullName') || 'Guest',
    isAdmin: userProps.getProperty('isAdmin') === 'true'
  };
}

// CẬP NHẬT: Xóa toàn bộ properties để đảm bảo đăng xuất sạch
function logoutUser() {
  try {
    PropertiesService.getUserProperties().deleteAllProperties();
    Logger.log('Người dùng đã đăng xuất và xóa toàn bộ session properties.');
    return { success: true };
  } catch (e) {
    Logger.log('Lỗi khi đăng xuất: %s', e.message);
    return { success: false, message: 'Lỗi khi đăng xuất.' };
  }
}

function handleRegister(username, password, fullName, phone) {
    try {
        if (!username || !password || !fullName || !phone) {
            return { success: false, message: 'Tên đăng nhập, mật khẩu, họ tên và số điện thoại không được để trống.' };
        }
        const ss = SpreadsheetApp.openById(USER_DATA_SPREADSHEET_ID);
        const sheet = ss.getSheetByName(USER_SHEET_NAME);
        if (!sheet) {
            throw new Error(`Không tìm thấy sheet người dùng: '${USER_SHEET_NAME}'.`);
        }
        const data = sheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
            if (String(data[i][0]).toLowerCase() === String(username).toLowerCase()) {
                return { success: false, message: 'Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.' };
            }
        }
        sheet.appendRow([String(username), String(password), String(fullName), String(phone), false]); // Thêm cột isAdamin = false mặc định
        Logger.log(`Người dùng '${username}' Đã đăng ký thành công.`);
        return { success: true, message: 'Đăng ký tài khoản thành công! Bây giờ bạn có thể đăng nhập.' };
    } catch (e) {
        Logger.log('Lỗi nghiêm trọng trong handleRegister: %s', e.message);
        return { success: false, message: 'Lỗi trong quá trình đăng ký: ' + e.message };
    }
}


// CẬP NHẬT: Thêm sessionId vào kết quả trả về
function handleLogin(username, password) {
    try {
        if (!username || !password) {
            return { success: false, message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' };
        }
        const ss = SpreadsheetApp.openById(USER_DATA_SPREADSHEET_ID);
        const sheet = ss.getSheetByName(USER_SHEET_NAME);
        if (!sheet) {
            throw new Error(`Không tìm thấy sheet người dùng: '${USER_SHEET_NAME}'.`);
        }
        const data = sheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            const storedUsername = String(row[0]);
            const storedPassword = String(row[1]);
            const fullName = String(row[2]);
            const isAdmin = row[4]; // Giả sử cột thứ 5 (index 4) là cột Admin (TRUE/FALSE)

            if (storedUsername.toLowerCase() === String(username).toLowerCase() && storedPassword === String(password)) {
                const userProps = PropertiesService.getUserProperties();
                const sessionId = Utilities.getUuid(); // Tạo một mã session duy nhất
                userProps.setProperty('isLoggedIn', 'true');
                userProps.setProperty('loggedInUser', username);
                userProps.setProperty('sessionId', sessionId); // Lưu mã session
                userProps.setProperty('fullName', fullName);
                userProps.setProperty('isAdmin', isAdmin === true ? 'true' : 'false');
                Logger.log(`Người dùng '${username}' (Admin: ${isAdmin}) đã đăng nhập thành công.`);
                // Trả về sessionId cho frontend
                return { success: true, message: 'Đăng nhập thành công!', sessionId: sessionId };
            }
        }
        Logger.log(`Đăng nhập thất bại: Sai tên đăng nhập hoặc mật khẩu cho '${username}'.`);
        return { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu.' };
    } catch (e) {
        Logger.log('Lỗi nghiêm trọng trong handleLogin: %s', e.message);
        return { success: false, message: 'Lỗi trong quá trình đăng nhập: ' + e.message };
    }
}
function verifySession(clientSessionId) {
    try {
        const userProps = PropertiesService.getUserProperties();
        const serverSessionId = userProps.getProperty('sessionId');
        const isLoggedIn = userProps.getProperty('isLoggedIn');
        if (isLoggedIn === 'true' && serverSessionId === clientSessionId) {
            return { isValid: true };
        } else {
            return { isValid: false, message: 'Phiên đã hết hạn hoặc có đăng nhập từ thiết bị khác.' };
        }
    } catch (e) {
        Logger.log('Lỗi trong verifySession: ' + e.message);
        return { isValid: false, message: 'Lỗi xác thực phiên.' };
    }
}

function appendData(formData) {
    try {
        const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
        const sheet = ss.getSheetByName(SHEET_SEARCH_INFO);
        if (!sheet) throw new Error(`Không tìm thấy sheet: '${SHEET_SEARCH_INFO}'.`);
        
        const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        const rowData = headers.map(header => formData[header] || '');
        sheet.appendRow(rowData);
        return 'Dữ liệu đã được lưu thành công!';
    } catch (e) {
        Logger.log('Lỗi khi ghi dữ liệu (appendData): %s', e.message);
        return 'Lỗi: ' + e.message;
    }
}

function normalizeStringForComparison(input) {
    if (input === undefined || input === null) return '';
    let str = String(input);
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    str = str.replace(/[^a-zA-Z0-9]/g, '');
    return str.toLowerCase();
}

function searchStoreByMaST(maST) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_SEARCH_INFO);
    if (!sheet) {
      return { error: true, message: `Lỗi cấu hình: Không tìm thấy sheet với tên "${SHEET_SEARCH_INFO}".` };
    }
    const data = sheet.getDataRange().getValues();
    const normalizedSearchTerm = normalizeStringForComparison(maST);
    if (normalizedSearchTerm === '') return null;
    for (let i = 1; i < data.length; i++) {
      const cellValueRaw = data[i][0];
      const normalizedCellValue = normalizeStringForComparison(cellValueRaw);
      if (normalizedCellValue === normalizedSearchTerm) {
        const sheetTimeZone = spreadsheet.getSpreadsheetTimeZone();
        const formatDateForClient = (dateValue) => {
          if (dateValue instanceof Date) {
            return Utilities.formatDate(dateValue, sheetTimeZone, "dd/MM/yyyy");
          }
          return dateValue || 'N/A';
        };
        return {
          maCN: data[i][0] || 'N/A',
          tenST: data[i][1] || 'N/A',
          admin: data[i][4] || 'N/A',
          itKV: data[i][3] || 'N/A',
          khaiTruong: formatDateForClient(data[i][5]),
          maps: data[i][6] || 'N/A',
          ngayBTKK: formatDateForClient(data[i][7]),
          bcBT: data[i][8] || 'N/A',
          bcKK: data[i][9] || 'N/A'
        };
      }
    }
    return null;
  } catch (e) {
    Logger.log('Lỗi trong hàm searchStoreByMaST: %s', e.message);
    return { error: true, message: 'Lỗi máy chủ: ' + e.message };
  }
}

function saveWorkTracking(formData) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_WORK_TRACKING);
    if (!sheet) {
        sheet = spreadsheet.insertSheet(SHEET_WORK_TRACKING);
        sheet.appendRow(['Thời Gian', 'Tên Công Việc', 'Người Thực Hiện', 'Trạng Thái', 'Ghi Chú', 'Người Nhập']);
    }
    const rowData = [ new Date(), formData.taskName, formData.assignee, formData.status, formData.notes, Session.getActiveUser().getEmail() ];
    sheet.appendRow(rowData);
    return 'Đã lưu công việc thành công!';
  } catch (e) {
    Logger.log('Lỗi khi lưu công việc: %s', e.message);
    throw new Error('Lỗi khi lưu công việc: ' + e.message);
  }
}

function saveStaffInfo(formData) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_STAFF_INFO);
    if (!sheet) {
        sheet = spreadsheet.insertSheet(SHEET_STAFF_INFO);
        sheet.appendRow(['Thời Gian Nhập', 'Mã NV', 'Họ và Tên', 'Email', 'Điện Thoại', 'Người Nhập']);
    }
    const rowData = [ new Date(), formData.id, formData.name, formData.email, formData.phone, Session.getActiveUser().getEmail() ];
    sheet.appendRow(rowData);
    return 'Đã lưu thông tin nhân viên thành công!';
  } catch (e) {
      Logger.log('Lỗi khi lưu thông tin nhân viên: ' + e.message);
      throw new Error('Lỗi khi lưu thông tin nhân viên: ' + e.message);
  }
}

function searchTimHangBKData(maKho, maUser) {
  const matchingRows = [];
  try {
    const spreadsheet = SpreadsheetApp.openById(HANG_BK_SPREADSHEET_ID);
    const normalizedMaKho = normalizeStringForComparison(maKho);
    const normalizedMaUser = normalizeStringForComparison(maUser);
    if (!normalizedMaKho && !normalizedMaUser) return [];

    const sheetTimeZone = spreadsheet.getSpreadsheetTimeZone();
    SHEET_HANG_BK_NAMES.forEach(sheetName => {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) return;
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const currentMaKho = row[7];
        const currentMaUser = row[0];
        const normalizedCurrentMaKho = normalizeStringForComparison(currentMaKho);
        const normalizedCurrentMaUser = normalizeStringForComparison(currentMaUser);
        const maKhoMatch = normalizedMaKho ? normalizedCurrentMaKho.includes(normalizedMaKho) : true;
        const maUserMatch = normalizedMaUser ? normalizedCurrentMaUser.includes(normalizedMaUser) : true;
        if (maKhoMatch && maUserMatch) {
          const ngayNhap = row[4] instanceof Date ? Utilities.formatDate(row[4], sheetTimeZone, "dd/MM/yyyy") : row[4] || 'N/A';
          matchingRows.push({
            maNV: row[0] || 'N/A', maTaiSan: row[1] || 'N/A', tenTaiSan: row[2] || 'N/A',
            loaiTaiSan: row[3] || 'N/A', ngayNhap: ngayNhap, trangThai: row[6] || 'N/A',
            maKho: row[7] || 'N/A', tenKho: row[8] || 'N/A', userVaTenSoHuu: row[9] || 'N/A'
          });
        }
      }
    });
    return matchingRows;
  } catch (e) {
    Logger.log('Lỗi trong searchTimHangBKData: %s', e.message);
    throw new Error(`Lỗi tìm kiếm dữ liệu hàng hóa: ${e.message}.`);
  }
}

function getAllSheetNamesFromFile() {
  try {
    const spreadsheet = SpreadsheetApp.openById(TIMSHEET_SPREADSHEET_ID);
    if (!spreadsheet) throw new Error("Không tìm thấy Google Sheet TimSheet.");
    return spreadsheet.getSheets().map(sheet => sheet.getName());
  } catch (e) {
    Logger.log('Lỗi trong getAllSheetNamesFromFile: %s', e.message);
    return [];
  }
}

// CẬP NHẬT: Thêm tham số dataOnly để quyết định kiểu trả về
function getDataFromSheet(sheetName, dataOnly = false) {
    try {
        const ss = SpreadsheetApp.openById(TIMSHEET_SPREADSHEET_ID);
        const sheet = ss.getSheetByName(sheetName);
        if (!sheet) throw new Error("Không tìm thấy sheet: " + sheetName);
        const data = sheet.getDataRange().getValues();

        // Nếu frontend gọi (dataOnly = true), trả về mảng dữ liệu thô
        if (dataOnly) {
            return data;
        }

        // Phần code cũ để tạo HTML, không còn được dùng trong kiến trúc mới nhưng giữ lại để tham khảo
        if (data.length === 0) return '<p>Không có dữ liệu.</p>';
        let html = '<table border="1" style="border-collapse: collapse; width: 100%; font-size: 14px;">';
        data.forEach((row, i) => {
            html += '<tr' + (i === 0 ? ' style="background-color:#f1f1f1; font-weight:bold;"' : '') + '>';
            row.forEach(cell => { html += '<td>' + (cell === null ? '' : cell) + '</td>'; });
            html += '</tr>';
        });
        html += '</table>';
        return html;
    } catch (e) {
        Logger.log('Lỗi trong getDataFromSheet: %s', e.message);
        // Ném lỗi để bộ điều hướng API có thể bắt và trả về JSON lỗi
        throw new Error('Lỗi khi tải dữ liệu: ' + e.message);
    }
}


function searchBHXToiUuData(maUser, maSieuThi) {
  try {
    const spreadsheet = SpreadsheetApp.openById(BHX_TOI_UU_SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_BHX_TOI_UU);
    if (!sheet) throw new Error(`Không tìm thấy sheet: "${SHEET_BHX_TOI_UU}".`);
    const data = sheet.getDataRange().getValues();
    const matchingRows = [];
    const normalizedMaUser = String(maUser).trim().toLowerCase();
    const normalizedMaSieuThi = maSieuThi ? String(maSieuThi).trim().toLowerCase() : '';
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const currentRowUser = row[0] ? String(row[0]).trim().toLowerCase() : '';
      const currentRowST = row[1] ? String(row[1]).trim().toLowerCase() : '';
      const userMatch = normalizedMaUser.includes(currentRowUser) || currentRowUser.includes(normalizedMaUser);
      if (userMatch) {
        const sieuThiMatch = normalizedMaSieuThi ? (normalizedMaSieuThi.includes(currentRowST) || currentRowST.includes(normalizedMaSieuThi)) : true;
        if (sieuThiMatch) {
           matchingRows.push({ maSieuThi: row[0] || '', tenSieuThi: row[1] || '', maUser: row[2] || '', model: row[4] || '', slTon: row[5] || '', slThieu: row[6] || '', slDu: row[7] || '', ghiChu: row[10] || '' });
        }
      }
    }
    return matchingRows;
  } catch (e) {
    Logger.log("Lỗi ngoại lệ trong searchBHXToiUuData: " + e.toString());
    throw e;
  }
}

function getAndRenderSheetData(sheetName) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) throw new Error("Không tìm thấy sheet: " + sheetName);
    const data = sheet.getDataRange().getValues();
    if (data.length === 0) return '<p>Sheet không có dữ liệu.</p>';
    let html = '<table border="1" style="border-collapse: collapse; width: 100%; font-size: 14px;">';
    data.forEach((row, i) => {
      const cellTag = (i === 0) ? 'th' : 'td';
      html += '<tr' + (i === 0 ? ' style="background-color:#f1f1f1; font-weight:bold;"' : '') + '>';
      row.forEach(cell => { html += `<${cellTag} style="padding: 8px;">` + (cell || '') + `</${cellTag}>`; });
      html += '</tr>';
    });
    html += '</table>';
    return html;
  } catch (e) {
    Logger.log('Lỗi trong getAndRenderSheetData: %s', e.message);
    return '<p style="color: red;">Lỗi khi tải dữ liệu: ' + e.message + '</p>';
  }
}

function getDashboardButtons() {
  const CONFIG_SHEET_NAME = 'DashboardConfig';
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG_SHEET_NAME);
    if (!sheet) return [];
    const data = sheet.getDataRange().getValues();
    const buttons = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0]) { 
        buttons.push({
          title: row[0], spreadsheetId: row[1] || SPREADSHEET_ID, sheetName: row[2] || '', icon: row[3] || 'fas fa-file-alt'
        });
      }
    }
    return buttons;
  } catch (e) {
    Logger.log('Lỗi khi đọc DashboardConfig: ' + e.message);
    return [];
  }
}

function getHomePageHtml() {
  return `
    <div style="padding: 20px; text-align: center;">
      <i class="fas fa-home" style="font-size: 48px; color: #0056b3; margin-bottom: 16px;"></i>
      <h2 style="font-size: 24px;">Chào mừng bạn đến với Công cụ Quản lý Công việc IT</h2>
      <p style="font-size: 16px; color: #6b7280;">Vui lòng chọn một chức năng từ thanh menu bên trái để bắt đầu.</p>
    </div>
  `;
}

function verifyAdminLogin(username, password) {
  try {
    const sheet = SpreadsheetApp.openById(USER_DATA_SPREADSHEET_ID).getSheetByName(USER_SHEET_NAME);
    if (!sheet) return { success: false, message: 'Lỗi cấu hình: Không tìm thấy sheet Users.' };
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (String(row[0]) === String(username) && String(row[1]) === String(password)) {
        if (row[4] === true) {
          return { success: true };
        } else {
          return { success: false, message: 'Tài khoản này không có quyền Admin.' };
        }
      }
    }
    return { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu.' };
  } catch (e) {
    Logger.log('Lỗi trong verifyAdminLogin: %s', e.message);
    return { success: false, message: 'Đã xảy ra lỗi phía máy chủ.' };
  }
}

function getNotificationsForPage() {
  try {
    const ss = SpreadsheetApp.openById("1iHRNl-vYyKYM2NMNxgMc74JZTFGGHMycJt0BwH0yXBQ");
    const sheet = ss.getSheetByName("Notifications");
    if (!sheet) throw new Error("Không tìm thấy sheet Notifications.");
    const sheetTimeZone = ss.getSpreadsheetTimeZone();
    const dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, 11);
    const values = dataRange.getValues();
    const notifications = values.map(row => {
      if (row[2]) {
        const formatDate = (dateValue) => {
          if (dateValue instanceof Date && !isNaN(dateValue)) {
            return Utilities.formatDate(dateValue, sheetTimeZone, "dd/MM/yyyy");
          }
          return dateValue || '';
        };
        return {
          category: row[1] || 'Nội bộ', title: row[2] || '',
          message: (row[3] || '').toString().replace(/\n/g, '<br>'),
          link: row[4] || '', type: row[5] || '',
          deadline: formatDate(row[6]), updateDate: formatDate(row[7]),
          isNew: row[8] === true, icon: row[9] || 'fas fa-bell',
          isDone: row[10] === true
        };
      }
    }).filter(item => item && item.isDone !== true);
    return notifications;
  } catch (e) {
    console.error("Lỗi trong getNotificationsForPage: " + e.toString());
    return [{
      category: 'Lỗi', title: 'Lỗi Tải Dữ Liệu',
      message: `Lỗi đọc Google Sheet. Lỗi cụ thể: ${e.message}`,
      type: 'Lỗi', isNew: true, icon: 'fas fa-exclamation-circle'
    }];
  }
}

function getStoreSuggestions(partialCode) {
  if (!partialCode || partialCode.trim().length < 2) return [];
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_SEARCH_INFO);
    if (!sheet) return [];
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
    const normalizedInput = String(partialCode).toLowerCase().trim();
    const suggestions = [];
    const limit = 7;
    for (let i = 0; i < data.length; i++) {
      const storeCode = String(data[i][0]);
      if (storeCode.toLowerCase().startsWith(normalizedInput)) {
        suggestions.push({ code: storeCode, name: data[i][1] || '' });
        if (suggestions.length >= limit) break;
      }
    }
    return suggestions;
  } catch (e) {
    Logger.log('Lỗi trong getStoreSuggestions: ' + e.message);
    return [];
  }
}
