/**
 * Orb.js require config file.
 *
 * @module {config}: loads third-party, libraries before starting require.js.
 */
require.config({

    //main.js starts the application
    deps: ['main'],

    paths: {
        'orb': '../orb',
        'jQuery': 'libs/jquery-1.9.1',
        'underscore': 'libs/underscore',
        'text': 'libs/text',
        'tweenmax': 'libs/TweenMax'
    },

    shim: {
        'underscore': {
            exports: '_'
        },
        'orb': {
            deps: ['underscore']
        }
    }

});