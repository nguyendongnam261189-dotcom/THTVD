/* 
 * MÃ NGUỒN BACKEND CHO CỔNG THÔNG TIN TRƯỜNG HỌC
 * ==============================================
 * Phiên bản: 2.0 (Hỗ trợ lưu trữ CLB & Danh mục con)
 */

// --- CẤU HÌNH ---
var CONFIG = {
  FOLDER_NAME: "TVD_Uploads",
  SHEET_USERS: "Users",
  SHEET_POSTS: "Posts",
  SHEET_CLUBS: "Clubs",           // Mới
  SHEET_SUBCATS: "SubCategories"  // Mới
};

/**
 * HÀM CÀI ĐẶT HỆ THỐNG TỰ ĐỘNG
 */
function setupSystem() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  var currentUserEmail = Session.getActiveUser().getEmail();

  try {
    // 1. TẠO SHEET USERS
    createSheetIfNotExists(ss, CONFIG.SHEET_USERS, ["Email", "Name", "Role", "Created_At"], "#0ea5e9");
    
    // Thêm Admin nếu chưa có
    var userSheet = ss.getSheetByName(CONFIG.SHEET_USERS);
    if (userSheet.getLastRow() <= 1) {
       userSheet.appendRow([currentUserEmail, "Super Admin", "ADMIN", new Date()]);
    }

    // 2. TẠO SHEET POSTS
    createSheetIfNotExists(ss, CONFIG.SHEET_POSTS, ["ID", "JSON_DATA", "Created_At", "Title", "Author"], "#6366f1");

    // 3. TẠO SHEET CLUBS (Mới)
    createSheetIfNotExists(ss, CONFIG.SHEET_CLUBS, ["ID", "JSON_DATA", "Name", "Updated_At"], "#10b981");

    // 4. TẠO SHEET SUB_CATEGORIES (Mới)
    createSheetIfNotExists(ss, CONFIG.SHEET_SUBCATS, ["ID", "JSON_DATA", "Club_ID", "Name"], "#f43f5e");

    // 5. TẠO FOLDER UPLOAD
    var folderUrl = "";
    var folders = DriveApp.getFoldersByName(CONFIG.FOLDER_NAME);
    if (!folders.hasNext()) {
      var folder = DriveApp.createFolder(CONFIG.FOLDER_NAME);
      folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      folderUrl = folder.getUrl();
    }

    // Xóa sheet mặc định
    var sheet1 = ss.getSheetByName("Sheet1");
    if (sheet1 && sheet1.getLastRow() === 0) ss.deleteSheet(sheet1);

    var msg = "✅ CÀI ĐẶT THÀNH CÔNG (V2)!\n\nĐã tạo đủ các bảng: Users, Posts, Clubs, SubCategories.\nHãy Deploy lại (New Version) để áp dụng.";
    Logger.log(msg);
    try { ui.alert(msg); } catch(e) {}

  } catch (e) {
    Logger.log("Lỗi Setup: " + e.toString());
  }
}

function createSheetIfNotExists(ss, name, headers, color) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground(color).setFontColor("white");
  }
  return sheet;
}

/**
 * API XỬ LÝ YÊU CẦU
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // --- 1. LOGIN ---
    if (action === "LOGIN") {
      var usersSheet = ss.getSheetByName(CONFIG.SHEET_USERS);
      if(!usersSheet) return error("Lỗi: Chưa chạy setupSystem()");

      var inputEmail = data.email.toLowerCase().trim();
      var rows = usersSheet.getDataRange().getValues();
      var user = null;

      for (var i = 1; i < rows.length; i++) {
        var sheetEmail = String(rows[i][0]).toLowerCase().trim();
        if (sheetEmail === inputEmail) {
          user = { email: rows[i][0], name: rows[i][1], role: rows[i][2] };
          break;
        }
      }
      if (user) return success({ user: user });
      return error("Email '" + inputEmail + "' chưa được cấp quyền.");
    }

    // --- 2. UPLOAD FILE ---
    if (action === "UPLOAD") {
      var folders = DriveApp.getFoldersByName(CONFIG.FOLDER_NAME);
      var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(CONFIG.FOLDER_NAME);
      var decoded = Utilities.base64Decode(data.base64);
      var blob = Utilities.newBlob(decoded, data.mimeType, data.filename);
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      return success({ url: "https://drive.google.com/uc?export=view&id=" + file.getId() });
    }

    // --- 3. POSTS MANAGEMENT ---
    if (action === "ADD_POST") {
      var sheet = ss.getSheetByName(CONFIG.SHEET_POSTS);
      sheet.appendRow([data.post.id, JSON.stringify(data.post), new Date(), data.post.title, data.post.authorName]);
      return success({ message: "Saved" });
    }

    if (action === "GET_POSTS") {
      return success({ posts: getJsonFromSheet(ss, CONFIG.SHEET_POSTS) });
    }

    // --- 4. CLUBS & METADATA MANAGEMENT (NEW) ---
    // Lấy toàn bộ danh sách CLB và SubCategories
    if (action === "GET_METADATA") {
      var clubs = getJsonFromSheet(ss, CONFIG.SHEET_CLUBS);
      var subCats = getJsonFromSheet(ss, CONFIG.SHEET_SUBCATS);
      return success({ clubs: clubs, subCategories: subCats });
    }

    // Đồng bộ danh sách CLB (Ghi đè toàn bộ - Phù hợp với số lượng ít < 100 dòng)
    if (action === "SYNC_CLUBS") {
      var sheet = ss.getSheetByName(CONFIG.SHEET_CLUBS);
      if (sheet.getLastRow() > 1) {
        sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
      }
      
      var rows = data.clubs.map(function(c) {
        return [c.id, JSON.stringify(c), c.name, new Date()];
      });
      
      if (rows.length > 0) {
        sheet.getRange(2, 1, rows.length, 4).setValues(rows);
      }
      return success({ message: "Clubs Synced" });
    }

    // Đồng bộ danh sách SubCategories
    if (action === "SYNC_SUBCATS") {
      var sheet = ss.getSheetByName(CONFIG.SHEET_SUBCATS);
      if (sheet.getLastRow() > 1) {
        sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
      }
      
      var rows = data.subCategories.map(function(s) {
        return [s.id, JSON.stringify(s), s.clubId, s.name];
      });
      
      if (rows.length > 0) {
        sheet.getRange(2, 1, rows.length, 4).setValues(rows);
      }
      return success({ message: "SubCategories Synced" });
    }

    return error("Unknown Action");

  } catch (e) {
    return error("Server Error: " + e.toString());
  } finally {
    lock.releaseLock();
  }
}

// Helper đọc cột chứa JSON (Cột index 1 - Cột B)
function getJsonFromSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  var result = [];
  for (var i = 1; i < rows.length; i++) {
    try {
      if (rows[i][1]) result.push(JSON.parse(rows[i][1]));
    } catch (e) {}
  }
  return result;
}

function success(data) {
  return ContentService.createTextOutput(JSON.stringify(Object.assign({status: 'success'}, data))).setMimeType(ContentService.MimeType.JSON);
}

function error(msg) {
  return ContentService.createTextOutput(JSON.stringify({status: 'error', error: msg})).setMimeType(ContentService.MimeType.JSON);
}