(() => {
    const { STORAGE_KEY, DEFINITIONS, DEFAULT_FONT_ID } = globalThis.SitrusExBrandFonts;
    const radiosRoot = document.getElementById('font-radios');
    const statusEl = document.getElementById('status');

    function showSaved() {
        statusEl.textContent = '保存しました';
        clearTimeout(showSaved._t);
        showSaved._t = setTimeout(() => {
            statusEl.textContent = '';
        }, 2000);
    }

    function buildRadios(currentId) {
        Object.keys(DEFINITIONS).forEach((id) => {
            const def = DEFINITIONS[id];
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'brandFont';
            input.value = id;
            input.checked = id === currentId;
            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${def.label}`));
            radiosRoot.appendChild(label);

            input.addEventListener('change', () => {
                if (!input.checked) return;
                chrome.storage.sync.set({ [STORAGE_KEY]: id }, () => {
                    showSaved();
                });
            });
        });
    }

    chrome.storage.sync.get({ [STORAGE_KEY]: DEFAULT_FONT_ID }, (items) => {
        let id = items[STORAGE_KEY];
        if (!globalThis.SitrusExBrandFonts.isValidId(id)) id = DEFAULT_FONT_ID;
        buildRadios(id);
    });
})();
