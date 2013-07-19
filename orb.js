/**
 * orb framework (alpha) version 0.0.1: utility for adding and dispatching events
 * @type {{events: (*|{}), on: Function, remove: Function, dispatch: Function}}
 * @author: Dave Padovano
 *
 * jslint bitwise: false, sloppy: true, browser: true
 */

var o = {

    events: this.events || {},
    on: function (event, target, callback, capture) {
        var elem;
        this.events[event] = callback;
        if (typeof target === 'string') {
            if (target.indexOf('.') === 0) {
                var i = 0;
                    elem = document.getElementsByClassName(target.split('.')[1]);

                for (i; i < elem.length; i += 1) {
                    elem[i].addEventListener(event, callback);
                }
            }
            else if(target.indexOf('#') === 0) {
                elem = document.getElementById(target.split('#')[1]);
                elem.addEventListener(event, callback);
            }
        }
        return elem;
    },
    remove: function (event) {
        if (this.events[event]) {
            delete this.events[event];
        }
    },
    dispatch: function (event) {
        if (this.events[event]) {
            this.events[event].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    },

    log: console.log.bind(console),

    /*
     * An object that returns strings for global use around the application. returns only,
     * these values cannot be changed in another location.
     */
    event: {

        /**
         * @return {string}
         * Event for dispatching that a view's transition in animation completed.
         */
        OPEN_COMPLETE: function() {
            return 'OPEN_COMPLETE';
        },

        /**
         * @return {string}
         * Event for dispatching that a view's active.
         */
        ACTIVE_COMPLETE: function() {
            return 'ACTIVE_COMPLETE';
        },

        /**
         * @return {string}
         * Event for dispatching that a view's transition out animation completed.
         */
        CLOSE_COMPLETE: function() {
            return 'CLOSE_COMPLETE';
        },

        /**
         * @return {string}
         * Event for dispatching that a view's no longer active.
         */
        CLEANUP_COMPLETE: function() {
            return 'CLEANUP_COMPLETE';
        }
    },

    // Variable holds all view objects (classes) in an array.
    views: [],

    view: function(target) {

        var base, extended, active, duration;

        // Create base object for each view.
        base = {

            //
            getDuration: function() {
                return duration;
            },
            setDuration: function(value) {
                duration = value;
            },

            init: function() {
                throw new SyntaxError('orb.js: your view must return a function init(). No such function found, check your view class.')
            },
            open: function() {
                throw new SyntaxError('orb.js: your view must return a function open(). No such function found, check your view class.')
            },
            active: function() {
                throw new SyntaxError('orb.js: your view must return a function active(). No such function found, check your view class.')
            },
            close: function() {
                throw new SyntaxError('orb.js: your view must return a function close(). No such function found, check your view class.')
            },
            cleanup: function() {
                throw new SyntaxError('orb.js: your view must return a function cleanup(). No such function found, check your view class.')
            }
        };

        // Create new extended view
        extended = _.extend(base, target.view);

        // Listen to event 'NAVIGATE_TO' and call navigate function.
        this.on('NAVIGATE_TO', {}, this.navigate);

        // Add newly created view to array of views.
        this.views.push({ view: extended, hash: target.hash });

        // Auto call init after each view is created.
        extended.init();

        // Return view
        return extended;
    },

    navigate: function(hash) {

        var target;

        // Try to match browser hashtag to the hash of a view
        _.each(this.views, function(view){
            if(view.hash == hash) {
                target = view;

            }
        })
    }

};