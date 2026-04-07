/**
 * SITRUS EX — content script (vanilla JS, isolated world)
 */
(function () {
  'use strict';

  var BG_IMAGES = [
    'assets/images/background_01.jpg',
    'assets/images/background_02.jpg',
    'assets/images/background_03.jpg',
    'assets/images/background_04.jpg',
    'assets/images/background_05.png',
    'assets/images/background_06.png',
    'assets/images/background_07.jpg',
    'assets/images/background_08.png',
    'assets/images/background_09.jpg',
    'assets/images/background_10.png'
  ];

  var SLIDE_INTERVAL = 5000;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var canGetURL = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL;

    /* ---- Version badge ---- */
    var version = '2.0.0';
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest) {
      version = chrome.runtime.getManifest().version;
    }
    var badge = document.createElement('div');
    badge.id = 'sitrus-ex-version';
    badge.textContent = 'SITRUS EX v' + version;
    document.body.appendChild(badge);

    /* ---- Background slideshow ---- */
    if (canGetURL) {
      var slideshow = document.createElement('div');
      slideshow.id = 'sitrus-bg-slideshow';

      var imgEls = [];
      BG_IMAGES.forEach(function (path, i) {
        var img = document.createElement('img');
        img.src = chrome.runtime.getURL(path);
        img.alt = '';
        img.draggable = false;
        if (i === 0) img.className = 'active';
        slideshow.appendChild(img);
        imgEls.push(img);
      });

      document.body.insertBefore(slideshow, document.body.firstChild);

      /* Ensure all direct body children (except slideshow) sit above it */
      Array.prototype.forEach.call(document.body.children, function (child) {
        if (child.id === 'sitrus-bg-slideshow' || child.id === 'sitrus-ex-version') return;
        var pos = window.getComputedStyle(child).position;
        if (pos === 'static') {
          child.style.position = 'relative';
        }
        if (!child.style.zIndex || parseInt(child.style.zIndex, 10) < 1) {
          child.style.zIndex = '2';
        }
      });

      var current = 0;
      setInterval(function () {
        imgEls[current].classList.remove('active');
        current = (current + 1) % imgEls.length;
        imgEls[current].classList.add('active');
      }, SLIDE_INTERVAL);
    }

    /* ---- Rename title ---- */
    var title = document.getElementById('system_name');
    if (title) {
      title.textContent = 'SITRUS';
    }

    /* ---- Hide info message ---- */
    var loginMsg = document.getElementById('login_msg');
    if (loginMsg) loginMsg.style.display = 'none';

    /* ---- References ---- */
    var user     = document.getElementById('username');
    var label    = document.querySelector('label[for="username"]');
    var loginBox = document.querySelector('.login-box');
    if (!loginBox || !user || !label) return;

    /* ---- Rename label ---- */
    label.textContent = '学生のユーザ名を入力';

    /* ---- Wrap button in .button-wrap + .button-shadow ---- */
    var btn = document.getElementById('loginButton');
    if (btn) {
      btn.classList.remove('btn', 'btn-success', 'btn-block', 'btn-lg');
      btn.removeAttribute('style');

      var wrap = document.createElement('div');
      wrap.className = 'button-wrap';

      var shadow = document.createElement('div');
      shadow.className = 'button-shadow';

      btn.parentNode.insertBefore(wrap, btn);
      wrap.appendChild(btn);
      wrap.appendChild(shadow);
    }

    /* ---- Move form-group to bottom ---- */
    var formGroup = user.closest('.form-group');
    if (formGroup) loginBox.appendChild(formGroup);

    /* ---- Hide input + label ---- */
    user.style.display  = 'none';
    label.style.display = 'none';

    /* ---- Create toggle link ---- */
    var toggle = document.createElement('a');
    toggle.id = 'staff-toggle';
    toggle.href = '#';
    toggle.textContent = '> 学籍番号の入力（教職員向け）';
    toggle.setAttribute('aria-expanded', 'false');
    loginBox.appendChild(toggle);

    if (formGroup) loginBox.appendChild(formGroup);

    /* ---- Toggle animation ---- */
    var open      = false;
    var animating = false;

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      if (animating) return;
      animating = true;

      var els = [label, user];

      if (open) {
        els.forEach(function (el) {
          el.style.overflow   = 'hidden';
          el.style.maxHeight  = el.scrollHeight + 'px';
          el.style.transition = 'max-height 0.25s ease, opacity 0.2s ease';
          requestAnimationFrame(function () {
            el.style.maxHeight = '0px';
            el.style.opacity   = '0';
          });
        });
        setTimeout(function () {
          els.forEach(function (el) {
            el.style.display    = 'none';
            el.style.maxHeight  = '';
            el.style.overflow   = '';
            el.style.transition = '';
            el.style.opacity    = '';
          });
          open = false;
          animating = false;
          toggle.setAttribute('aria-expanded', 'false');
          toggle.textContent = '> 学籍番号の入力（教職員向け）';
        }, 270);

      } else {
        els.forEach(function (el) {
          el.style.display    = 'block';
          el.style.overflow   = 'hidden';
          el.style.opacity    = '0';
          el.style.maxHeight  = '0px';
          el.style.transition = 'max-height 0.3s ease, opacity 0.25s ease';
          var h = el.scrollHeight;
          requestAnimationFrame(function () {
            el.style.maxHeight = h + 'px';
            el.style.opacity   = '1';
          });
        });
        setTimeout(function () {
          els.forEach(function (el) {
            el.style.maxHeight  = '';
            el.style.overflow   = '';
            el.style.transition = '';
          });
          user.focus();
          open = true;
          animating = false;
          toggle.setAttribute('aria-expanded', 'true');
          toggle.textContent = '> 学籍番号の入力を閉じる';
        }, 320);
      }
    });
  });
})();
