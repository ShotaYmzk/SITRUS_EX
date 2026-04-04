/**
 * ブランド表示用フォント（content / options 共通の定義）
 * MV3 の素のスクリプト向けに globalThis に載せる
 * 既定は DESIGN.md の Geist
 */
(function () {
    const STORAGE_KEY = 'sitrusExBrandFont';

    const GF = 'https://fonts.googleapis.com/css2';

    const DEFINITIONS = {
        geist: {
            label: 'Geist（既定・DESIGN）',
            cssFamily: "'Geist', 'Helvetica Neue', sans-serif",
            googleHref: `${GF}?family=Geist:wght@400;500;600;700&display=swap`,
        },
        'chakra-petch': {
            label: 'Chakra Petch',
            cssFamily: "'Chakra Petch', sans-serif",
            googleHref: `${GF}?family=Chakra+Petch:wght@500;600;700&display=swap`,
        },
        pacifico: {
            label: 'Pacifico',
            cssFamily: "'Pacifico', cursive",
            googleHref: `${GF}?family=Pacifico&display=swap`,
        },
        exo: {
            label: 'Exo',
            cssFamily: "'Exo', sans-serif",
            googleHref: `${GF}?family=Exo:wght@500;600;700&display=swap`,
        },
    };

    const DEFAULT_FONT_ID = 'geist';

    globalThis.SitrusExBrandFonts = {
        STORAGE_KEY,
        DEFINITIONS,
        DEFAULT_FONT_ID,
        isValidId(id) {
            return typeof id === 'string' && Object.prototype.hasOwnProperty.call(DEFINITIONS, id);
        },
    };
})();
