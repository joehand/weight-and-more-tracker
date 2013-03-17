 define(['backbone', 'jquery', 'moment'], function(Backbone, $, moment) {
    //To-Do: Make this not so freaking ugly code. This is all hacked together.
    var MomentView = Backbone.View.extend({
        initialize: function() {
            this.render();
        },
        renderCalTime: function($el) {
            var time = $el.html();
            time = moment(time).calendar();
            $el.html(time);
        },
        renderFromNow: function($el) {
            var time = $el.html();
            time = moment(time).fromNow();
            $el.html(time);
        },
        render: function() {
            var self = this;

            self.$el.each(function() {
                var $this = $(this)
                if($this.hasClass('calendar')) {
                    self.renderCalTime($this);
                } else if ($this.hasClass('fromNow')) {
                    self.renderFromNow($this);
                }
            });
            return this;
        }
    });

    return MomentView;
       
});
