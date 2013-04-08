 define(['backbone', 'jquery', 'jqueryui', 'bootstrap'], function(Backbone, $) {


    var FormView = Backbone.View.extend({
        initialize: function() {
            var toggler = new TogglerView({
                el: '.toggle'
            });
            var slider = new SliderView({
                el: '.ui-slider'
            });
            //this.render();
        },
        render: function() {
            return this;
        }
    });


    var SliderView = FormView.extend({
        initialize: function() {            
            // Init Tooltip
            this.$el.find('a').tooltip({title:'5', delay: { show: 500, hide: 10 }, trigger: 'manual'});
            this.render();
        }, 
        render: function() {
            this.$el.slider({
                min: 0,
                max: 10,
                value: 5,
                orientation: "horizontal",
                range: "min",
                slide: function() {
                    console.log($(this).find('a').tooltip());
                    if ($(this).find('a').tooltip().length < 1) {
                        $(this).find('a').tooltip({title:'5', delay: { show: 500, hide: 10 }, trigger: 'manual'});
                    }
                    $(this).find('a').tooltip('hide');
                },
                stop: function( event, ui ) {
                    //set the input box
                    var id = '#' + $(this).attr('data-input');
                    $(id).val(ui.value);
                    //add a nice tooltip to show value
                    $(this).find('a').attr('data-original-title', ui.value)
                        .delay(500).tooltip('show');
                }
            });
            return this;
        }
    });

    var TogglerView = FormView.extend({

        events: {
            'click' : '_toggle'
        },
        _toggle: function(evt) {
            var $el = $(evt.currentTarget);
            this.checkToggleState($el, true);
        },
        initialize: function() {
            var self = this;

            self.$el.each( function() {
                self.checkToggleState($(this));
            });
            //self.render();
        },
        checkToggleState: function($el, toggle) {
            var id = $el.attr('data-input'),
                $inputEl = $el.parent().find('#' + id),
                checked = $inputEl.prop('checked');


            //Click event, change checked val.
            if (toggle) {
                checked = !checked;
                $inputEl.prop('value', checked)
                        .prop('checked', checked);
            }

            if (checked) {
                $el.removeClass('toggle-off')
            } else {
                $el.addClass('toggle-off')
            }
        },

        render: function() {
            return this;
        }

    });


    return FormView;
       
});
