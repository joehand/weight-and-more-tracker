define(['backbone', 'underscore', 'jquery', 'moment', 'raphael', 'model/MainModel'], function(Backbone, _, $, Moment, Raphael, MainModel) {
    
    //For now set these here. May change some to be dynamic. 
    var GRAPH_SETTINGS = {
        'width'        : 800,
        'height'       : 250,
        'leftGutter'   : 30,
        'topGutter'    : 20,
        'bottomGutter' : 20,
        'colorHue'     : 0.6 || Math.random(),
        'color'        : 'hsl(' + [this.colorHue, .5, .5] + ')',
        'txt'          : {font: '12px Helvetica, Arial', fill: '#333'}
    }

    var GraphView = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this);
            console.log('initialize view');
            console.log(this, this.collection, this.model);

            this.graphVar = this.options.graph;

            this.initRaphael();
            this.render();
        },
        render: function(){

        },
        initRaphael: function() {
            //add the svg to DOM. Anything else need to happen here?
            this.r = Raphael(this.el, GRAPH_SETTINGS.width, GRAPH_SETTINGS.height);

            var firstDay = _.first(this.collection.models).get('timestamp'),
                totalDays = this.collection.getNumDays(),
                minY = this.collection.getMinVal(this.graphVar),
                maxY = this.collection.getMaxVal(this.graphVar),
                xScale = (GRAPH_SETTINGS.width - GRAPH_SETTINGS.leftGutter) / totalDays,
                yScale = (GRAPH_SETTINGS.height - GRAPH_SETTINGS.bottomGutter) / (maxY - minY);

            //TODO: something like this should probably be the model for the graph view...
            this.config = {
                'firstDay'  : firstDay,
                'totalDays' : totalDays,
                'minY'      : minY,
                'maxY'      : maxY,
                'xScale'    : xScale,
                'yScale'    : yScale
            }

            //drawing some axes
            this.r.path('M' + GRAPH_SETTINGS.leftGutter + ' 0L' + GRAPH_SETTINGS.leftGutter + ' ' + (GRAPH_SETTINGS.height - GRAPH_SETTINGS.bottomGutter) + 'L' + GRAPH_SETTINGS.width + ' ' + (GRAPH_SETTINGS.height - GRAPH_SETTINGS.bottomGutter))
            
            //add the date labels
            this.addLabels();
            //Plot the points!
            this.plotPoints();
        },
        plotPoints: function() {
            var models = this.collection.models,
                firstDay = this.config.firstDay,
                yScale = this.config.yScale,
                xScale = this.config.xScale,
                maxY = this.config.maxY,
                xPos = 0, yPos = 0;

            _.each(models, function(model) {
                day = Math.abs(Moment(firstDay).diff(model.get('timestamp'), 'days'));
                yPos = (maxY - model.get('track').weight) * yScale;
                xPos = xScale * day + GRAPH_SETTINGS.leftGutter;
                this.r.circle(xPos, yPos, 2);
            }, this);

        },
        addLabels: function() {
            //grab every 5 dates
            var days = this.config.totalDays,
                labels = this.r.set(),
                firstDay = this.config.firstDay,
                yScale = this.config.yScale,
                xScale = this.config.xScale,
                yPos = GRAPH_SETTINGS.height, xPos = 0, label;

            //Add a label for every 5 days in total set
            //TODO: Make this dynamic to label dates based on number that fit in graph
            _(days).times(function(n){ 
                if (n % 5 == 0) {
                    label = Moment(firstDay).add('d', n).format('MMM D');
                    xPos = (xScale  * n) + GRAPH_SETTINGS.leftGutter;
                    yPos = GRAPH_SETTINGS.height - 5; //add padding for text
                    labels.push(this.r.text(xPos, yPos, label).attr(GRAPH_SETTINGS.txt));
                }
            }, this);
        }
    });

    return GraphView;
});