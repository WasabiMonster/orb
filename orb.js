/**
 * orb framework (alpha) version 0.0.1: utility for adding and dispatching events
 * @type {{events: (*|{}), on: Function, remove: Function, dispatch: Function}}
 * @author: Dave Padovano
 *
 * jslint bitwise: false, sloppy: true, browser: true
 */

var o = {

    // Global framework event object.
    events: this.events || {},

    // Use to attach new events.
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

    // Remove an event that is no longer needed.
    remove: function (event) {
        if (this.events[event]) {
            delete this.events[event];
        }
    },

    // Dispatch an event to the framework.
    dispatch: function (event) {
        if (this.events[event]) {
            this.events[event].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    },

    // Shortcut for logging console commands.
    /*log: function() {

     },*/
    log: console.log.bind(console),

    /*
     * An object that returns strings for global use around the application. returns only,
     * these values cannot be changed in another location.
     */
    event: {
        NAVIGATE_TO: 'NAVIGATE_TO',
        PRELOAD_COMPLETE: 'PRELOAD_COMPLETE',
        NEXT_STATE: 'NEXT_STATE',
        OPEN_COMPLETE: 'OPEN_COMPLETE',
        ACTIVE_COMPLETE:'ACTIVE_COMPLETE',
        CLOSE_COMPLETE: 'CLOSE_COMPLETE',
        CLEANUP_COMPLETE: 'CLEANUP_COMPLETE'
    },

    // Current active view.
    current: null,

    // Next active view.
    next: null,

    start: function() {
        var defaultView, hashView;

        _.each(this.views, function(view) {

            if (view.hash == window.location.hash.split('#')[1]) {
                hashView = view;
            }

            if (view._default) {
                defaultView = view;
            }
        });

        // If matching hash tag is found, then navigate.
        if(hashView) {
            this.dispatch(this.event.NAVIGATE_TO, hashView.hash);

            // If default is set then and no matching hash, then navigate to default.
        } else if(defaultView) {
            this.dispatch(this.event.NAVIGATE_TO, defaultView.hash);

            // If no other conditions met, go to the first item in the view array.
        } else {
            this.dispatch(this.event.NAVIGATE_TO, this.views[0].hash);
        }
        this.log('hashview', hashView)
    },

    // Variable holds all view objects (classes) in an array.
    views: [],

    view: function(target) {

        var base, extended;

        // Create base object for each view.
        base = {
            preload: function() {
                throw new SyntaxError('orb.js: your view must return a function preload(). No such function found, check your view class.')
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

        // Create new extended view.
        extended = _.extend(base, target.view);

        if ("onhashchange" in window) {
            window.addEventListener("hashchange", function() {
                if (String(location.hash).split('#')[1] === target.hash) {
                    console.log(location.hash, target);
                    o.dispatch(o.event.NAVIGATE_TO, target.hash);
                }
            }, false);
        }
        // Add newly created view to array of views.
        this.views.push({ view: extended, hash: target.hash, _default: target.default });

        // Return view.
        return extended;
    },

    navigate: function(hash) {

        // If navigationComplete false (not finished), then do not navigate to new page.
        if(this.navigateComplete) {
            var next, scope;

            // Set scope to access all orb variables and functions.
            scope = this;

            // If a current view has been set and does not match the new hash in the
            // browser, then find the new view.
            if(scope.current) {
                if(scope.current.hash != hash) {
                    matchHash();
                }
            } else {
                matchHash();
            }

            // If next view is found add it to the
            if(next) {
                scope.next = next;

                this.changeState();

                this.navigateComplete = false;
            }
        } else {
            this.queue = hash;
        }

        // Try to match browser hash tag to the hash of a view.
        function matchHash() {
            _.each(scope.views, function(view) {
                if(view.hash == hash) {
                    next = view;
                }
            });
        }
    },

    processing: false,
    navigateComplete: true,
    state: 0,
    states: [],
    queue: null,

    changeState: function() {
        if(!this.processing) {
            this.states[this.state].run();
        }
    },

    nextState: function() {
        this.processing = false;
        this.states[this.state].next();
    }

};


// Preload state calls view's public function preload, waits for it to complete any
// loading that is require before continuing the state engine process.
o.preload = {
    run: function() {
        o.processing = true;

        // Trigger preload function in next view.
        o.next.view.preload();

        //o.log('Running next view\'s preload() state, launching close() state next.');

        o.on(o.event.PRELOAD_COMPLETE, {}, function() {
            // Dispatch event to trigger next state, timeout duration is returned from view.
            o.dispatch(o.event.NEXT_STATE);
        });
    },
    next: function() {
        o.state++;
        o.changeState();
    }
};
o.close = {
    run: function() {

        // Check if a current state exists. If not bypass this state.
        if(o.current)
        // Get duration from TweenMax
            var duration = o.current.view.close() * 1000;
        else {
            o.dispatch(o.event.NEXT_STATE);
            return;
        }

        //o.log('Running current view\'s close() state, launching cleanup() state next. duration: ', duration);

        // Dispatch event to trigger next state, timeout duration is returned from view.
        setTimeout(function() {
            o.dispatch(o.event.NEXT_STATE);
        }, duration);
    },
    next: function() {
        o.state++;
        o.changeState();
    }
};
o.cleanup = {
    run: function() {

        //o.log('Running current view\'s cleanup() state, launching init() state next.');

        if(o.current){
            // Get duration from TweenMax
            var duration = o.current.view.cleanup() * 1000;
            o.current.view.cleanup();
        }
        else {
            o.dispatch(o.event.NEXT_STATE);
            return;
        }

        // Dispatch event to trigger next state, timeout duration is returned from view.
        setTimeout(function() {
            o.dispatch(o.event.NEXT_STATE);
        }, duration);
    },
    next: function() {
        o.state++;
        o.changeState();
    }
};
o.init = {
    run: function() {
        // Get duration from TweenMax
        var duration = o.next.view.init() * 1000;

        //o.log('Running next view\'s init() state, launching open() state next.');

        setTimeout(function() {
            o.dispatch(o.event.NEXT_STATE);
        }, duration);
    },
    next: function() {
        o.state++;
        o.changeState();
    }
};
o.open = {
    run: function() {
        // Get duration from TweenMax
        var duration = o.next.view.open() * 1000;

        //o.log('Running next view\'s open() state, launching active() state next.');

        // Dispatch event to trigger next state, timeout duration is returned from view.
        setTimeout(function() {
            o.dispatch(o.event.NEXT_STATE);
        }, duration);
    },
    next: function() {
        o.state++;
        o.changeState();
    }
};
o.active = {
    run: function() {
        // Get duration from TweenMax
        var duration = o.next.view.active() * 1000;

        //o.log('Running next view\'s active() state, launching finish() state next.');

        // Dispatch event to trigger next state, timeout duration is returned from view.
        setTimeout(function() {
            o.dispatch(o.event.NEXT_STATE);
        }, duration);
    },
    next: function() {
        o.state++;
        o.changeState();
    }
};
o.finish = {
    run: function() {

        //o.log('All states completed successfully, no other states to run.');

        o.dispatch(o.event.NEXT_STATE);
    },
    next: function() {
        o.state = 0;
        o.processing = false;
        o.navigateComplete = true;
        o.current = o.next;
        if(!!o.queue) {
            o.dispatch(o.event.NAVIGATE_TO, o.queue);
            o.queue = null;
        } else {
            o.next = null;
        }
    }
};

(function(o) {

    // States added to array, they are processed in sequentially. If the flow needs to change
    // you only need to change the order here. DO NOT call the states anywhere else manually.
    o.states = [
        o.preload,
        o.close,
        o.cleanup,
        o.init,
        o.open,
        o.active,
        o.finish
    ];

    // Add navigation event listener to orbjs.
    o.on(o.event.NAVIGATE_TO, {}, o.navigate);

    // Add next state event to orbjs.
    o.on(o.event.NEXT_STATE, {}, o.nextState);

}(o));