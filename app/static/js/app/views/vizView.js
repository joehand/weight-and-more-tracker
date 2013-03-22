define(['backbone', 'jquery', 'view/graphView'], function(Backbone, $, GraphView) {
        
    var VizView = Backbone.View.extend({

        el: '.viz-shell',

        events: {
        
        },

        initialize: function() {
            this.render();
        },

        render: function() {
            console.log('vis render');
            //create a new graph view and pass model/collection on
            this.$el.append('<canvas id="graph-container" width="900" height="400"></canvas>');
            var graphView = new GraphView({
                el : '#graph-container',
                model: this.model,
                collection: this.collection,
                graph: 'weight'
            });
            this.graphView = graphView;

            return this;
        }
    });


    return VizView;
});