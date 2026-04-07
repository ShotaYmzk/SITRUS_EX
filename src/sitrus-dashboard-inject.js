/**
 * SITRUS EX — Dashboard（サイドバーアイコン + 設定: ライト/ダーク・プライバシー・ログイン背景）
 */
(function () {
  'use strict';

  /* ============================================================
     SVG Icon Library (24x24 stroke-style, Heroicons-inspired)
     ============================================================ */
  var ICONS = {
    calendar: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>',
    pencilSquare: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>',
    chartBar: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>',
    bookOpen: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>',
    bell: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>',
    user: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>',
    building: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5M3.75 3v18h6V12.75h4.5V21h6V3H3.75zm3 3h1.5m-1.5 3h1.5m-1.5 3h1.5m4.5-9h1.5m-1.5 3h1.5m-1.5 3h1.5"/></svg>',
    search: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>',
    clipboardCheck: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 011.65 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"/></svg>',
    cube: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/></svg>',
    listBullet: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>',
    academicCap: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/></svg>',
    ticket: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"/></svg>',
    clock: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    tableCells: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M10.875 12c-.621 0-1.125.504-1.125 1.125M12 12c.621 0 1.125.504 1.125 1.125m0-1.125c.621 0 1.125.504 1.125 1.125m-2.25 0c0 .621-.504 1.125-1.125 1.125m0 1.5c0-.621.504-1.125 1.125-1.125m0 0c.621 0 1.125.504 1.125 1.125M12 13.125c0-.621.504-1.125 1.125-1.125"/></svg>',
    cog: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    printer: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"/></svg>',
    arrowDownTray: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>',
    documentText: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>',
    infoCircle: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg>',
    home: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>',
    adjustments: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"/></svg>',
    bolt: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>'
  };

  /* keyword → icon mapping for sidebar links */
  var ICON_MAP = [
    { keywords: ['時間割一覧', '時間割表', 'Timetable', 'JikItiran', 'JikHyoji'], icon: 'calendar' },
    { keywords: ['履修登録状況', '履修登録', '登録', 'Registration', 'RishuToroku', 'Toroku'], icon: 'pencilSquare' },
    { keywords: ['成績', 'Grade', 'Seiseki', 'GPA'], icon: 'chartBar' },
    { keywords: ['シラバス', 'Syllabus'], icon: 'bookOpen' },
    { keywords: ['お知らせ', '通知', 'Notice', 'Announce', 'Oshirase', 'Info'], icon: 'bell' },
    { keywords: ['学生情報', '個人情報', 'Student', 'GakuseiJoho', 'Profile'], icon: 'user' },
    { keywords: ['教室', '校舎', 'Classroom', 'Room', 'Kyoshitsu', 'Building'], icon: 'building' },
    { keywords: ['検索', 'Search', 'Kensaku'], icon: 'search' },
    { keywords: ['抽選', 'Lottery', 'Chusen', 'Draw'], icon: 'ticket' },
    { keywords: ['単位', 'Credit', 'Tani', 'Unit'], icon: 'clipboardCheck' },
    { keywords: ['科目一覧', '科目', 'Subject', 'Kamoku', 'Course'], icon: 'listBullet' },
    { keywords: ['卒業', 'Graduation', 'Sotsugyou'], icon: 'academicCap' },
    { keywords: ['印刷', 'Print'], icon: 'printer' },
    { keywords: ['ダウンロード', 'Download', 'DL', 'Export', 'CSV'], icon: 'arrowDownTray' },
    { keywords: ['設定', 'Setting', 'Config'], icon: 'cog' },
    { keywords: ['一覧', 'List', 'Itiran'], icon: 'tableCells' },
    { keywords: ['申請', 'Apply', 'Request', 'Shinsei'], icon: 'documentText' },
    { keywords: ['確認', 'Confirm', 'Kakunin'], icon: 'clipboardCheck' },
    { keywords: ['照会', 'Inquiry', 'Shokai', 'Reference'], icon: 'search' },
    { keywords: ['ホーム', 'Home', 'Top', 'Menu'], icon: 'home' },
    { keywords: ['集中', '実習', 'Intensive', 'Practice'], icon: 'bolt' },
    { keywords: ['変更', 'Change', 'Modify', 'Henkou'], icon: 'adjustments' },
    { keywords: ['詳細', 'Detail', 'Shosai'], icon: 'infoCircle' }
  ];

  function matchIcon(text, href) {
    var combined = (text + ' ' + href).toLowerCase();
    for (var i = 0; i < ICON_MAP.length; i++) {
      for (var j = 0; j < ICON_MAP[i].keywords.length; j++) {
        if (combined.indexOf(ICON_MAP[i].keywords[j].toLowerCase()) !== -1) {
          return ICON_MAP[i].icon;
        }
      }
    }
    return 'cube';
  }

  /* ============================================================
     表示モード（ライト / ダーク）+ ログイン背景スライド
     ============================================================ */
  var DEFAULT_APPEARANCE = 'light';
  var BUILTIN_BG_COUNT = 10;
  var MAX_CUSTOM_IMAGES = 12;
  var MAX_IMAGE_BYTES = 2.5 * 1024 * 1024;

  function defaultLoginSlides() {
    var a = [];
    for (var i = 0; i < BUILTIN_BG_COUNT; i++) {
      a.push({ kind: 'builtin', i: i });
    }
    return a;
  }

  function applyAppearance(mode) {
    var m = mode === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-sitrus-appearance', m);
  }

  /** true = ナビ右上の学籍番号・氏名を表示（既定）。false = スクリーンショット用に非表示 */
  function applyNavbarUserVisibility(show) {
    if (show) {
      document.documentElement.removeAttribute('data-sitrus-hide-navbar-user');
    } else {
      document.documentElement.setAttribute('data-sitrus-hide-navbar-user', 'true');
    }
  }

  function migrateAndLoadAppearance(cb) {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      applyAppearance(DEFAULT_APPEARANCE);
      applyNavbarUserVisibility(true);
      cb();
      return;
    }
    chrome.storage.local.get(['sitrusAppearance', 'sitrusTheme', 'sitrusShowStudentId'], function (r) {
      var app = r.sitrusAppearance;
      if (!app) {
        app = r.sitrusTheme === 'linear' ? 'dark' : DEFAULT_APPEARANCE;
        chrome.storage.local.set({ sitrusAppearance: app });
        if (r.sitrusTheme != null) {
          chrome.storage.local.remove('sitrusTheme');
        }
      }
      applyAppearance(app);
      applyNavbarUserVisibility(r.sitrusShowStudentId !== false);
      cb();
    });
  }

  migrateAndLoadAppearance(function () {});

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    /* ---- Version badge ---- */
    var version = '0.0.0';
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest) {
      version = chrome.runtime.getManifest().version;
    }
    var badge = document.createElement('div');
    badge.id = 'sitrus-ex-version';
    badge.textContent = 'SITRUS EX v' + version;
    document.body.appendChild(badge);

    /* ---- Rename navbar brand ---- */
    var nav = document.querySelector('.navbar.fixed-top');
    if (nav) {
      var walker = document.createTreeWalker(nav, NodeFilter.SHOW_TEXT, null, false);
      var node;
      while ((node = walker.nextNode())) {
        if (node.textContent.indexOf('SITRUS') !== -1) {
          var span = document.createElement('span');
          span.className = 'sitrus-ex-brand';
          span.textContent = 'SITRUS EX';
          node.parentNode.replaceChild(span, node);
          break;
        }
      }
    }

    /* ---- Sidebar: add SVG icons + mark active ---- */
    var currentFile = window.location.pathname.split('/').pop();
    var sidebarLinks = document.querySelectorAll('.sidebar .button_list');
    sidebarLinks.forEach(function (link) {
      var href = (link.getAttribute('href') || '').split('?')[0].split('/').pop();
      if (href && currentFile && href === currentFile) {
        link.classList.add('sitrus-ex-active');
      }

      var existingImgs = link.querySelectorAll('img');
      existingImgs.forEach(function (img) { img.style.display = 'none'; });

      var linkText = link.textContent.trim();
      var iconKey = matchIcon(linkText, link.getAttribute('href') || '');
      var iconSvg = ICONS[iconKey] || ICONS.cube;

      var iconSpan = document.createElement('span');
      iconSpan.className = 'sitrus-ex-sidebar-icon';
      iconSpan.innerHTML = iconSvg;
      link.insertBefore(iconSpan, link.firstChild);
    });

    /* ---- Jumbotron / page title icons (same SVG set as sidebar) ---- */
    function h3TitleTextForMatch(h3) {
      var clone = h3.cloneNode(true);
      clone.querySelectorAll('img').forEach(function (n) { n.remove(); });
      clone.querySelectorAll('.sitrus-ex-page-title-icon').forEach(function (n) { n.remove(); });
      return clone.textContent.replace(/\s+/g, ' ').trim();
    }

    document.querySelectorAll(
      '.jumbotron h3 img, ._navbar_fixed_top_slide h3 img, ._navbar_fixed_top_slide1 h3 img, ._navbar_fixed_top_slide2 h3 img'
    ).forEach(function (img) {
      var h3 = img.closest('h3');
      if (!h3 || h3.querySelector('.sitrus-ex-page-title-icon')) return;
      var titleText = h3TitleTextForMatch(h3);
      var iconKey = matchIcon(titleText, '');
      var iconSvg = ICONS[iconKey] || ICONS.cube;
      img.style.display = 'none';
      var iconSpan = document.createElement('span');
      iconSpan.className = 'sitrus-ex-sidebar-icon sitrus-ex-page-title-icon';
      iconSpan.setAttribute('aria-hidden', 'true');
      iconSpan.innerHTML = iconSvg;
      h3.insertBefore(iconSpan, h3.firstChild);
    });

    /* ---- Settings gear button ---- */
    var engBtn = document.getElementById('JpnEngMode');
    if (!engBtn) return;

    var gearWrap = document.createElement('div');
    gearWrap.style.cssText = 'padding:0 1px;display:inline-block;vertical-align:middle;';

    var gearBtn = document.createElement('button');
    gearBtn.className = 'sitrus-ex-settings-btn';
    gearBtn.title = 'SITRUS EX 設定';
    gearBtn.innerHTML = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.062 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"/>'
      + '</svg>';
    gearWrap.appendChild(gearBtn);

    var engParent = engBtn.parentNode;
    engParent.parentNode.insertBefore(gearWrap, engParent.nextSibling);

    /* ---- 設定ポップアップ（ライト/ダーク・ログイン背景） ---- */
    var overlay = document.createElement('div');
    overlay.className = 'sitrus-ex-overlay';
    document.body.appendChild(overlay);

    var popup = document.createElement('div');
    popup.className = 'sitrus-ex-theme-popup';

    var title = document.createElement('div');
    title.className = 'sitrus-ex-theme-popup-title';
    title.textContent = 'SITRUS EX 設定';
    popup.appendChild(title);

    var secMode = document.createElement('div');
    secMode.className = 'sitrus-ex-settings-section';
    var secModeTitle = document.createElement('div');
    secModeTitle.className = 'sitrus-ex-settings-section-title';
    secModeTitle.textContent = '表示モード';
    secMode.appendChild(secModeTitle);

    var appearanceRow = document.createElement('div');
    appearanceRow.className = 'sitrus-ex-appearance-row';
    var btnLight = document.createElement('button');
    btnLight.type = 'button';
    btnLight.className = 'sitrus-ex-appearance-btn';
    btnLight.textContent = 'ライト';
    var btnDark = document.createElement('button');
    btnDark.type = 'button';
    btnDark.className = 'sitrus-ex-appearance-btn';
    btnDark.textContent = 'ダーク';
    appearanceRow.appendChild(btnLight);
    appearanceRow.appendChild(btnDark);
    secMode.appendChild(appearanceRow);
    popup.appendChild(secMode);

    function syncAppearanceButtons() {
      var m = document.documentElement.getAttribute('data-sitrus-appearance') || DEFAULT_APPEARANCE;
      btnLight.classList.toggle('active', m === 'light');
      btnDark.classList.toggle('active', m === 'dark');
    }
    syncAppearanceButtons();

    function setAppearance(mode) {
      applyAppearance(mode);
      if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ sitrusAppearance: mode === 'dark' ? 'dark' : 'light' });
      }
      syncAppearanceButtons();
    }
    btnLight.addEventListener('click', function () { setAppearance('light'); });
    btnDark.addEventListener('click', function () { setAppearance('dark'); });

    var secPrivacy = document.createElement('div');
    secPrivacy.className = 'sitrus-ex-settings-section';
    var secPrivacyTitle = document.createElement('div');
    secPrivacyTitle.className = 'sitrus-ex-settings-section-title';
    secPrivacyTitle.textContent = 'プライバシー';
    secPrivacy.appendChild(secPrivacyTitle);

    var privacyRow = document.createElement('div');
    privacyRow.className = 'sitrus-ex-appearance-row';
    var btnShowUser = document.createElement('button');
    btnShowUser.type = 'button';
    btnShowUser.className = 'sitrus-ex-appearance-btn';
    btnShowUser.textContent = '学籍番号を表示';
    var btnHideUser = document.createElement('button');
    btnHideUser.type = 'button';
    btnHideUser.className = 'sitrus-ex-appearance-btn';
    btnHideUser.textContent = '非表示';
    privacyRow.appendChild(btnShowUser);
    privacyRow.appendChild(btnHideUser);
    secPrivacy.appendChild(privacyRow);

    var privacyHint = document.createElement('div');
    privacyHint.className = 'sitrus-ex-settings-hint';
    privacyHint.textContent =
      'ストア用スクリーンショットなどで学籍番号・氏名を隠すときは「非表示」にしてください。撮影後は「表示」に戻せます。';
    secPrivacy.appendChild(privacyHint);
    popup.appendChild(secPrivacy);

    function syncPrivacyButtons() {
      var hidden = document.documentElement.getAttribute('data-sitrus-hide-navbar-user') === 'true';
      btnShowUser.classList.toggle('active', !hidden);
      btnHideUser.classList.toggle('active', hidden);
    }
    syncPrivacyButtons();

    function setNavbarUserVisibility(show) {
      applyNavbarUserVisibility(show);
      if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ sitrusShowStudentId: show });
      }
      syncPrivacyButtons();
    }
    btnShowUser.addEventListener('click', function () { setNavbarUserVisibility(true); });
    btnHideUser.addEventListener('click', function () { setNavbarUserVisibility(false); });

    var secBg = document.createElement('div');
    secBg.className = 'sitrus-ex-settings-section';
    var secBgTitle = document.createElement('div');
    secBgTitle.className = 'sitrus-ex-settings-section-title';
    secBgTitle.textContent = 'ログイン画面の背景スライド';
    secBg.appendChild(secBgTitle);

    var slidesListEl = document.createElement('div');
    slidesListEl.className = 'sitrus-ex-slides-list';
    secBg.appendChild(slidesListEl);

    var slidesActions = document.createElement('div');
    slidesActions.className = 'sitrus-ex-settings-actions';
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.className = 'sitrus-ex-settings-file';
    fileInput.multiple = true;
    var btnAddImg = document.createElement('button');
    btnAddImg.type = 'button';
    btnAddImg.className = 'sitrus-ex-settings-btn-secondary';
    btnAddImg.textContent = '画像を追加';
    var btnResetOrder = document.createElement('button');
    btnResetOrder.type = 'button';
    btnResetOrder.className = 'sitrus-ex-settings-btn-secondary';
    btnResetOrder.textContent = '順序を初期化';
    var btnClearCustom = document.createElement('button');
    btnClearCustom.type = 'button';
    btnClearCustom.className = 'sitrus-ex-settings-btn-secondary';
    btnClearCustom.textContent = '追加画像をすべて削除';
    slidesActions.appendChild(fileInput);
    slidesActions.appendChild(btnAddImg);
    slidesActions.appendChild(btnResetOrder);
    slidesActions.appendChild(btnClearCustom);
    secBg.appendChild(slidesActions);

    var hint = document.createElement('div');
    hint.className = 'sitrus-ex-settings-hint';
    hint.textContent =
      '公式の背景10枚と、追加した画像を並べ替えできます。画像はこの端末のブラウザ内にのみ保存されます（1枚あたり約2.5MBまで）。';
    secBg.appendChild(hint);
    popup.appendChild(secBg);

    var loginSlidesState = defaultLoginSlides();

    function saveLoginSlides() {
      if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ sitrusLoginSlides: loginSlidesState });
      }
    }

    function loadLoginSlidesFromStorage(cb) {
      if (!chrome.storage || !chrome.storage.local) {
        loginSlidesState = defaultLoginSlides();
        cb();
        return;
      }
      chrome.storage.local.get('sitrusLoginSlides', function (r) {
        var s = r.sitrusLoginSlides;
        if (!s || !Array.isArray(s) || s.length === 0) {
          loginSlidesState = defaultLoginSlides();
        } else {
          loginSlidesState = s.filter(function (item) {
            if (!item || !item.kind) return false;
            if (item.kind === 'builtin') {
              return typeof item.i === 'number' && item.i >= 0 && item.i < BUILTIN_BG_COUNT;
            }
            if (item.kind === 'custom') {
              return typeof item.url === 'string' && item.url.indexOf('data:image') === 0;
            }
            return false;
          });
          if (loginSlidesState.length === 0) loginSlidesState = defaultLoginSlides();
        }
        cb();
      });
    }

    var BUILTIN_BG_PATHS = [
      'assets/images/background_01.jpg',
      'assets/images/background_02.jpg',
      'assets/images/background_03.jpg',
      'assets/images/background_04.jpg',
      'assets/images/background_05.png',
      'assets/images/background_06.png',
      'assets/images/background_07.jpg',
      'assets/images/background_08.png',
      'assets/images/background_09.jpg',
      'assets/images/background_10.png'
    ];

    function builtinLabel(idx) {
      return '公式 #' + (idx + 1);
    }

    function renderSlidesList() {
      slidesListEl.innerHTML = '';
      loginSlidesState.forEach(function (item, idx) {
        var row = document.createElement('div');
        row.className = 'sitrus-ex-slide-row';
        var thumb = document.createElement('img');
        thumb.className = 'sitrus-ex-slide-thumb';
        thumb.alt = '';
        if (item.kind === 'builtin' && typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
          thumb.src = chrome.runtime.getURL(BUILTIN_BG_PATHS[item.i]);
        } else if (item.kind === 'custom') {
          thumb.src = item.url;
        }
        var lab = document.createElement('div');
        lab.className = 'sitrus-ex-slide-label';
        lab.textContent = item.kind === 'builtin' ? builtinLabel(item.i) : 'マイ画像';
        var actions = document.createElement('div');
        actions.className = 'sitrus-ex-slide-actions';
        var bUp = document.createElement('button');
        bUp.type = 'button';
        bUp.textContent = '↑';
        bUp.title = '上へ';
        var bDown = document.createElement('button');
        bDown.type = 'button';
        bDown.textContent = '↓';
        bDown.title = '下へ';
        bUp.disabled = idx === 0;
        bDown.disabled = idx === loginSlidesState.length - 1;
        bUp.addEventListener('click', function () {
          if (idx <= 0) return;
          var t = loginSlidesState[idx - 1];
          loginSlidesState[idx - 1] = loginSlidesState[idx];
          loginSlidesState[idx] = t;
          saveLoginSlides();
          renderSlidesList();
        });
        bDown.addEventListener('click', function () {
          if (idx >= loginSlidesState.length - 1) return;
          var t = loginSlidesState[idx + 1];
          loginSlidesState[idx + 1] = loginSlidesState[idx];
          loginSlidesState[idx] = t;
          saveLoginSlides();
          renderSlidesList();
        });
        actions.appendChild(bUp);
        actions.appendChild(bDown);
        if (item.kind === 'custom') {
          var bDel = document.createElement('button');
          bDel.type = 'button';
          bDel.textContent = '×';
          bDel.title = '削除';
          bDel.addEventListener('click', function () {
            loginSlidesState.splice(idx, 1);
            if (loginSlidesState.length === 0) loginSlidesState = defaultLoginSlides();
            saveLoginSlides();
            renderSlidesList();
          });
          actions.appendChild(bDel);
        }
        row.appendChild(thumb);
        row.appendChild(lab);
        row.appendChild(actions);
        slidesListEl.appendChild(row);
      });
    }

    loadLoginSlidesFromStorage(function () {
      renderSlidesList();
    });

    btnAddImg.addEventListener('click', function () {
      fileInput.click();
    });

    fileInput.addEventListener('change', function () {
      var files = fileInput.files;
      if (!files || !files.length) return;
      var customCount = loginSlidesState.filter(function (x) {
        return x.kind === 'custom';
      }).length;
      var toRead = Math.min(files.length, MAX_CUSTOM_IMAGES - customCount);
      var readIndex = 0;

      function readNext() {
        if (readIndex >= toRead) {
          fileInput.value = '';
          saveLoginSlides();
          renderSlidesList();
          return;
        }
        var f = files[readIndex];
        if (f.size > MAX_IMAGE_BYTES) {
          readIndex += 1;
          readNext();
          return;
        }
        var reader = new FileReader();
        reader.onload = function (ev) {
          var url = ev.target && ev.target.result;
          if (typeof url === 'string' && url.indexOf('data:image') === 0) {
            loginSlidesState.push({ kind: 'custom', url: url });
          }
          readIndex += 1;
          readNext();
        };
        reader.onerror = function () {
          readIndex += 1;
          readNext();
        };
        reader.readAsDataURL(f);
      }
      readNext();
    });

    btnResetOrder.addEventListener('click', function () {
      var customs = loginSlidesState.filter(function (x) {
        return x.kind === 'custom';
      });
      loginSlidesState = defaultLoginSlides().concat(customs);
      saveLoginSlides();
      renderSlidesList();
    });

    btnClearCustom.addEventListener('click', function () {
      loginSlidesState = loginSlidesState.filter(function (x) {
        return x.kind === 'builtin';
      });
      if (loginSlidesState.length === 0) loginSlidesState = defaultLoginSlides();
      saveLoginSlides();
      renderSlidesList();
    });

    document.body.appendChild(popup);

    function togglePopup() {
      var isOpen = popup.classList.contains('open');
      popup.classList.toggle('open');
      overlay.classList.toggle('open');
      if (!isOpen) {
        loadLoginSlidesFromStorage(function () {
          renderSlidesList();
          syncAppearanceButtons();
          syncPrivacyButtons();
        });
        var rect = gearBtn.getBoundingClientRect();
        popup.style.top = (rect.bottom + 8) + 'px';
        popup.style.right = (window.innerWidth - rect.right) + 'px';
      }
    }

    gearBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      togglePopup();
    });

    overlay.addEventListener('click', function () {
      popup.classList.remove('open');
      overlay.classList.remove('open');
    });
  });
})();
