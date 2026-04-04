(() => {
    const P = globalThis.SitrusExThemePrefs;
    const { STORAGE_KEY, DEFINITIONS, DEFAULT_FONT_ID } = globalThis.SitrusExBrandFonts;
    const radiosRoot = document.getElementById('font-radios');
    const statusEl = document.getElementById('status');
    const themeToggle = document.getElementById('theme-toggle');

    function showSaved() {
        statusEl.textContent = '保存しました';
        clearTimeout(showSaved._t);
        showSaved._t = setTimeout(() => {
            statusEl.textContent = '';
        }, 2000);
    }

    function applyThemeUi(theme) {
        P.applyToDocument(theme);
        const isDark = theme === 'dark';
        if (themeToggle) {
            themeToggle.setAttribute('aria-checked', String(isDark));
            themeToggle.setAttribute('aria-label', isDark ? 'ダークモード（オン）' : 'ダークモード（オフ）');
        }
    }

    function initTheme() {
        chrome.storage.sync.get({ [P.STORAGE_KEY]: P.DEFAULT_THEME }, (items) => {
            let t = items[P.STORAGE_KEY];
            if (!P.isValidTheme(t)) t = P.DEFAULT_THEME;
            applyThemeUi(t);
        });

        chrome.storage.onChanged.addListener((changes, area) => {
            if (area !== 'sync' || !changes[P.STORAGE_KEY]) return;
            let t = changes[P.STORAGE_KEY].newValue;
            if (!P.isValidTheme(t)) t = P.DEFAULT_THEME;
            applyThemeUi(t);
        });

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                chrome.storage.sync.get({ [P.STORAGE_KEY]: P.DEFAULT_THEME }, (items) => {
                    let current = items[P.STORAGE_KEY];
                    if (!P.isValidTheme(current)) current = P.DEFAULT_THEME;
                    const next = current === 'dark' ? 'light' : 'dark';
                    chrome.storage.sync.set({ [P.STORAGE_KEY]: next }, () => {
                        applyThemeUi(next);
                        showSaved();
                    });
                });
            });
        }
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
            const span = document.createElement('span');
            span.textContent = def.label;
            label.appendChild(span);
            radiosRoot.appendChild(label);

            input.addEventListener('change', () => {
                if (!input.checked) return;
                chrome.storage.sync.set({ [STORAGE_KEY]: id }, () => {
                    showSaved();
                });
            });
        });
    }

    function newCustomId() {
        if (globalThis.crypto?.randomUUID) {
            return globalThis.crypto.randomUUID().replace(/-/g, '');
        }
        return `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
    }

    function resizeImageToDataUrl(file, maxSide = 1920, quality = 0.82) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const u = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(u);
                let { width, height } = img;
                if (width < 1 || height < 1) {
                    reject(new Error('bad image'));
                    return;
                }
                if (width > maxSide || height > maxSide) {
                    if (width >= height) {
                        height = Math.round((height * maxSide) / width);
                        width = maxSide;
                    } else {
                        width = Math.round((width * maxSide) / height);
                        height = maxSide;
                    }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('canvas'));
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = () => {
                URL.revokeObjectURL(u);
                reject(new Error('load'));
            };
            img.src = u;
        });
    }

    function initLoginBackgrounds() {
        const listEl = document.getElementById('login-bg-list');
        const fileInput = document.getElementById('login-bg-file');
        const presetSelect = document.getElementById('login-bg-add-preset');
        const resetBtn = document.getElementById('login-bg-reset');
        if (!listEl || !fileInput || !presetSelect || !resetBtn) return;

        const L = globalThis.SitrusExLoginBgPrefs;
        const getBundledUrl = (path) => chrome.runtime.getURL(path);

        let loginBgState = { entries: [], customMap: {} };

        function loadLoginBgState(cb) {
            chrome.storage.sync.get({ [L.SYNC_KEY]: null }, (s) => {
                chrome.storage.local.get(L.LOCAL_KEY, (loc) => {
                    const customMap = { ...(loc[L.LOCAL_KEY] || {}) };
                    const entries = L.normalizeOrder(s[L.SYNC_KEY], customMap);
                    cb({ entries, customMap });
                });
            });
        }

        function refreshPresetDropdown() {
            const used = new Set(
                loginBgState.entries.filter((e) => e.type === 'bundled').map((e) => e.path)
            );
            presetSelect.innerHTML = '<option value="">選択してください</option>';
            L.BUNDLED.forEach((path) => {
                if (used.has(path)) return;
                const opt = document.createElement('option');
                opt.value = path;
                opt.textContent = `キャンパス: ${L.bundledLabel(path)}`;
                presetSelect.appendChild(opt);
            });
        }

        function renderList() {
            listEl.innerHTML = '';
            loginBgState.entries.forEach((entry, index) => {
                const li = document.createElement('li');
                li.className = 'login-bg-item';

                const thumb = document.createElement('div');
                thumb.className = 'login-bg-item__thumb';
                const img = document.createElement('img');
                img.alt = '';
                if (entry.type === 'bundled') {
                    img.src = getBundledUrl(entry.path);
                } else {
                    img.src = loginBgState.customMap[entry.id] || '';
                }
                thumb.appendChild(img);

                const meta = document.createElement('div');
                meta.className = 'login-bg-item__meta';
                const title = document.createElement('span');
                title.className = 'login-bg-item__title';
                if (entry.type === 'bundled') {
                    title.textContent = `プリセット: ${L.bundledLabel(entry.path)}`;
                } else {
                    title.textContent = '自分の写真';
                }
                const sub = document.createElement('span');
                sub.className = 'login-bg-item__sub';
                sub.textContent = `${index + 1} 番目に表示`;
                meta.appendChild(title);
                meta.appendChild(sub);

                const actions = document.createElement('div');
                actions.className = 'login-bg-item__actions';

                const btnUp = document.createElement('button');
                btnUp.type = 'button';
                btnUp.className = 'login-bg-icon-btn';
                btnUp.title = '上へ';
                btnUp.setAttribute('aria-label', '上へ');
                btnUp.textContent = '↑';
                btnUp.disabled = index === 0;

                const btnDown = document.createElement('button');
                btnDown.type = 'button';
                btnDown.className = 'login-bg-icon-btn';
                btnDown.title = '下へ';
                btnDown.setAttribute('aria-label', '下へ');
                btnDown.textContent = '↓';
                btnDown.disabled = index === loginBgState.entries.length - 1;

                const btnDel = document.createElement('button');
                btnDel.type = 'button';
                btnDel.className = 'login-bg-icon-btn login-bg-icon-btn--danger';
                btnDel.title = '一覧から外す';
                btnDel.setAttribute('aria-label', '一覧から外す');
                btnDel.textContent = '×';

                btnUp.addEventListener('click', () => move(index, -1));
                btnDown.addEventListener('click', () => move(index, 1));
                btnDel.addEventListener('click', () => removeAt(index));

                actions.appendChild(btnUp);
                actions.appendChild(btnDown);
                actions.appendChild(btnDel);

                li.appendChild(thumb);
                li.appendChild(meta);
                li.appendChild(actions);
                listEl.appendChild(li);
            });
            refreshPresetDropdown();
        }

        function persistLoginBg(entries, customMap) {
            loginBgState.entries = entries;
            loginBgState.customMap = customMap;
            const strings = entries.map((e) => L.entryToOrderString(e));
            chrome.storage.sync.set({ [L.SYNC_KEY]: strings }, () => {
                chrome.storage.local.set({ [L.LOCAL_KEY]: customMap }, () => {
                    showSaved();
                    renderList();
                });
            });
        }

        function move(index, delta) {
            const j = index + delta;
            if (j < 0 || j >= loginBgState.entries.length) return;
            const arr = loginBgState.entries;
            const copy = arr.slice();
            [copy[index], copy[j]] = [copy[j], copy[index]];
            persistLoginBg(copy, loginBgState.customMap);
        }

        function removeAt(index) {
            const e = loginBgState.entries[index];
            if (!e) return;
            const nextEntries = loginBgState.entries.slice();
            nextEntries.splice(index, 1);
            const nextMap = { ...loginBgState.customMap };
            if (e.type === 'custom') {
                delete nextMap[e.id];
            }
            if (nextEntries.length === 0) {
                persistLoginBg(L.normalizeOrder(L.defaultOrderStrings(), {}), {});
                return;
            }
            persistLoginBg(nextEntries, nextMap);
        }

        loadLoginBgState((state) => {
            loginBgState = state;
            renderList();
        });

        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === 'sync' && changes[L.SYNC_KEY]) {
                loadLoginBgState((state) => {
                    loginBgState = state;
                    renderList();
                });
            }
            if (area === 'local' && changes[L.LOCAL_KEY]) {
                loadLoginBgState((state) => {
                    loginBgState = state;
                    renderList();
                });
            }
        });

        fileInput.addEventListener('change', () => {
            const file = fileInput.files && fileInput.files[0];
            fileInput.value = '';
            if (!file || !file.type.startsWith('image/')) return;
            resizeImageToDataUrl(file)
                .then((dataUrl) => {
                    const id = newCustomId();
                    const nextMap = { ...loginBgState.customMap, [id]: dataUrl };
                    const nextEntries = loginBgState.entries.concat([{ type: 'custom', id }]);
                    persistLoginBg(nextEntries, nextMap);
                })
                .catch(() => {
                    statusEl.textContent = '画像を読み込めませんでした';
                    clearTimeout(initLoginBackgrounds._errT);
                    initLoginBackgrounds._errT = setTimeout(() => {
                        statusEl.textContent = '';
                    }, 2500);
                });
        });

        presetSelect.addEventListener('change', () => {
            const path = presetSelect.value;
            presetSelect.value = '';
            if (!path || !L.BUNDLED.includes(path)) return;
            const nextEntries = loginBgState.entries.concat([{ type: 'bundled', path }]);
            persistLoginBg(nextEntries, loginBgState.customMap);
        });

        resetBtn.addEventListener('click', () => {
            persistLoginBg(L.normalizeOrder(L.defaultOrderStrings(), {}), {});
        });
    }

    initTheme();
    initLoginBackgrounds();

    chrome.storage.sync.get({ [STORAGE_KEY]: DEFAULT_FONT_ID }, (items) => {
        let id = items[STORAGE_KEY];
        if (!globalThis.SitrusExBrandFonts.isValidId(id)) id = DEFAULT_FONT_ID;
        buildRadios(id);
    });
})();
