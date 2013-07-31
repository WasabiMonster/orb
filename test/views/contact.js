/**
 * View JavaScript Template
 */
define(['text!templates/contact.html'], function(Template) {

    var timeline = new TimelineMax();

    return function() {

        // Preload content before starting animation.
        this.preload = function() {
            o.dispatch(o.event.NEXT_STATE);
        };

        // Set initial stuff after view is created.
        this.init = function() {

            var template = $(_.template(Template, {}));
            $('nav').prepend(template);

            return 0.5;
        };

        // Animate view in.
        this.open = function() {

            timeline = new TimelineMax();
            timeline.append(TweenMax.to('.view .title', 0.5, {y: 0, alpha: 1}));
            timeline.append(TweenMax.to('.view .headline', 0.35, {y: 0, alpha: 1}));
            timeline.play();

            return timeline.duration();
        };

        // Called after view is animated in.
        this.active = function() {

            return 0;
        };

        // Animate view out.
        this.close = function() {

            // Animate at 2x speed.
            timeline.timeScale(2);
            timeline.reverse();

            // return half the duration time, since at 2x speed.
            return timeline.duration();
        };

        // Called after view is closed.
        this.cleanup = function() {

            // Remove DIV from HTML.
            $('.view').remove();

            return 0;
        };

    };

});