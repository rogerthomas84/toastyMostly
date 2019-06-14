/**
 * Roger Thomas
 * GitHub - https://github.com/rogerthomas84
 */

/**
 * toastyMostly
 *
 * First call to the constructor must include the config object.
 * {animation:true, autohide:false, delay: 2000}
 * Valid config options:
 *      animation -> boolean, whether to show a CSS animation. Default true.
 *      autohide -> boolean, whether to automatically hide the toast after `delay`. Default false.
 *      delay -> integer, after this many milliseconds
 * All config options can be overridden on a per toast basis.
 *
 * @param config object
 * @return toastyMostly
 */
let toastyMostly = function(config) {

    if (typeof window._toastyMostly !== 'undefined') {
        return window._toastyMostly;
    }

    if (typeof config === 'undefined') {
        config = {};
    }
    let options = {animation:true, autohide:true, delay: 2000};
    let style = {'position':'fixed', 'top':'100px', 'right':'0', 'height':'0', 'z-index':'2000', 'width':'250px'};
    for (let ck in config) {
        if (config.hasOwnProperty(ck) === false || ck === 'style') {
            continue;
        }
        options[ck] = config[ck];
    }
    if (config.hasOwnProperty('style')) {
        for (let cs in config['style']) {
            if (config['style'].hasOwnProperty(cs)) {
                style[cs] = config['style'][cs];
            }
        }
    }
    window._toastyMostly = this;

    /**
     * Generates a random identifier string.
     * @returns {string}
     * @private
     */
    this._tmId = function() {
        function S4() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return 'toastyMostly' + S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
    };

    /**
     * Place the wrapper for ToastyMostly
     * @private
     */
    this._tmPlaceWrapper = function() {
        if (jQuery('.toastyMostlyCase').length === 0) {
            let wrapper = jQuery('<div />');
            wrapper.addClass('toastyMostlyCase');
            wrapper.css(style);
            jQuery('body').append(wrapper);
        }
    };

    /**
     * Remove a single toast
     *
     * @param identifier string
     * @return {boolean}
     */
    this.remove = function(identifier) {
        let elem = jQuery('.toastyMostlyElement[id="' + identifier +'"]');
        if (elem.length > 0) {
            try {
                jQuery('#' + identifier).off('hidden.bs.toast');
                elem.toast('hide');
                return true;
            } catch (e) {
            }
        }
        return false;
    };

    /**
     * Update an already placed toastyMostly toast. Passing the returned id from `send()` and an optional config object.
     *
     * Valid config options are:
     *      title -> string, required - The header of the toast.
     *      body -> string, required - The body of the toast.
     *      time -> string, optional - To the right of the header, small text, for example: "11 mins ago".
     *      addClass -> string, optional - a custom class name (or class names) to add to this toast.
     *      removeClass -> string, optional - a custom class name (or class names) to remove from this toast.
     *
     * @param identifier string
     * @param config object
     * @returns {boolean}
     */
    this.update = function(identifier, config) {
        if (typeof config === 'undefined') {
            config = {};
        }
        let defaults = {time: null, title: null, body: null, addClass: null, removeClass: null};
        for (let ci in config) {
            if (config.hasOwnProperty(ci) === false || defaults.hasOwnProperty(ci) === false) {
                continue;
            }
            defaults[ci] = config[ci];
        }
        let elem = jQuery('.toastyMostlyElement[id="' + identifier +'"]');
        if (elem.length === 0) {
            return false;
        }
        if (defaults.addClass !== null) {
            elem.addClass(defaults.addClass);
        }
        if (defaults.removeClass !== null) {
            elem.removeClass(defaults.removeClass);
        }
        if (defaults.time !== null) {
            if (jQuery('.toastyTime', elem).length > 0) {
                jQuery('.toastyTime', elem).html(
                    jQuery('<small />').html(defaults.time)
                );
            }
        }
        if (defaults.title !== null) {
            jQuery('.toastyTitle', elem).html(defaults.title);
        }
        if (defaults.body !== null) {
            jQuery('.toastyBody', elem).html(defaults.body);
        }
        return true;
    };

    /**
     * Send a single toast.
     *
     * Valid options:
     *      title -> string, required - The header of the toast.
     *      body -> string, required - The body of the toast.
     *      time -> string, optional - To the right of the header, small text, for example: "11 mins ago".
     *      class -> string, optional - If provided, a list of additional classes to apply to the toast.
     *      id -> string, optional - If provided, the toast will have this ID and class
     *      closeBtn -> boolean, default true - Whether to show the close button.
     *      append -> boolean, default true - Whether to append or prepend the toast to the existing list.
     *
     * @param opts object
     * @returns {string}
     */
    this.send = function(opts) {
        if (typeof opts === 'undefined') {
            opts = {};
        }
        this._tmPlaceWrapper();
        let defaults = {
            time: null, title: null, body: null, class: null, id: null, closeBtn: true, append: true,
            animation:options.animation, autohide:options.autohide, delay: options.delay
        };
        for (let k in opts) {
            if (opts.hasOwnProperty(k) === false || defaults.hasOwnProperty(k) === false) {
                continue;
            }
            defaults[k] = opts[k];
        }
        if (defaults.title === null || defaults.body === null) {
            console.error('toastyMostly requires a title and body');
        }
        let tmi = this._tmId();
        if (defaults.id !== null) {
            tmi = defaults.id;
        }

        let header = jQuery('<div />').addClass('toast-header').html(
            jQuery('<strong />').addClass('mr-auto toastyTitle').html(defaults.title)
        );
        if (opts.time !== null) {
            header.append(
                jQuery('<span />').addClass('toastyTime').html(
                    jQuery('<small />').html(opts.time)
                )
            );
        }
        if (opts.closeBtn === true) {
            header.append(
                jQuery('<button />').attr('type', 'button').addClass('ml-2 mb-1 close').attr('data-dismiss', 'toast').html(
                    jQuery('<span />').html('&times;')
                )
            );
        }

        let outer = jQuery('<div />');
        outer.attr('id', tmi);
        outer.attr('role', 'alert');
        outer.addClass('toastyMostlyElement');
        outer.addClass('toast');
        outer.addClass(tmi);
        outer.html(header);
        if (defaults.class !== null) {
            outer.addClass(defaults.class);
        }
        outer.append(
            jQuery('<div />').addClass('toast-body').addClass('toastyBody').html(defaults.body)
        );
        if (defaults.append === true) {
            jQuery('.toastyMostlyCase').append(outer);
        } else {
            jQuery('.toastyMostlyCase').prepend(outer);
        }

        jQuery('#' + tmi).on('hidden.bs.toast', function () {
            jQuery('#' + tmi).off('hidden.bs.toast');
            if (jQuery(this).length) {
                jQuery(this).remove();
            }
        });
        jQuery('#' + tmi).toast({
            animation: defaults.animation,
            autohide: defaults.autohide,
            delay: defaults.delay
        });
        jQuery('#' + tmi).toast('show');
        return tmi;
    };

    return this;
};