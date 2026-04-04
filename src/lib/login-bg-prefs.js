/**
 * ログイン画面の背景スライド — プリセット + カスタム画像の順序
 * （options / content 共通）
 */
(function () {
    const BUNDLED = [
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

    const SYNC_KEY = 'sitrusExLoginBgOrder';
    const LOCAL_KEY = 'sitrusExLoginBgCustom';

    /** @returns {string[]} */
    function defaultOrderStrings() {
        return BUNDLED.map((p) => `bundled:${p}`);
    }

    /**
     * @param {string} s
     * @returns {{ type: 'bundled', path: string } | { type: 'custom', id: string } | null}
     */
    function parseOrderString(s) {
        if (typeof s !== 'string') return null;
        const i = s.indexOf(':');
        if (i < 0) return null;
        const kind = s.slice(0, i);
        const rest = s.slice(i + 1);
        if (!rest) return null;
        if (kind === 'bundled' && BUNDLED.includes(rest)) return { type: 'bundled', path: rest };
        if (kind === 'custom' && /^[a-zA-Z0-9_-]{8,64}$/.test(rest)) return { type: 'custom', id: rest };
        return null;
    }

    /**
     * @param {unknown} orderRaw sync から読んだ配列 or null
     * @param {Record<string, string>} customMap id -> data URL
     * @returns {Array<{ type: 'bundled', path: string } | { type: 'custom', id: string }>}
     */
    function normalizeOrder(orderRaw, customMap) {
        const custom = customMap && typeof customMap === 'object' ? customMap : {};
        const list = Array.isArray(orderRaw) && orderRaw.length > 0 ? orderRaw : defaultOrderStrings();
        const out = [];
        const seen = new Set();
        for (const item of list) {
            const e = parseOrderString(typeof item === 'string' ? item : '');
            if (!e) continue;
            if (e.type === 'bundled') {
                const key = `b:${e.path}`;
                if (seen.has(key)) continue;
                seen.add(key);
                out.push(e);
            } else {
                if (!custom[e.id]) continue;
                const key = `c:${e.id}`;
                if (seen.has(key)) continue;
                seen.add(key);
                out.push(e);
            }
        }
        return out;
    }

    /**
     * @param {string} path
     * @returns {string}
     */
    function bundledLabel(path) {
        const base = path.replace(/^.*\//, '');
        return base.replace(/\.[^.]+$/, '').replace(/_/g, ' ');
    }

    /**
     * @param {{ type: 'bundled', path: string } | { type: 'custom', id: string }} e
     * @returns {string}
     */
    function entryToOrderString(e) {
        if (e.type === 'bundled') return `bundled:${e.path}`;
        return `custom:${e.id}`;
    }

    globalThis.SitrusExLoginBgPrefs = {
        BUNDLED,
        SYNC_KEY,
        LOCAL_KEY,
        defaultOrderStrings,
        parseOrderString,
        normalizeOrder,
        bundledLabel,
        entryToOrderString,
    };
})();
