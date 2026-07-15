/*!
 * MessengerWidget v1.0
 * Floating messenger widget with QR codes, Telegram, Max support
 * Vanilla JS — no dependencies (QR via API)
 * 
 * Usage:
 *   <script src="messenger-widget.js"></script>
 *   <script>
 *     MessengerWidget.init({
 *       telegram: { username: 'youruser', link: 'https://t.me/youruser' },
 *       max: { username: 'youruser', link: 'https://max.ru/youruser' }
 *     });
 *   </script>
 */

(function (global) {
    'use strict';

    /* ================================================================
     * Capture widget script path for CSS auto-loading
     * ================================================================ */

    var WIDGET_SCRIPT_SRC = (function () {
        var cs = document.currentScript;
        return cs ? cs.src : '';
    })();

    /* ================================================================
     * SVG Icons (inline, no external files)
     * ================================================================ */

    var ICONS = {
        chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><path d="M8 9h8"/><path d="M8 13h6"/></svg>',
        close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
        telegram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.96 6.502-1.358 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.46-1.901-.903-1.056-.692-1.653-1.123-2.678-1.798-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.01-1.252-.242-1.865-.442-.751-.244-1.348-.373-1.296-.788.027-.216.325-.437.895-.663 3.498-1.524 5.83-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.476-1.635.1-.002.32.023.464.139.12.097.154.228.17.32.015.092.034.302.018.466z"/></svg>',
        max: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
        whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
        viber: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.798 16.385c-.223.513-.842.866-1.35.723-1.188-.335-2.502-1.143-3.418-2.13-.757-.816-1.34-1.74-1.723-2.73-.186-.48-.314-.982-.31-1.49.004-.382.175-.723.446-.947.212-.175.503-.228.695-.142.255.115.487.325.55.595.086.37.152.746.26 1.113.072.247.077.512-.028.747-.078.175-.247.5-.317.67-.056.132-.04.18.032.27.292.375.607.73.96 1.038.567.493 1.203.892 1.93 1.137.227.076.5.033.668-.134.226-.228.397-.51.57-.785.102-.163.22-.275.418-.193.295.124.548.328.778.542.227.21.43.44.57.71.09.175.072.363-.066.505-.215.222-.41.466-.65.657-.16.127-.37.193-.582.18-.32-.02-.635-.088-.94-.19H16.6c-.774-.253-1.47-.667-2.09-1.2-.265-.228-.51-.477-.728-.75-.3-.375-.55-.787-.8-1.2-.11-.184-.05-.3.09-.42.233-.19.45-.398.648-.623.23-.262.18-.58-.08-.807-.263-.23-.534-.45-.818-.655-.213-.153-.43-.153-.66-.022-.355.2-.687.44-.934.76-.21.27-.308.58-.305.92.004.513.114 1.013.27 1.498.36 1.13.96 2.13 1.75 2.988 1.021 1.11 2.252 1.908 3.652 2.405.48.17.975.22 1.478.114.28-.058.516-.22.64-.477z"/></svg>'
    };

    /* ================================================================
     * Default configuration
     * ================================================================ */

    var DEFAULTS = {
        /* --- Messenger links --- */
        telegram: {
            username: 'akatran1',
            link: 'https://t.me/akatran1'
        },
        max: {
            username: 'Андрей',
            link: 'https://max.ru/u/f9LHodD0cOKSzHGEQIX3HAhXGwgQALr4CxadoVlHiQKQ9ug17KGfP-cbEMU'
        },

        /* --- Texts (Russian by default, easily customizable) --- */
        texts: {
            title: 'Мы на связи в мессенджерах',
            subtitle: 'Если остались вопросы — пишите в нашу поддержку. Всё подскажем-расскажем (:',
            qrLabel: 'Сканируйте QR с телефона',
            telegramLabel: 'Telegram',
            maxLabel: 'Max'
        },

        /* --- Position: 'right' or 'left' --- */
        position: 'right',

        /* --- QR code: 'qrserver' uses api.qrserver.com --- */
        qrService: 'qrserver',
        qrSize: 200,

        /* --- Additional messengers (add to the buttons list) --- */
        extraMessengers: [],

        /* --- Color theme overrides --- */
        theme: {},

        /* --- z-index base --- */
        zIndex: 999997
    };

    /* ================================================================
     * Helper: deep merge objects
     * ================================================================ */

    function deepMerge(target, source) {
        var result = {};
        var key;
        for (key in target) {
            if (target.hasOwnProperty(key)) {
                result[key] = target[key];
            }
        }
        for (key in source) {
            if (source.hasOwnProperty(key)) {
                if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    result[key] = deepMerge(result[key] || {}, source[key]);
                } else {
                    result[key] = source[key];
                }
            }
        }
        return result;
    }

    /* ================================================================
     * Helper: create element with attributes
     * ================================================================ */

    function createEl(tag, attrs, children) {
        var el = document.createElement(tag);
        if (attrs) {
            var key;
            for (key in attrs) {
                if (attrs.hasOwnProperty(key)) {
                    if (key === 'className') {
                        el.className = attrs[key];
                    } else if (key === 'html') {
                        el.innerHTML = attrs[key];
                    } else if (key === 'text') {
                        el.textContent = attrs[key];
                    } else if (key === 'style') {
                        // skip — use CSS classes instead
                    } else if (key.substring(0, 2) === 'on') {
                        el.addEventListener(key.substring(2).toLowerCase(), attrs[key]);
                    } else if (key === 'data') {
                        var dk;
                        for (dk in attrs[key]) {
                            if (attrs[key].hasOwnProperty(dk)) {
                                el.setAttribute('data-' + dk, attrs[key][dk]);
                            }
                        }
                    } else if (key === 'aria') {
                        var ak;
                        for (ak in attrs[key]) {
                            if (attrs[key].hasOwnProperty(ak)) {
                                el.setAttribute('aria-' + ak, attrs[key][ak]);
                            }
                        }
                    } else {
                        el.setAttribute(key, attrs[key]);
                    }
                }
            }
        }
        if (children) {
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (typeof child === 'string') {
                    if (child.charCodeAt(0) === 60) {
                        // HTML/SVG markup — insert as DOM elements
                        el.insertAdjacentHTML('beforeend', child);
                    } else {
                        // Plain text — insert as text node
                        el.appendChild(document.createTextNode(child));
                    }
                } else if (child instanceof Node) {
                    el.appendChild(child);
                }
            }
        }
        return el;
    }

    /* ================================================================
     * Helper: generate QR URL via api.qrserver.com
     * ================================================================ */

    function getQRUrl(data, size) {
        return 'https://api.qrserver.com/v1/create-qr-code/?size=' + size + 'x' + size + '&data=' + encodeURIComponent(data);
    }

    /* ================================================================
     * Helper: get scrollbar width for body lock compensation
     * ================================================================ */

    function getScrollbarWidth() {
        var div = document.createElement('div');
        div.style.cssText = 'position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll;visibility:hidden;';
        document.body.appendChild(div);
        var w = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);
        return w;
    }

    /* ================================================================
     * MessengerWidget class
     * ================================================================ */

    function MessengerWidget(config) {
        this.config = deepMerge(DEFAULTS, config || {});
        this.isOpen = false;
        this.qrCurrent = 'telegram';
        this.scrollbarWidth = getScrollbarWidth();
        this.focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
        this.elements = {};
        this._onKeyDown = this._handleKeyDown.bind(this);
        this._onOutsideClick = this._handleOutsideClick.bind(this);
        this._onTriggerClick = this._toggle.bind(this);
        this._onCloseClick = this._close.bind(this);

        this._build();
        this._bindEvents();
    }

    /* ----------------------------------------------------------------
     * Build all DOM elements
     * ---------------------------------------------------------------- */

    MessengerWidget.prototype._build = function () {
        this._injectCSS();
        this._buildOverlay();
        this._buildPopup();
        this._buildTrigger();
    };

    /* --- Inject the CSS file --- */

    MessengerWidget.prototype._injectCSS = function () {
        var src = WIDGET_SCRIPT_SRC;

        // Priority 1: explicit cssUrl in config
        var cssUrl = this.config.cssUrl || '';

        // Priority 2: data-css-url attribute on the widget script tag
        if (!cssUrl && src) {
            var scripts = document.getElementsByTagName('script');
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].src === src) {
                    cssUrl = scripts[i].getAttribute('data-css-url') || '';
                    break;
                }
            }
        }

        // Priority 3: derive from JS path
        if (!cssUrl && src) {
            var basePath = src.substring(0, src.lastIndexOf('/') + 1);
            cssUrl = basePath + 'messenger-widget.css';
        }

        if (!cssUrl) return;

        // Check if already loaded
        var existing = document.querySelector('link[data-mw-css]');
        if (existing) return;

        // Load CSS dynamically
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl;
        link.setAttribute('data-mw-css', '1');

        document.head.appendChild(link);
    };

    /* --- Overlay --- */

    MessengerWidget.prototype._buildOverlay = function () {
        var overlay = createEl('div', {
            className: 'mw-overlay',
            role: 'presentation',
            aria: { hidden: 'true' },
            tabindex: '-1'
        });
        document.body.appendChild(overlay);
        this.elements.overlay = overlay;
    };

    /* --- Popup --- */

    MessengerWidget.prototype._buildPopup = function () {
        var cfg = this.config;

        // Close button
        var closeBtn = createEl('button', {
            className: 'mw-close',
            type: 'button',
            aria: { label: 'Закрыть окно' },
            onClick: this._onCloseClick
        }, [ICONS.close]);

        // Header
        var header = createEl('div', { className: 'mw-header' }, [
            createEl('h3', { className: 'mw-header-title', text: cfg.texts.title }),
            createEl('p', { className: 'mw-header-subtitle', text: cfg.texts.subtitle })
        ]);

        // QR column — left
        var qrCol = this._buildQRColumn();

        // Buttons column — right
        var buttonsCol = this._buildButtonsColumn();

        // Body
        var body = createEl('div', { className: 'mw-body' }, [qrCol, buttonsCol]);

        // Focus sentinels for focus trap
        var sentinelStart = createEl('div', { className: 'mw-focus-sentinel', tabindex: '0' });
        var sentinelEnd = createEl('div', { className: 'mw-focus-sentinel', tabindex: '0' });

        // Popup
        var popup = createEl('div', {
            className: 'mw-popup' + (cfg.position === 'left' ? ' mw-position-left' : ''),
            role: 'dialog',
            aria: { modal: 'true', label: cfg.texts.title, live: 'polite' }
        }, [sentinelStart, closeBtn, header, body, sentinelEnd]);

        document.body.appendChild(popup);
        this.elements.popup = popup;
        this.elements.sentinelStart = sentinelStart;
        this.elements.sentinelEnd = sentinelEnd;
    };

    /* --- Build QR column --- */

    MessengerWidget.prototype._buildQRColumn = function () {
        var self = this;
        var cfg = this.config;

        // QR toggle tabs
        var telegramTab = createEl('button', {
            className: 'mw-qr-tab mw-active',
            type: 'button',
            text: cfg.texts.telegramLabel,
            aria: { pressed: 'true' },
            data: { messenger: 'telegram' },
            onClick: function () { self._switchQR('telegram'); }
        });

        var maxTab = createEl('button', {
            className: 'mw-qr-tab',
            type: 'button',
            text: cfg.texts.maxLabel,
            aria: { pressed: 'false' },
            data: { messenger: 'max' },
            onClick: function () { self._switchQR('max'); }
        });

        var toggle = createEl('div', { className: 'mw-qr-toggle', role: 'tablist', aria: { label: 'Выбор мессенджера' } }, [telegramTab, maxTab]);

        // QR label
        var qrLabel = createEl('div', { className: 'mw-qr-label', text: cfg.texts.qrLabel });

        // QR wrapper
        var qrWrapper = createEl('div', { className: 'mw-qr-wrapper' });

        var qrCol = createEl('div', { className: 'mw-qr-col' }, [toggle, qrLabel, qrWrapper]);

        this.elements.qrTelegramTab = telegramTab;
        this.elements.qrMaxTab = maxTab;
        this.elements.qrWrapper = qrWrapper;
        this._updateQR();

        return qrCol;
    };

    /* --- Switch QR code between messengers --- */

    MessengerWidget.prototype._switchQR = function (messenger) {
        this.qrCurrent = messenger;
        var telegramTab = this.elements.qrTelegramTab;
        var maxTab = this.elements.qrMaxTab;

        if (messenger === 'telegram') {
            telegramTab.className = 'mw-qr-tab mw-active';
            telegramTab.setAttribute('aria-pressed', 'true');
            maxTab.className = 'mw-qr-tab';
            maxTab.setAttribute('aria-pressed', 'false');
        } else {
            maxTab.className = 'mw-qr-tab mw-active';
            maxTab.setAttribute('aria-pressed', 'true');
            telegramTab.className = 'mw-qr-tab';
            telegramTab.setAttribute('aria-pressed', 'false');
        }
        this._updateQR();
    };

    /* --- Update QR code image --- */

    MessengerWidget.prototype._updateQR = function () {
        var wrapper = this.elements.qrWrapper;
        var cfg = this.config;
        var link = this.qrCurrent === 'telegram' ? cfg.telegram.link : cfg.max.link;
        var url = getQRUrl(link, cfg.qrSize);

        wrapper.innerHTML = '';
        wrapper.classList.add('mw-loading');
        var img = new Image();
        img.alt = 'QR-код для ' + (this.qrCurrent === 'telegram' ? cfg.texts.telegramLabel : cfg.texts.maxLabel);
        img.onload = function () {
            wrapper.classList.remove('mw-loading');
            wrapper.appendChild(img);
        };
        img.onerror = function () {
            wrapper.classList.remove('mw-loading');
            wrapper.innerHTML = '<span class="mw-qr-placeholder">QR не загружен</span>';
        };
        img.src = url;
    };

    /* --- Build buttons column --- */

    MessengerWidget.prototype._buildButtonsColumn = function () {
        var cfg = this.config;

        var buttons = [];

        // Max button
        buttons.push(this._createMessengerButton({
            className: 'mw-button-max',
            icon: ICONS.max,
            label: cfg.texts.maxLabel,
            link: cfg.max.link,
            ariaLabel: 'Открыть чат в Max'
        }));

        // Telegram button
        buttons.push(this._createMessengerButton({
            className: 'mw-button-telegram',
            icon: ICONS.telegram,
            label: cfg.texts.telegramLabel,
            link: cfg.telegram.link,
            ariaLabel: 'Открыть чат в Telegram'
        }));

        // Extra messengers
        var extra = cfg.extraMessengers || [];
        for (var i = 0; i < extra.length; i++) {
            var em = extra[i];
            var iconSVG = em.icon || '';
            if (em.type === 'whatsapp' && !iconSVG) iconSVG = ICONS.whatsapp;
            if (em.type === 'viber' && !iconSVG) iconSVG = ICONS.viber;
            buttons.push(this._createMessengerButton({
                className: em.className || ('mw-button-' + (em.type || 'custom')),
                icon: iconSVG,
                label: em.label || em.type || 'Chat',
                link: em.link || '#',
                ariaLabel: 'Открыть чат в ' + (em.label || em.type || 'мессенджере')
            }));
        }

        var col = createEl('div', { className: 'mw-buttons-col' }, buttons);
        return col;
    };

    /* --- Create a single messenger button --- */

    MessengerWidget.prototype._createMessengerButton = function (opts) {
        var arrow = createEl('span', { className: 'mw-button-arrow', aria: { hidden: 'true' } }, [ICONS.arrowRight]);

        return createEl('a', {
            href: opts.link,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'mw-button ' + (opts.className || ''),
            aria: { label: opts.ariaLabel || opts.label }
        }, [
            createEl('span', { className: 'mw-button-icon', aria: { hidden: 'true' } }, [opts.icon || '']),
            createEl('span', { className: 'mw-button-text', text: opts.label }),
            arrow
        ]);
    };

    /* --- Floating trigger button --- */

    MessengerWidget.prototype._buildTrigger = function () {
        var cfg = this.config;
        var posClass = cfg.position === 'left' ? ' mw-position-left' : '';

        var chatIcon = createEl('span', { className: 'mw-trigger-icon-chat' }, [ICONS.chat]);
        var closeIcon = createEl('span', { className: 'mw-trigger-icon-close' }, [ICONS.close]);

        var trigger = createEl('button', {
            className: 'mw-trigger' + posClass,
            type: 'button',
            aria: { label: 'Открыть чат', expanded: 'false', haspopup: 'dialog' },
            onClick: this._onTriggerClick
        }, [chatIcon, closeIcon]);

        document.body.appendChild(trigger);
        this.elements.trigger = trigger;
    };

    /* ================================================================
     * Event binding
     * ================================================================ */

    MessengerWidget.prototype._bindEvents = function () {
        // ESC key global
        document.addEventListener('keydown', this._onKeyDown);
        // Overlay click to close
        this.elements.overlay.addEventListener('click', this._onCloseClick);
        // Focus trap
        this.elements.sentinelStart.addEventListener('focus', this._trapFocusEnd.bind(this));
        this.elements.sentinelEnd.addEventListener('focus', this._trapFocusStart.bind(this));
    };

    /* ================================================================
     * Open / Close / Toggle
     * ================================================================ */

    MessengerWidget.prototype._toggle = function () {
        if (this.isOpen) {
            this._close();
        } else {
            this._open();
        }
    };

    MessengerWidget.prototype._open = function () {
        if (this.isOpen) return;
        this.isOpen = true;

        this.elements.overlay.classList.add('mw-open');
        this.elements.overlay.setAttribute('aria-hidden', 'false');
        this.elements.popup.classList.add('mw-open');
        this.elements.trigger.classList.add('mw-open-state');
        this.elements.trigger.setAttribute('aria-label', 'Закрыть чат');
        this.elements.trigger.setAttribute('aria-expanded', 'true');

        this._lockScroll();
        this._focusFirstElement();
        this._updateQR();

        // Dispatch event
        this._dispatch('open');
    };

    MessengerWidget.prototype._close = function () {
        if (!this.isOpen) return;
        this.isOpen = false;

        this.elements.overlay.classList.remove('mw-open');
        this.elements.overlay.setAttribute('aria-hidden', 'true');
        this.elements.popup.classList.remove('mw-open');
        this.elements.trigger.classList.remove('mw-open-state');
        this.elements.trigger.setAttribute('aria-label', 'Открыть чат');
        this.elements.trigger.setAttribute('aria-expanded', 'false');

        this._unlockScroll();
        this.elements.trigger.focus();

        // Dispatch event
        this._dispatch('close');
    };

    /* --- Focus trap --- */

    MessengerWidget.prototype._focusFirstElement = function () {
        var popup = this.elements.popup;
        var focusable = popup.querySelectorAll(this.focusableSelector);
        if (focusable.length > 0) {
            focusable[0].focus();
        }
    };

    MessengerWidget.prototype._trapFocusStart = function () {
        var popup = this.elements.popup;
        var focusable = popup.querySelectorAll(this.focusableSelector);
        if (focusable.length > 0) {
            focusable[0].focus();
        }
    };

    MessengerWidget.prototype._trapFocusEnd = function () {
        var popup = this.elements.popup;
        var focusable = popup.querySelectorAll(this.focusableSelector);
        if (focusable.length > 0) {
            focusable[focusable.length - 1].focus();
        }
    };

    /* --- Keyboard handler (ESC) --- */

    MessengerWidget.prototype._handleKeyDown = function (e) {
        if (e.key === 'Escape' && this.isOpen) {
            e.preventDefault();
            this._close();
        }
    };

    /* --- Outside click — handled by overlay click --- */

    MessengerWidget.prototype._handleOutsideClick = function (e) {
        if (e.target === this.elements.overlay) {
            this._close();
        }
    };

    /* --- Scroll lock --- */

    MessengerWidget.prototype._lockScroll = function () {
        document.documentElement.style.setProperty('--mw-scrollbar-width', this.scrollbarWidth + 'px');
        document.body.classList.add('mw-scroll-locked');
    };

    MessengerWidget.prototype._unlockScroll = function () {
        document.body.classList.remove('mw-scroll-locked');
    };

    /* --- Custom event dispatch --- */

    MessengerWidget.prototype._dispatch = function (name) {
        var event;
        try {
            event = new CustomEvent('mw:' + name, { detail: { widget: this } });
        } catch (e) {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent('mw:' + name, true, true, { widget: this });
        }
        document.dispatchEvent(event);
    };

    /* ================================================================
     * Public API
     * ================================================================ */

    MessengerWidget.prototype.open = function () { this._open(); };
    MessengerWidget.prototype.close = function () { this._close(); };
    MessengerWidget.prototype.toggle = function () { this._toggle(); };

    /* ================================================================
     * Static init — creates the widget instance
     * ================================================================ */

    MessengerWidget.init = function (config) {
        if (MessengerWidget._instance) {
            console.warn('[MessengerWidget] Already initialized. Call MessengerWidget.getInstance() to access.');
            return MessengerWidget._instance;
        }
        MessengerWidget._instance = new MessengerWidget(config);
        return MessengerWidget._instance;
    };

    /* --- Get existing instance --- */

    MessengerWidget.getInstance = function () {
        return MessengerWidget._instance || null;
    };

    /* ================================================================
     * Expose to global scope
     * ================================================================ */

    global.MessengerWidget = MessengerWidget;

})(window);
