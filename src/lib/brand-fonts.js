/**
 * ブランド表示用フォント（content / options 共通の定義）
 * MV3 の素のスクリプト向けに globalThis に載せる
 */
(function () {
    const STORAGE_KEY = 'sitrusExBrandFont';

    const DEFINITIONS = {
        'chakra-petch': {
            label: 'Chakra Petch（既定）',
            cssFamily: "'Chakra Petch', sans-serif",
            googleHref:
                'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&display=swap',
        },
        'pacifico': {
            label: 'Pacifico',
            cssFamily: "'Pacifico', cursive",
            googleHref: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap',
        },
        'exo': {
            label: 'Exo',
            cssFamily: "'Exo', sans-serif",
            googleHref:
                'https://fonts.googleapis.com/css2?family=Exo:wght@500;600;700&display=swap',
        },
    };

    const DEFAULT_FONT_ID = 'chakra-petch';

    globalThis.SitrusExBrandFonts = {
        STORAGE_KEY,
        DEFINITIONS,
        DEFAULT_FONT_ID,
        isValidId(id) {
            return typeof id === 'string' && Object.prototype.hasOwnProperty.call(DEFINITIONS, id);
        },
    };
})();
