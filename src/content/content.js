/**
 * SITRUS EX - Content Script
 */

/** ログイン画面の背景を切り替える間隔（ミリ秒） */
const LOGIN_BACKGROUND_INTERVAL_MS = 8000;

/** 背景スライドアニメーションの長さ（ミリ秒） */
const LOGIN_BACKGROUND_SLIDE_MS = 900;

/** 設定ボタン用（Lucide settings 風・stroke） */
const SC_EX_SETTINGS_ICON_SVG = `<svg class="sc-ex-settings-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const FACULTY_USERNAME_LABEL = '参照する学生のユーザ名を入力';

/**
 * 拡張のオプション画面を開く。
 * content script からは専用 API が使えないため、必ず sendMessage → service worker、失敗時のみ window.open。
 */
function openSitrusExOptions() {
    let url = '';
    try {
        if (typeof chrome === 'undefined' || typeof chrome.runtime?.getURL !== 'function') return;
        url = chrome.runtime.getURL('src/options/options.html');
        if (typeof chrome.runtime.sendMessage !== 'function') {
            window.open(url, '_blank', 'noopener,noreferrer');
            return;
        }
        chrome.runtime.sendMessage({ type: 'SITRUS_EX_OPEN_OPTIONS' }, (response) => {
            try {
                if (chrome.runtime.lastError || !response?.ok) {
                    window.open(url, '_blank', 'noopener,noreferrer');
                }
            } catch {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        });
    } catch {
        try {
            if (!url && typeof chrome !== 'undefined' && typeof chrome.runtime?.getURL === 'function') {
                url = chrome.runtime.getURL('src/options/options.html');
            }
            if (url) window.open(url, '_blank', 'noopener,noreferrer');
        } catch {
            /* 静かに失敗 — コンソールに未処理例外を出さない */
        }
    }
}

class SitrusEx {
    constructor() {
        this.init();
    }

    init() {
        this.applyThemeFromStorage();
        this.setupThemeListener();

        this.applyBrandFontFromStorage();
        this.setupBrandFontListener();

        this.enhanceNavbarBrand();

        if (document.getElementById('loginButton')) {
            this.applyUiImprovements();
            this.bindEvents();
        } else if (document.querySelector('.sidebar-sticky')) {
            this.initDashboard();
        }
    }

    applyThemeFromStorage() {
        const P = globalThis.SitrusExThemePrefs;
        chrome.storage.sync.get({ [P.STORAGE_KEY]: P.DEFAULT_THEME }, (items) => {
            let t = items[P.STORAGE_KEY];
            if (!P.isValidTheme(t)) t = P.DEFAULT_THEME;
            P.applyToDocument(t);
        });
    }

    setupThemeListener() {
        const P = globalThis.SitrusExThemePrefs;
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area !== 'sync' || !changes[P.STORAGE_KEY]) return;
            let t = changes[P.STORAGE_KEY].newValue;
            if (!P.isValidTheme(t)) t = P.DEFAULT_THEME;
            P.applyToDocument(t);
        });
    }

    applyBrandFontFromStorage() {
        const { STORAGE_KEY, DEFAULT_FONT_ID } = globalThis.SitrusExBrandFonts;
        chrome.storage.sync.get({ [STORAGE_KEY]: DEFAULT_FONT_ID }, (items) => {
            this.applyBrandFontId(items[STORAGE_KEY]);
        });
    }

    setupBrandFontListener() {
        const { STORAGE_KEY } = globalThis.SitrusExBrandFonts;
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area !== 'sync' || !changes[STORAGE_KEY]) return;
            this.applyBrandFontId(changes[STORAGE_KEY].newValue);
        });
    }

    applyBrandFontId(id) {
        const BF = globalThis.SitrusExBrandFonts;
        if (!BF.isValidId(id)) id = BF.DEFAULT_FONT_ID;
        const def = BF.DEFINITIONS[id];
        if (def.googleHref) {
            const sel = `link[data-sitrus-ex-font="${id}"]`;
            if (!document.querySelector(sel)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = def.googleHref;
                link.dataset.sitrusExFont = id;
                document.head.appendChild(link);
            }
        }
        document.documentElement.style.setProperty('--sc-brand-font', def.cssFamily);
        document.documentElement.dataset.sitrusBrandFont = id;
    }

    enhanceNavbarBrand() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let targetNode = null;
        for (const node of navbar.childNodes) {
            if (node.nodeType === 3 && node.textContent.includes('SITRUSシステム')) {
                targetNode = node;
                break;
            }
        }

        if (targetNode && !navbar.classList.contains('sitrus-enhanced')) {
            const brandContainer = document.createElement('span');
            brandContainer.className = 'navbar-brand-container';

            const mainText = document.createElement('span');
            mainText.className = 'navbar-brand-main';
            mainText.textContent = 'SITRUS EX';

            brandContainer.appendChild(mainText);

            targetNode.parentNode.replaceChild(brandContainer, targetNode);
            navbar.classList.add('sitrus-enhanced');
        }
    }

    applyUiImprovements() {
        document.body.classList.add('sitrus-ex-active');
        this.startLoginBackgroundRotation();
        this.hideOriginalElementsSafely();
        this.injectNewUIElements();
        this.wrapLiquidGlassLoginButton();
    }

    /**
     * 認証ボタンを liquid glass 用マークアップ（wrap + 影レイヤー + span）で包む
     * （GitHub 初版どおり）
     */
    wrapLiquidGlassLoginButton() {
        const btn = document.getElementById('loginButton');
        if (!btn || btn.closest('.sc-login-button-wrap')) return;

        const text = (btn.textContent || '').trim() || '認証開始';
        btn.textContent = '';
        const label = document.createElement('span');
        label.className = 'sc-login-btn-label';
        label.textContent = text;
        btn.appendChild(label);

        const wrap = document.createElement('div');
        wrap.className = 'sc-login-button-wrap';

        const shadow = document.createElement('div');
        shadow.className = 'sc-button-shadow';
        shadow.setAttribute('aria-hidden', 'true');

        btn.parentNode.insertBefore(wrap, btn);
        wrap.appendChild(btn);
        wrap.appendChild(shadow);
    }

    _disposeLoginBackgroundRotation() {
        if (this._loginBgIntervalId != null) {
            clearInterval(this._loginBgIntervalId);
            this._loginBgIntervalId = null;
        }
        const slider = document.getElementById('sc-login-bg-slider');
        if (slider) slider.remove();
    }

    /**
     * 設定（sync の順序 + local のカスタム Data URL）から表示用 URL 配列を組み立てる
     */
    loadLoginBackgroundUrls(callback) {
        const P = globalThis.SitrusExLoginBgPrefs;
        chrome.storage.sync.get({ [P.SYNC_KEY]: null }, (syncItems) => {
            const orderRaw = syncItems[P.SYNC_KEY];
            chrome.storage.local.get(P.LOCAL_KEY, (localItems) => {
                const customMap = localItems[P.LOCAL_KEY] || {};
                const entries = P.normalizeOrder(orderRaw, customMap);
                const urls = entries
                    .map((e) => {
                        if (e.type === 'bundled') return chrome.runtime.getURL(e.path);
                        return customMap[e.id] || null;
                    })
                    .filter(Boolean);
                if (urls.length === 0) {
                    callback(P.BUNDLED.map((p) => chrome.runtime.getURL(p)));
                } else {
                    callback(urls);
                }
            });
        });
    }

    _ensureLoginBgStorageListener() {
        if (this._loginBgListenerAttached) return;
        this._loginBgListenerAttached = true;
        const P = globalThis.SitrusExLoginBgPrefs;
        chrome.storage.onChanged.addListener((changes, area) => {
            if (!document.body.classList.contains('sitrus-ex-active')) return;
            if (area === 'sync' && changes[P.SYNC_KEY]) {
                this.startLoginBackgroundRotation();
            }
            if (area === 'local' && changes[P.LOCAL_KEY]) {
                this.startLoginBackgroundRotation();
            }
        });
    }

    startLoginBackgroundRotation() {
        this._disposeLoginBackgroundRotation();
        this._ensureLoginBgStorageListener();
        this.loadLoginBackgroundUrls((urls) => {
            if (urls.length === 0) return;
            this._mountLoginBackgroundSlider(urls);
        });
    }

    _mountLoginBackgroundSlider(urls) {
        const slider = document.createElement('div');
        slider.id = 'sc-login-bg-slider';
        slider.setAttribute('aria-hidden', 'true');

        const layerA = document.createElement('div');
        const layerB = document.createElement('div');
        layerA.className = 'sc-login-bg-layer';
        layerB.className = 'sc-login-bg-layer';
        slider.appendChild(layerA);
        slider.appendChild(layerB);
        document.body.prepend(slider);

        const applyBg = (el, url) => {
            el.style.backgroundImage = `url("${url.replace(/"/g, '\\"')}")`;
        };

        const prefersReduced =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let index = 0;

        if (urls.length === 1 || prefersReduced) {
            applyBg(layerA, urls[0]);
            layerB.remove();
            if (urls.length > 1) {
                this._loginBgIntervalId = window.setInterval(() => {
                    index = (index + 1) % urls.length;
                    applyBg(layerA, urls[index]);
                }, LOGIN_BACKGROUND_INTERVAL_MS);
            }
            return;
        }

        let front = layerA;
        let back = layerB;

        applyBg(front, urls[0]);
        back.style.transform = 'translateX(100%)';

        const ease = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

        const showNext = () => {
            const nextIndex = (index + 1) % urls.length;
            applyBg(back, urls[nextIndex]);

            front.style.transition = 'none';
            back.style.transition = 'none';
            back.style.transform = 'translateX(100%)';
            front.style.transform = 'translateX(0)';
            void back.offsetWidth;

            back.style.transition = `transform ${LOGIN_BACKGROUND_SLIDE_MS}ms ${ease}`;
            front.style.transition = `transform ${LOGIN_BACKGROUND_SLIDE_MS}ms ${ease}`;
            back.style.transform = 'translateX(0)';
            front.style.transform = 'translateX(-100%)';

            let done = false;
            const finish = () => {
                if (done) return;
                done = true;
                clearTimeout(fallbackTimer);
                front.removeEventListener('transitionend', onEnd);
                front.style.transition = 'none';
                front.style.transform = 'translateX(100%)';
                index = nextIndex;
                const tmp = front;
                front = back;
                back = tmp;
            };

            const onEnd = (e) => {
                if (e.propertyName !== 'transform') return;
                finish();
            };

            const fallbackTimer = setTimeout(finish, LOGIN_BACKGROUND_SLIDE_MS + 120);
            front.addEventListener('transitionend', onEnd);
        };

        this._loginBgIntervalId = window.setInterval(showNext, LOGIN_BACKGROUND_INTERVAL_MS);
    }

    hideOriginalElementsSafely() {
        const systemNameEl = document.getElementById('system_name');
        if (systemNameEl && this.checkExactTextMatch(systemNameEl, 'SITRUSシステム')) {
            systemNameEl.style.display = 'none';
        }

        const loginMsgEl = document.getElementById('login_msg');
        const expectedMsg =
            '※学生の場合は「入力なし」で認証開始してください。教職員の場合は「参照する学生のユーザ名」を入力してください。';
        if (loginMsgEl && this.checkExactTextMatch(loginMsgEl, expectedMsg)) {
            loginMsgEl.style.display = 'none';
        }
    }

    injectNewUIElements() {
        const logoContainer = document.createElement('div');
        logoContainer.id = 'sc-logo-container';
        const brandTitle = document.createElement('span');
        brandTitle.className = 'sc-brand-title';
        brandTitle.textContent = 'SITRUS EX';
        logoContainer.appendChild(brandTitle);
        document.body.appendChild(logoContainer);

        const versionText = document.createElement('div');
        versionText.id = 'sc-version-text';
        let ver = '';
        try {
            ver =
                typeof chrome !== 'undefined' && typeof chrome.runtime?.getManifest === 'function'
                    ? chrome.runtime.getManifest().version
                    : '';
        } catch {
            ver = '';
        }
        versionText.textContent = `SITRUS EX v${ver || '?'}`;
        document.body.appendChild(versionText);

        const loginBox = document.querySelector('.login-box');
        const loginButton = document.getElementById('loginButton');
        const formGroup = document.querySelector('.form-group');

        if (loginBox && loginButton && formGroup) {
            const toggleWrapper = document.createElement('div');
            toggleWrapper.id = 'sc-toggle-wrapper';

            const toggleText = document.createElement('span');
            toggleText.id = 'sc-faculty-toggle';
            toggleText.setAttribute('role', 'button');
            toggleText.tabIndex = 0;
            toggleText.innerHTML =
                '<span class="sc-toggle-arrow">&gt;</span> 学籍番号の入力（教職員向け）';

            toggleWrapper.appendChild(toggleText);
            toggleWrapper.appendChild(formGroup);

            loginButton.parentNode.insertBefore(toggleWrapper, loginButton.nextSibling);

            formGroup.classList.add('sc-form-hidden');
        }

        this.rewriteFacultyUsernameLabel();
        window.setTimeout(() => this.rewriteFacultyUsernameLabel(), 400);
        window.setTimeout(() => this.rewriteFacultyUsernameLabel(), 1200);
    }

    /**
     * 教職員向けフォームの「学生のユーザ名」ラベルを差し替え
     */
    rewriteFacultyUsernameLabel() {
        const fg = document.querySelector('.login-box .form-group') || document.querySelector('.form-group');
        if (!fg) return;
        const labels = fg.querySelectorAll('label');
        labels.forEach((el) => {
            const compact = el.textContent.replace(/\s+/g, '');
            if (/参照する学生のユーザ名を入力/.test(compact)) return;
            if (/学生/.test(compact) && (/ユーザ名/.test(compact) || /ユーザー名/.test(compact))) {
                el.textContent = FACULTY_USERNAME_LABEL;
            }
        });
    }

    bindEvents() {
        const toggleButton = document.getElementById('sc-faculty-toggle');
        const formGroup = document.querySelector('.form-group');

        if (toggleButton && formGroup) {
            const toggle = () => {
                formGroup.classList.toggle('sc-form-hidden');
                toggleButton.classList.toggle('is-open');
            };
            toggleButton.addEventListener('click', toggle);
            toggleButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle();
                }
            });
        }
    }

    initDashboard() {
        document.body.classList.add('sitrus-ex-dashboard');
        document.documentElement.classList.add('sitrus-ex-dashboard-html');
        this.hideLoadingScreen();
        this.setupSidebarToggle();
        this.injectNavbarToolbar();
    }

    /**
     * 右上（学籍・言語）をガラスツールバーにまとめ、右端に SITRUS EX 設定ボタンを追加
     */
    injectNavbarToolbar() {
        const tryMount = () => {
            if (document.getElementById('sc-ex-settings-btn')) return true;

            const userName = document.getElementById('userName');
            const jpn = document.getElementById('JpnEngMode');
            if (!userName || !jpn) return false;

            const settingsBtn = document.createElement('button');
            settingsBtn.type = 'button';
            settingsBtn.id = 'sc-ex-settings-btn';
            settingsBtn.className = 'sc-ex-navbar-glass-btn sc-ex-navbar-settings-btn';
            settingsBtn.setAttribute('aria-label', 'SITRUS EX の設定を開く');
            settingsBtn.setAttribute('title', 'SITRUS EX 設定');
            settingsBtn.innerHTML = `<span class="sc-ex-settings-icon-wrap" aria-hidden="true">${SC_EX_SETTINGS_ICON_SVG}</span>`;
            settingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openSitrusExOptions();
            });

            const wrap = document.createElement('div');
            wrap.className = 'sc-ex-navbar-toolbar';
            wrap.setAttribute('role', 'group');
            wrap.setAttribute('aria-label', 'アカウント・表示言語・SITRUS EX');

            if (userName.parentElement === jpn.parentElement) {
                const parent = userName.parentElement;
                parent.insertBefore(wrap, userName);
                wrap.appendChild(userName);
                wrap.appendChild(jpn);
                wrap.appendChild(settingsBtn);
            } else {
                const dock =
                    document.querySelector('.navbar .navbar-nav.ms-auto') ||
                    document.querySelector('.navbar .ms-auto') ||
                    document.querySelector('.navbar .ml-auto') ||
                    document.querySelector('.navbar .navbar-collapse');
                if (dock) {
                    dock.appendChild(settingsBtn);
                    settingsBtn.classList.add('sc-ex-navbar-settings-btn--in-nav');
                } else {
                    jpn.insertAdjacentElement('afterend', settingsBtn);
                    settingsBtn.classList.add('sc-ex-navbar-settings-btn--standalone');
                }
            }
            return true;
        };

        if (tryMount()) return;
        const t = window.setTimeout(() => {
            tryMount();
            window.clearTimeout(t);
        }, 400);
    }

    setupSidebarToggle() {
        const sidebar = document.querySelector('.sidebar-sticky');
        if (!sidebar || document.getElementById('sc-sidebar-toggle')) return;

        const sidebarCol = sidebar.closest('[class*="col-"]');
        const row = sidebarCol?.closest('.row');
        if (!sidebarCol || !row) return;

        sidebarCol.dataset.scSidebarCol = '1';

        /**
         * `<main class="col-md-9">` のように main が列そのもののとき、
         * querySelector('main') では兄弟要素として拾えないため、row 直下で main を含む列を特定する。
         */
        const resolveMainColumn = (rowEl, sidebarColEl) => {
            const mainEl = rowEl.querySelector('main');
            if (mainEl) {
                let el = mainEl;
                while (el && el.parentElement !== rowEl) {
                    el = el.parentElement;
                }
                if (el && el !== sidebarColEl && el.parentElement === rowEl) {
                    return el;
                }
            }
            const siblings = [...rowEl.children].filter((c) => c !== sidebarColEl);
            return (
                siblings.find((e) => e.tagName === 'MAIN') ||
                siblings.find((e) => e.querySelector?.('.ag-root-wrapper, .ag-theme-balham')) ||
                siblings.find((e) => e.querySelector?.('[class*="_navbar_fixed_top_slide"]')) ||
                siblings.find((e) => e.querySelector?.('.container')) ||
                siblings[siblings.length - 1]
            );
        };

        const mainCol = resolveMainColumn(row, sidebarCol);

        if (mainCol) {
            mainCol.dataset.scMainCol = '1';
        }

        const btn = document.createElement('button');
        btn.id = 'sc-sidebar-toggle';
        btn.type = 'button';
        btn.className = 'sc-sidebar-toggle-btn';
        btn.setAttribute('aria-label', 'サイドメニューを格納・展開');
        btn.setAttribute('title', 'サイドメニュー');
        btn.innerHTML = '<span class="sc-sidebar-toggle-icon" aria-hidden="true"></span>';
        document.body.appendChild(btn);

        const STORAGE_KEY = 'sitrusExSidebarCollapsed';

        const applyCollapsed = (collapsed) => {
            document.body.classList.toggle('sitrus-ex-sidebar-collapsed', collapsed);
            btn.setAttribute('aria-expanded', String(!collapsed));
            /* AG Grid 等がレイアウト後に幅を再計算するよう resize を送る */
            const dispatchResize = () => {
                window.dispatchEvent(new Event('resize'));
            };
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => {
                    dispatchResize();
                    window.setTimeout(dispatchResize, 80);
                    window.setTimeout(dispatchResize, 320);
                });
            });
        };

        chrome.storage.sync.get({ [STORAGE_KEY]: false }, (r) => {
            applyCollapsed(!!r[STORAGE_KEY]);
        });

        btn.addEventListener('click', () => {
            const next = !document.body.classList.contains('sitrus-ex-sidebar-collapsed');
            applyCollapsed(next);
            chrome.storage.sync.set({ [STORAGE_KEY]: next });
        });
    }

    hideLoadingScreen() {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    checkExactTextMatch(element, expectedText) {
        const normalize = (str) => str.replace(/\s+/g, '').trim();
        return normalize(element.textContent) === normalize(expectedText);
    }
}

window.addEventListener('load', () => {
    new SitrusEx();
});
