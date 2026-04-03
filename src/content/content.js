/**
 * SITRUS EX - Content Script
 */

const LOGIN_BACKGROUND_IMAGES = [
    'assets/images/background_01.jpg',
    'assets/images/background_02.jpg',
    'assets/images/background_03.jpg',
    'assets/images/background_04.jpg',
    'assets/images/background_05.png',
    'assets/images/background_06.png',
    'assets/images/background_07.jpg',
    'assets/images/background_08.png',
    'assets/images/background_09.jpg',
    'assets/images/background_10.png',
];

/** ログイン画面の背景を切り替える間隔（ミリ秒） */
const LOGIN_BACKGROUND_INTERVAL_MS = 8000;

/** 背景スライドアニメーションの長さ（ミリ秒） */
const LOGIN_BACKGROUND_SLIDE_MS = 900;

class SitrusEx {
    constructor() {
        this.init();
    }

    init() {
        console.log('SITRUS EX: 起動しました。');

        this.applyBrandFontFromStorage();
        this.setupBrandFontListener();

        // ナビゲーションバーのブランドテキスト修正
        this.enhanceNavbarBrand();

        // 現在のページを判定して処理を分岐
        if (document.getElementById('loginButton')) {
            console.log('ログイン画面のUIを改善します。');
            this.applyUiImprovements();
            this.bindEvents();
        } else if (document.querySelector('.sidebar-sticky')) {
            console.log('ダッシュボード画面のUIを改善します。');
            this.initDashboard();
        }
    }

    /* =========================================================
       ブランド用フォント（オプション画面と同期）
       ========================================================= */
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

    /* =========================================================
       ナビゲーションバーのブランドテキスト改善
       ========================================================= */
    enhanceNavbarBrand() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        // SITRUSシステムのテキストノードを検索
        let targetNode = null;
        for (let node of navbar.childNodes) {
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

    /* =========================================================
       ログイン画面用の処理
       ========================================================= */
    applyUiImprovements() {
        document.body.classList.add('sitrus-ex-active');
        this.startLoginBackgroundRotation();
        this.hideOriginalElementsSafely();
        this.injectNewUIElements();
        this.wrapLiquidGlassLoginButton();
    }

    /**
     * 認証ボタンを liquid glass 用マークアップ（wrap + 影レイヤー + span）で包む
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

    /**
     * ログイン画面の背景画像を一定間隔で自動切り替え（横スライド）
     */
    startLoginBackgroundRotation() {
        const urls = LOGIN_BACKGROUND_IMAGES.map((path) => chrome.runtime.getURL(path));
        if (urls.length === 0) return;

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
            el.style.backgroundImage = `url("${url}")`;
        };

        const prefersReduced =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let index = 0;

        if (urls.length === 1 || prefersReduced) {
            applyBg(layerA, urls[0]);
            layerB.remove();
            if (urls.length > 1) {
                setInterval(() => {
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

        setInterval(showNext, LOGIN_BACKGROUND_INTERVAL_MS);
    }

    hideOriginalElementsSafely() {
        // システム名の完全一致確認
        const systemNameEl = document.getElementById('system_name');
        if (systemNameEl && this.checkExactTextMatch(systemNameEl, 'SITRUSシステム')) {
            systemNameEl.style.display = 'none';
        }

        // 説明文の完全一致確認
        const loginMsgEl = document.getElementById('login_msg');
        const expectedMsg = '※学生の場合は「入力なし」で認証開始してください。教職員の場合は「参照する学生のユーザ名」を入力してください。';
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

        // --- バージョン表記 ---
        const versionText = document.createElement('div');
        versionText.id = 'sc-version-text';
        versionText.textContent = 'SITRUS EX - v1.0.0';
        document.body.appendChild(versionText);

        // --- 教職員向けトグルボタンとフォームの再配置 ---
        const loginBox = document.querySelector('.login-box');
        const loginButton = document.getElementById('loginButton');
        const formGroup = document.querySelector('.form-group');

        if (loginBox && loginButton && formGroup) {
            const toggleWrapper = document.createElement('div');
            toggleWrapper.id = 'sc-toggle-wrapper';

            const toggleText = document.createElement('span');
            toggleText.id = 'sc-faculty-toggle';
            toggleText.innerHTML = '<span class="sc-toggle-arrow">&gt;</span> 学籍番号の入力（教職員向け）';

            toggleWrapper.appendChild(toggleText);
            toggleWrapper.appendChild(formGroup);

            // ログインボタンの後に挿入
            loginButton.parentNode.insertBefore(toggleWrapper, loginButton.nextSibling);

            // 初期状態は非表示
            formGroup.classList.add('sc-form-hidden');
        }
    }

    bindEvents() {
        const toggleButton = document.getElementById('sc-faculty-toggle');
        const formGroup = document.querySelector('.form-group');

        if (toggleButton && formGroup) {
            toggleButton.addEventListener('click', () => {
                formGroup.classList.toggle('sc-form-hidden');
                toggleButton.classList.toggle('is-open');
            });
        }
    }

    /* =========================================================
       ダッシュボード（サイドバー）用の処理
       ========================================================= */
    initDashboard() {
        document.body.classList.add('sitrus-ex-dashboard');
        document.documentElement.classList.add('sitrus-ex-dashboard-html');
        this.hideLoadingScreen();
        this.setupSidebarToggle();
    }

    /**
     * 左サイドバーの格納・展開（状態は chrome.storage.sync に保存）
     */
    setupSidebarToggle() {
        const sidebar = document.querySelector('.sidebar-sticky');
        if (!sidebar || document.getElementById('sc-sidebar-toggle')) return;

        const sidebarCol = sidebar.closest('[class*="col-"]');
        const row = sidebarCol?.closest('.row');
        if (!sidebarCol || !row) return;

        sidebarCol.dataset.scSidebarCol = '1';

        const siblings = [...row.children];
        const mainCol =
            siblings.find(
                (el) =>
                    el !== sidebarCol &&
                    (el.querySelector('.container') ||
                        el.querySelector('[class*="_navbar_fixed_top_slide"]') ||
                        el.querySelector('main'))
            ) || siblings.find((el) => el !== sidebarCol);

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

    /* =========================================================
       ローディング画面の制御
       ========================================================= */
    hideLoadingScreen() {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    /* =========================================================
       ユーティリティ
       ========================================================= */
    /**
     * 要素のテキストが期待する文字列と一致するか判定
     * @param {HTMLElement} element 
     * @param {string} expectedText 
     * @returns {boolean}
     */
    checkExactTextMatch(element, expectedText) {
        const normalize = (str) => str.replace(/\s+/g, '').trim();
        return normalize(element.textContent) === normalize(expectedText);
    }
}

window.addEventListener('load', () => {
    new SitrusEx();
});