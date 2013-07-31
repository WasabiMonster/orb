define([
    'views/home',
    'views/about',
    'views/product',
    'views/history',
    'views/contact'],

    function(HomeView, AboutView, ProductView, HistoryView, ContactView) {

    // Boolean value that ensures only one view manager is initialized.
    var init = false;

    // Public methods.
    return {

        // Start up view manager with initial properties and methods.
        init: function() {
            if(init == true) {
                throw new Error('Error in ViewManager, you cannot init the view manager twice.')
            } else {
                init = true;

                // Create all views for each "page" of the site.
                o.view({
                    hash: 'contact',
                    view: new ContactView()
                });

                o.view({
                    hash: 'history',
                    view: new HistoryView()
                });

                o.view({
                    hash: 'product',
                    view: new ProductView()
                });

                o.view({
                    hash: 'about',
                    view: new AboutView()
                });

                o.view({
                    hash: 'home',
                    view: new HomeView(),
                    default: true // default marks home page
                });

				// Start up orb.js dynamic navigation
                o.start();

				// manually dispatch a navigation event.
				//o.dispatch(o.event.NAVIGATE_TO, 'product');

            }
        }

    };

});