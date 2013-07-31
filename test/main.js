/**
 * Example main.js file for orb.js
 * created by: Dave Padovano
 *
 * @module {main}: starts app.js, tells requireJS to include "app" to the project and include all javascript libraries in plugins.js.
 */
require(['app', 'plugins'], function(App) {

    App.init();

});