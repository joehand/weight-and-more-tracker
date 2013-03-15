define(['backbone', 'underscore', 'jquery', 'moment', 'model/MainModel', 'view/graphView', 'view/ui_helpers'], function(Backbone, _, $, moment, MainModel, GraphView) {
        
    var MainView = Backbone.View.extend({

        el: '.viz-shell',

        events: {
        
        },

        initialize: function() {
            this.render();
        },

        render: function() {
            //create a new graph view and pass model/collection on
            this.$el.append('<div class="graph-container"></div>');
            var graphView = new GraphView({
                el : '.graph-container',
                model: this.model,
                collection: this.collection,
                graph: 'weight'
            });
            this.graphView = graphView;

            return this;
        }
    });


    return MainView;
});