/**
 * SITRUS EX — service worker (MV3)
 * オプションを開く処理はここだけに置く（content script からはメッセージ経由）。
 */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === 'SITRUS_EX_OPEN_OPTIONS') {
        const open = chrome.runtime.openOptionsPage;
        if (typeof open !== 'function') {
            sendResponse({ ok: false, error: 'options_unavailable' });
            return true;
        }
        try {
            open(() => {
                const err = chrome.runtime.lastError;
                sendResponse({ ok: !err, error: err?.message });
            });
        } catch (e) {
            sendResponse({ ok: false, error: e instanceof Error ? e.message : String(e) });
        }
        return true;
    }
    return false;
});
