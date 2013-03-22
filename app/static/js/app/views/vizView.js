define(['backbone', 'jquery', 'view/graphView', 'view/radarView'], function(Backbone, $, GraphView, RadarView) {
        
    var VizView = Backbone.View.extend({

        el: '.viz-shell',

        events: {
        
        },

        initialize: function() {
            if (typeof this.el !== 'undefined') {
                this.render();
            } else {
                this.renderRadars();
            }
        },
        render: function() {
            console.log('vis render');
            //create a new graph view and pass model/collection on
            this.$el.append('<canvas id="graph-container" width="900" height="400"></canvas>');
            var graphView = new GraphView({
                el : '#graph-container',
                collection: this.collection
            });
            this.graphView = graphView;

            this.$el.append('<canvas id="radar-container" width="300" height="300"></canvas>');

            var colLength = this.collection.length;
            var models = this.collection.slice(colLength - 5, colLength);

            console.log(models);

            var radarView = new RadarView({
                el : '#radar-container',
                model: models
            });
            this.radarView = radarView;

            return this;
        },
        renderRadars: function() {
            _.each(this.collection.models, function(model) {
                var id = model.id,
                    $el = $("[data-id='" + id + "']");
                if (typeof $el[0] !== 'undefined') {
                    var radarView = new RadarView({
                        el : $el[0],
                        model: model
                    });
                }
            });


        }
    });


    return VizView;
});