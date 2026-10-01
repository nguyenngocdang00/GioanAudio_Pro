/* StageAudio Pro — backend Apps Script (Drive là thư viện nhạc) */
const CHUNK = 6 * 1024 * 1024;
const props_ = () => PropertiesService.getScriptProperties();

// Chạy MỘT LẦN từ trình soạn thảo: tạo thư mục StageAudio + API key, xem kết quả ở Nhật ký thực thi.
function setup() {
  const p = props_();
  if (!p.getProperty('API_KEY')) p.setProperty('API_KEY', Utilities.getUuid().replace(/-/g, ''));
  Logger.log('Thư mục nhạc: ' + folder_().getUrl() + '\nAPI_KEY: ' + p.getProperty('API_KEY'));
}
function folder_() {
  const id = props_().getProperty('FOLDER_ID');
  if (id) return DriveApp.getFolderById(id);
  const it = DriveApp.getFoldersByName('StageAudio');
  const f = it.hasNext() ? it.next() : DriveApp.createFolder('StageAudio');
  props_().setProperty('FOLDER_ID', f.getId());
  return f;
}
const json_ = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
const auth_ = k => !!k && k === props_().getProperty('API_KEY');
const isAudio_ = f => /^audio\//.test(f.getMimeType()) || /\.(mp3|m4a|wav|ogg|aac|flac)$/i.test(f.getName());

function doGet(e) {
  try {
    const q = e.parameter || {};
    if (!auth_(q.key)) return json_({ok: false, error: 'Sai API key'});
    if (q.action === 'list') return json_({ok: true, files: list_(), manifest: readManifest_()});
    if (q.action === 'file') return json_(chunk_(q.id, Number(q.offset) || 0, Math.min(Number(q.len) || CHUNK, CHUNK)));
    return json_({ok: true});
  } catch (err) { return json_({ok: false, error: String(err)}); }
}
function doPost(e) {
  try {
    const b = JSON.parse(e.postData.contents);
    if (!auth_(b.key)) return json_({ok: false, error: 'Sai API key'});
    if (b.action === 'saveManifest') { writeManifest_(b.manifest); return json_({ok: true}); }
    return json_({ok: false, error: 'action không hợp lệ'});
  } catch (err) { return json_({ok: false, error: String(err)}); }
}
function list_() {
  const out = [], it = folder_().getFiles();
  while (it.hasNext()) {
    const f = it.next();
    if (isAudio_(f)) out.push({id: f.getId(), name: f.getName(), size: f.getSize(), modified: f.getLastUpdated().getTime()});
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}
function manifestFile_() { const it = folder_().getFilesByName('manifest.json'); return it.hasNext() ? it.next() : null; }
function readManifest_() { const f = manifestFile_(); return f ? JSON.parse(f.getBlob().getDataAsString()) : null; }
function writeManifest_(m) {
  const t = JSON.stringify(m), f = manifestFile_();
  if (f) f.setContent(t); else folder_().createFile('manifest.json', t, MimeType.PLAIN_TEXT);
}
function assertInFolder_(id) {
  const fid = folder_().getId(), ps = DriveApp.getFileById(id).getParents();
  while (ps.hasNext()) if (ps.next().getId() === fid) return;
  throw new Error('File không nằm trong thư mục StageAudio');
}
// Trả về một đoạn file (base64) bằng Drive API + Range để không đụng giới hạn 50 MB.
function chunk_(id, offset, len) {
  assertInFolder_(id);
  const f = DriveApp.getFileById(id), total = f.getSize(), base = {ok: true, total, mime: f.getMimeType(), modified: f.getLastUpdated().getTime()};
  if (!total || offset >= total) return Object.assign(base, {data: ''});
  const end = Math.min(total, offset + len) - 1;
  const res = UrlFetchApp.fetch('https://www.googleapis.com/drive/v3/files/' + id + '?alt=media', {
    headers: {Authorization: 'Bearer ' + ScriptApp.getOAuthToken(), Range: 'bytes=' + offset + '-' + end},
    muteHttpExceptions: true
  });
  const code = res.getResponseCode();
  if (code !== 200 && code !== 206) throw new Error('Drive trả về mã ' + code);
  return Object.assign(base, {data: Utilities.base64Encode(res.getContent())});
}
