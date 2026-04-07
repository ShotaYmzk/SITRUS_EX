/**
 * Runs in the page context (not the extension isolated world).
 * Reads ag-Grid API from window.gridOptions and notifies the content script via postMessage.
 */
(function () {
  'use strict';

  var SOURCE = 'sitrus-ex-bridge';
  var lastApi = null;
  var listenersBound = false;

  function post(type, detail) {
    try {
      window.postMessage({ source: SOURCE, type: type, detail: detail }, '*');
    } catch (e) {
      /* ignore */
    }
  }

  function getColumnsMeta(api) {
    var cols = [];
    try {
      var displayed = [];
      try {
        if (api.getAllDisplayedColumns) displayed = api.getAllDisplayedColumns();
        else if (api.getColumns) displayed = api.getColumns();
      } catch (e0) {
        displayed = [];
      }
      displayed.forEach(function (col) {
        var def = col.getColDef && col.getColDef();
        if (!def || !def.field) return;
        var fid = typeof def.field === 'string' ? def.field : col.getColId();
        cols.push({
          colId: col.getColId(),
          field: fid,
          headerName: def.headerName || def.field || fid
        });
      });
    } catch (e) {
      /* fallback: no columns */
    }
    return cols;
  }

  function emitRows(api) {
    var columns = getColumnsMeta(api);
    var rows = [];
    try {
      api.forEachNode(function (node) {
        if (!node || !node.data) return;
        var sel = false;
        try {
          sel = node.isSelected ? node.isSelected() : false;
        } catch (e2) {
          sel = false;
        }
        rows.push({ id: node.id, data: node.data, selected: sel });
      });
    } catch (e) {
      /* ignore */
    }
    post('rows', { columns: columns, rows: rows });
  }

  function bindApi(api) {
    if (!api || lastApi === api) return;
    lastApi = api;
    listenersBound = false;

    function onChange() {
      emitRows(api);
    }

    try {
      if (api.addEventListener) {
        api.addEventListener('modelUpdated', onChange);
        api.addEventListener('rowDataUpdated', onChange);
        api.addEventListener('filterChanged', onChange);
        api.addEventListener('sortChanged', onChange);
        api.addEventListener('selectionChanged', onChange);
      }
      listenersBound = true;
    } catch (e) {
      /* older API */
    }

    emitRows(api);
  }

  function poll() {
    try {
      var g = window.gridOptions;
      if (!g || !g.api) return;
      bindApi(g.api);
    } catch (e) {
      /* page not ready */
    }
  }

  setInterval(poll, 250);

  window.addEventListener('message', function (ev) {
    if (ev.source !== window || !ev.data || ev.data.source !== 'sitrus-ex-content') return;
    var api = window.gridOptions && window.gridOptions.api;
    if (!api) return;

    if (ev.data.type === 'setSelected') {
      var nodeId = ev.data.nodeId;
      var selected = !!ev.data.selected;
      try {
        var node = api.getRowNode(nodeId);
        if (node) node.setSelected(selected);
      } catch (e) {
        /* ignore */
      }
    } else if (ev.data.type === 'deselectAll') {
      try {
        api.deselectAll();
      } catch (e) {
        /* ignore */
      }
    } else if (ev.data.type === 'selectAllFiltered') {
      /* Not used — selection handled per-row from content script */
    } else if (ev.data.type === 'setQuickFilter') {
      try {
        if (api.setGridOption) {
          api.setGridOption('quickFilterText', ev.data.text || '');
        } else if (api.setQuickFilter) {
          api.setQuickFilter(ev.data.text || '');
        }
      } catch (e) {
        /* ignore */
      }
    } else if (ev.data.type === 'clearQuickFilter') {
      try {
        if (api.setGridOption) {
          api.setGridOption('quickFilterText', '');
        } else if (api.setQuickFilter) {
          api.setQuickFilter('');
        }
      } catch (e) {
        /* ignore */
      }
    }
  });
})();
