define([
    'views/about',
    'views/work',
    'views/home',
    'views/contact'],

    function(AboutView, WorkView, HomeView, ContactView) {

    return {
        init: function() {
            // Create all views for each "page" of the site.
            o.view({
                hash: 'contact',
                view: new ContactView()
            });

            o.view({
                hash: 'about',
                view: new AboutView()
            });

            o.view({
                hash: 'work',
                view: new WorkView()
            });

            o.view({
                hash: 'home',
                view: new HomeView(),
                default: true
            });

            o.start();
        }
    }
});