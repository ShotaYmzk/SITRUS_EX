/**
 * SITRUS EX — 時間割一覧: ag-Grid を独自テーブルに置き換え（上部フィルター付き）
 */
(function () {
  'use strict';

  var MSG_SOURCE = 'sitrus-ex-content';
  var BRIDGE_SOURCE = 'sitrus-ex-bridge';

  var PRIORITY_FIELDS = [
    'yobi',
    'jigen_cd',
    'kamoku_name',
    'kamoku_name_eng',
    'jik_comment',
    'main_kyoin_mail',
    'chusen_kbn_name',
    'kaiko_jiki_name',
    'kaiko_jiki_name_eng',
    'keiretu_name',
    'keiretu_grp_name',
    'tani_kbn_name',
    'tani_kbn_name_eng',
    'orig_bu_name',
    'orig_bu_name_eng',
    'kamoku_gakka_name',
    'kamoku_course_name',
    'kamoku_cd',
    'keitai_kbn_name',
    'kyoin_name',
    'kyositu_name',
    'kyositu_name_eng',
    'jik_cd',
    'kosya_name',
    'tani_su',
    'teiin',
    'syllabus'
  ];

  var FILTER_SELECT_FIELDS = ['yobi', 'jigen_cd', 'tani_kbn_name', 'tani_kbn_name_eng', 'kaiko_jiki_name', 'kaiko_jiki_name_eng', 'orig_bu_name', 'orig_bu_name_eng'];

  function escapeHtml(s) {
    if (s == null) return '';
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function escapeAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function formatCell(field, value) {
    if (value == null || value === undefined) return '';
    if (field === 'syllabus' && typeof value === 'string' && value.indexOf('{') !== -1) {
      try {
        var parsed = JSON.parse(value);
        var item = parsed[0];
        var url = item && (item.JP != null ? item.JP : item.EN);
        if (url) {
          return '<a class="sitrus-ex-tb-link" href="' + escapeAttr(url) + '" target="_blank" rel="noopener noreferrer">詳細</a>';
        }
      } catch (e) {
        /* fall through */
      }
    }
    if (typeof value === 'object') return escapeHtml(JSON.stringify(value));
    return escapeHtml(String(value));
  }

  function sortColumns(cols) {
    var rank = {};
    PRIORITY_FIELDS.forEach(function (f, i) {
      rank[f] = i;
    });
    var withRank = cols.map(function (c) {
      var r = rank[c.field];
      return { c: c, r: r === undefined ? 1000 + cols.indexOf(c) : r };
    });
    withRank.sort(function (a, b) {
      return a.r - b.r;
    });
    return withRank.map(function (x) {
      return x.c;
    });
  }

  /** 選択チェックは常に「曜日・時限・科目名」の左列になるよう、先頭3列を固定する */
  function buildOrderedColumns(cols) {
    if (!cols || !cols.length) return [];
    var byField = {};
    cols.forEach(function (c) {
      byField[c.field] = c;
    });
    var lead = [];
    if (byField.yobi) lead.push(byField.yobi);
    if (byField.jigen_cd) lead.push(byField.jigen_cd);
    var kamokuCol = byField.kamoku_name || byField.kamoku_name_eng;
    if (kamokuCol) lead.push(kamokuCol);

    var used = {};
    lead.forEach(function (c) {
      used[c.field] = true;
    });
    var rest = cols.filter(function (c) {
      return !used[c.field];
    });
    rest = sortColumns(rest);
    return lead.concat(rest);
  }

  function injectBridge() {
    var url = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL
      ? chrome.runtime.getURL('src/sitrus-page-bridge.js')
      : null;
    if (!url) return;
    var s = document.createElement('script');
    s.src = url;
    s.onload = function () {
      s.remove();
    };
    (document.head || document.documentElement).appendChild(s);
  }

  function postToBridge(type, payload) {
    window.postMessage(
      Object.assign({ source: MSG_SOURCE, type: type }, payload || {}),
      '*'
    );
  }

  function rowMatchesSearch(data, q) {
    if (!q) return true;
    var lower = q.toLowerCase();
    for (var k in data) {
      if (!Object.prototype.hasOwnProperty.call(data, k)) continue;
      var v = data[k];
      if (v == null) continue;
      if (String(v).toLowerCase().indexOf(lower) !== -1) return true;
    }
    return false;
  }

  function rowMatchesSelects(data, selects) {
    for (var field in selects) {
      if (!Object.prototype.hasOwnProperty.call(selects, field)) continue;
      var want = selects[field];
      if (!want) continue;
      var got = data[field];
      if (got == null) return false;
      if (String(got) !== String(want)) return false;
    }
    return true;
  }

  function uniqueSorted(values) {
    var u = {};
    values.forEach(function (v) {
      if (v != null && v !== '') u[String(v)] = true;
    });
    return Object.keys(u).sort();
  }

  function tryInit() {
    if (window.location.pathname.indexOf('JikItiran') === -1) return;
    var host = document.querySelector('#itiran_list');
    if (!host) return;
    if (host.getAttribute('data-sitrus-ex-timetable') === '1') return;
    host.setAttribute('data-sitrus-ex-timetable', '1');

    document.body.classList.add('sitrus-ex-timetable-mode');
    injectBridge();

    var root = document.createElement('div');
    root.id = 'sitrus-ex-timetable-root';
    root.className = 'sitrus-ex-timetable-root';
    host.parentNode.insertBefore(root, host);

    var toolbar = document.createElement('div');
    toolbar.className = 'sitrus-ex-tb-toolbar';

    var searchWrap = document.createElement('div');
    searchWrap.className = 'sitrus-ex-tb-search-wrap';
    var searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.className = 'sitrus-ex-tb-search';
    searchInput.placeholder = 'キーワード検索（全列）';
    searchInput.setAttribute('autocomplete', 'off');
    searchWrap.appendChild(searchInput);

    var selectsWrap = document.createElement('div');
    selectsWrap.className = 'sitrus-ex-tb-selects';

    var actions = document.createElement('div');
    actions.className = 'sitrus-ex-tb-actions';
    var btnReset = document.createElement('button');
    btnReset.type = 'button';
    btnReset.className = 'sitrus-ex-tb-btn';
    btnReset.textContent = '条件リセット';
    var hint = document.createElement('span');
    hint.className = 'sitrus-ex-tb-hint';
    hint.textContent = '公式の列サイドバーは非表示です。ここで絞り込みできます。';
    actions.appendChild(btnReset);
    actions.appendChild(hint);

    toolbar.appendChild(searchWrap);
    toolbar.appendChild(selectsWrap);
    toolbar.appendChild(actions);

    var tableWrap = document.createElement('div');
    tableWrap.className = 'sitrus-ex-tb-table-wrap';

    var foot = document.createElement('div');
    foot.className = 'sitrus-ex-tb-foot';

    root.appendChild(toolbar);
    root.appendChild(tableWrap);
    root.appendChild(foot);

    var state = {
      columns: [],
      rows: [],
      search: '',
      selects: {},
      selectEls: {},
      columnsKey: ''
    };

    function buildSelects() {
      selectsWrap.innerHTML = '';
      state.selectEls = {};
      FILTER_SELECT_FIELDS.forEach(function (field) {
        var has = state.columns.some(function (c) {
          return c.field === field;
        });
        if (!has) return;
        var values = uniqueSorted(
          state.rows.map(function (r) {
            return r.data[field];
          })
        );
        if (values.length <= 1 && values.length > 0) return;

        var lab = document.createElement('label');
        lab.className = 'sitrus-ex-tb-field';
        var col = state.columns.filter(function (c) {
          return c.field === field;
        })[0];
        var span = document.createElement('span');
        span.className = 'sitrus-ex-tb-field-label';
        span.textContent = col ? col.headerName : field;
        var sel = document.createElement('select');
        sel.className = 'sitrus-ex-tb-select';
        sel.setAttribute('data-field', field);
        var opt0 = document.createElement('option');
        opt0.value = '';
        opt0.textContent = '（指定なし）';
        sel.appendChild(opt0);
        values.forEach(function (v) {
          var o = document.createElement('option');
          o.value = v;
          o.textContent = v;
          sel.appendChild(o);
        });
        if (state.selects[field]) sel.value = state.selects[field];
        lab.appendChild(span);
        lab.appendChild(sel);
        selectsWrap.appendChild(lab);
        state.selectEls[field] = sel;
        sel.addEventListener('change', function () {
          state.selects[field] = sel.value || undefined;
          if (!state.selects[field]) delete state.selects[field];
          render();
        });
      });
    }

    function filteredRows() {
      var q = state.search.trim();
      return state.rows.filter(function (r) {
        return rowMatchesSearch(r.data, q) && rowMatchesSelects(r.data, state.selects);
      });
    }

    function render() {
      var cols = buildOrderedColumns(state.columns);
      var list = filteredRows();
      foot.textContent = '表示 ' + list.length + ' / 全 ' + state.rows.length + ' 件';

      var table = document.createElement('table');
      table.className = 'sitrus-ex-tb-table';

      var thead = document.createElement('thead');
      var hr = document.createElement('tr');

      var thCheck = document.createElement('th');
      thCheck.className = 'sitrus-ex-tb-th-check sitrus-ex-tb-sticky-check';
      var inpAll = document.createElement('input');
      inpAll.type = 'checkbox';
      inpAll.title = '表示中の行をすべて選択/解除';
      inpAll.addEventListener('change', function () {
        var on = inpAll.checked;
        list.forEach(function (r) {
          postToBridge('setSelected', { nodeId: r.id, selected: on });
        });
      });
      thCheck.appendChild(inpAll);
      hr.appendChild(thCheck);

      cols.forEach(function (c, idx) {
        var th = document.createElement('th');
        th.textContent = c.headerName;
        if (idx < 3) th.classList.add('sitrus-ex-tb-sticky', 'sitrus-ex-tb-sticky-c' + idx);
        hr.appendChild(th);
      });
      thead.appendChild(hr);

      var tbody = document.createElement('tbody');
      list.forEach(function (r, ri) {
        var tr = document.createElement('tr');
        if (ri % 2 === 1) tr.classList.add('sitrus-ex-tb-odd');

        var tdCheck = document.createElement('td');
        tdCheck.className = 'sitrus-ex-tb-td-check sitrus-ex-tb-sticky-check';
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = !!r.selected;
        cb.addEventListener('change', function () {
          postToBridge('setSelected', { nodeId: r.id, selected: cb.checked });
        });
        tdCheck.appendChild(cb);
        tr.appendChild(tdCheck);

        cols.forEach(function (c, idx) {
          var td = document.createElement('td');
          td.innerHTML = formatCell(c.field, r.data[c.field]);
          if (idx < 3) td.classList.add('sitrus-ex-tb-sticky', 'sitrus-ex-tb-sticky-c' + idx);
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      table.appendChild(thead);
      table.appendChild(tbody);
      tableWrap.innerHTML = '';
      tableWrap.appendChild(table);
    }

    searchInput.addEventListener('input', function () {
      state.search = searchInput.value;
      render();
    });

    btnReset.addEventListener('click', function () {
      state.search = '';
      state.selects = {};
      searchInput.value = '';
      Object.keys(state.selectEls).forEach(function (f) {
        var el = state.selectEls[f];
        if (el) el.value = '';
      });
      render();
    });

    window.addEventListener('message', function (ev) {
      if (ev.source !== window || !ev.data || ev.data.source !== BRIDGE_SOURCE) return;
      if (ev.data.type === 'rows') {
        var d = ev.data.detail;
        if (!d || !d.rows) return;
        state.rows = d.rows;
        var ck = (d.columns || [])
          .map(function (c) {
            return c.field;
          })
          .join(',');
        if (ck !== state.columnsKey) {
          state.columnsKey = ck;
          state.columns = d.columns || [];
          buildSelects();
        }
        render();
      }
    });

  }

  function init() {
    tryInit();
    if (window.location.pathname.indexOf('JikItiran') === -1) return;
    if (document.querySelector('#itiran_list')) return;
    var obs = new MutationObserver(function () {
      if (document.querySelector('#itiran_list')) {
        obs.disconnect();
        tryInit();
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
