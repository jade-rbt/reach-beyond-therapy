/**
 * Reach Beyond Therapy — email sign-ups → Google Sheet
 * ------------------------------------------------------
 * Receives submissions from the footer "Keep Up with Functional Tips & Tricks"
 * form (every page) and the waitlist page (/waitlist.html). Each form gets
 * its own tab in the same Sheet: "Newsletter" and "Course Waitlist".
 *
 * ONE-TIME SETUP (about 5 minutes):
 *  1. Create a new Google Sheet (e.g. "RBT Email Signups") while signed in
 *     to the clinic Google account.
 *  2. In the Sheet: Extensions → Apps Script. Delete the sample code and paste
 *     this whole file in. Click Save.
 *  3. Click Deploy → New deployment → gear icon → "Web app".
 *       Description:      RBT signups
 *       Execute as:       Me
 *       Who has access:   Anyone   (NOT "Anyone within reachbeyondtherapy.com"
 *                                    — that makes Google demand a login and
 *                                    public sign-ups silently fail)
 *     Click Deploy, approve the permissions prompt, and copy the
 *     "Web app URL" (ends in /exec).
 *  4. In the website repo, open _config.yml and paste that URL as
 *     signup_endpoint: "https://script.google.com/macros/s/XXXX/exec"
 *     Commit + push. GitHub Pages rebuilds in a minute or two.
 *  5. Test: submit your own email on the site — a row should appear.
 *
 * If you edit this script later, use Deploy → Manage deployments → Edit →
 * Version: "New version" so the same URL keeps working.
 *
 * Optional: set NOTIFY_EMAIL below to get an email for every new sign-up.
 */

// Each form logs to its own tab (created automatically on first sign-up).
var TABS = {
  'footer-newsletter': 'Newsletter',
  'waitlist-pinky-sided-wrist-pain': 'Course Waitlist'
};
var DEFAULT_TAB = 'Other Signups';
var NOTIFY_EMAIL = ''; // e.g. 'info@reachbeyondtherapy.com' — leave blank for no emails
var HEADERS = ['Timestamp', 'Form', 'First Name', 'Last Name', 'Email', 'Page'];

function doPost(e) {
  var p = (e && e.parameter) || {};

  // Honeypot: real visitors never fill this hidden field.
  if (p.website) return ok_();

  var email = String(p.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
    return ContentService.createTextOutput('invalid email');
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var tab = TABS[p.form] || DEFAULT_TAB;
    var sheet = ss.getSheetByName(tab) || ss.insertSheet(tab);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    var row = [
      new Date(),
      clean_(p.form),
      clean_(p.first_name),
      clean_(p.last_name),
      email,
      clean_(p.page)
    ];
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }

  if (NOTIFY_EMAIL) {
    MailApp.sendEmail(NOTIFY_EMAIL, 'New sign-up: ' + clean_(p.form),
      [clean_(p.first_name), clean_(p.last_name), email, clean_(p.page)].join('\n'));
  }
  return ok_();
}

// Visiting the URL in a browser just confirms it's live.
function doGet() {
  return ContentService.createTextOutput('RBT sign-up endpoint is running.');
}

function ok_() {
  return ContentService.createTextOutput('ok');
}

// Trim, cap length, and stop spreadsheet formula injection (=, +, -, @).
function clean_(v) {
  var s = String(v == null ? '' : v).trim().slice(0, 200);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
