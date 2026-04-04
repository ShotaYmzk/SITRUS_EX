/**
 * ライト / ダークテーマ（options / content 共通）
 * 既定: ライト（DESIGN.md）
 */
(function () {
    const STORAGE_KEY = 'sitrusExTheme';
    const DEFAULT_THEME = 'light';

    /** @param {unknown} t */
    function isValidTheme(t) {
        return t === 'light' || t === 'dark';
    }

    /** @param {string} theme */
    function applyToDocument(theme) {
        if (typeof document === 'undefined' || !document.documentElement) return;
        document.documentElement.dataset.sitrusTheme = theme;
    }

    globalThis.SitrusExThemePrefs = {
        STORAGE_KEY,
        DEFAULT_THEME,
        isValidTheme,
        applyToDocument,
    };
})();
