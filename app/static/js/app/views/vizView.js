define(['backbone', 'jquery', 'moment', 'view/graphView', 'view/radarView'], function(Backbone, $, Moment, GraphView, RadarView) {
        
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
            var graphView, radarView, radarModels;
            //create a new graph view and pass model/collection on
            this.$el.append('<canvas id="graph-container" width="900" height="400"></canvas>');
            graphView = new GraphView({
                el : '#graph-container',
                collection: this.collection
            });
            this.graphView = graphView;

            this.$el.append('<canvas id="radar-container" width="300" height="300"></canvas>');

            radarModels = this.collection.filter( function(model) {
                return Moment().subtract('days', 7).format("YYYY-MM-DD") < model.get('timestamp') && Moment().format("YYYY-MM-DD") >= model.get('timestamp'); 
            });

            radarView = new RadarView({
                el : '#radar-container',
                model: radarModels
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