define(['backbone', 'underscore', 'jquery', 'moment', 'raphael', 'model/MainModel'], function(Backbone, _, $, Moment, Raphael, MainModel) {
    
    //For now set these here. May change some to be dynamic. 
    var GRAPH_SETTINGS = {
        'width'        : 800,
        'height'       : 250,
        'leftGutter'   : 30,
        'topGutter'    : 20,
        'bottomGutter' : 20,
        'graphPad'     : 10,
        'color'        : '#34495e',
        'txt'          : {font: '12px Helvetica, Arial', fill: '#333'}
    };

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
            //drawing some axes
            this.r.path('M' + GRAPH_SETTINGS.leftGutter + ' 0L' + GRAPH_SETTINGS.leftGutter + ' ' + (GRAPH_SETTINGS.height - GRAPH_SETTINGS.bottomGutter) + 'L' + GRAPH_SETTINGS.width + ' ' + (GRAPH_SETTINGS.height - GRAPH_SETTINGS.bottomGutter))
            
            //add the date labels
            this.addLabels();

            //Plot the points!
            this.plotPoints();

            this.movingAverage();

            return this;
        },
        initRaphael: function() {
            //add the svg to DOM. Anything else need to happen here?
            this.r = Raphael(this.el, GRAPH_SETTINGS.width, GRAPH_SETTINGS.height);

            var firstDay = _.first(this.collection.models).get('timestamp'),
                totalDays = this.collection.getNumDays(),
                minY = this.collection.getMinVal(this.graphVar),
                maxY = this.collection.getMaxVal(this.graphVar),
                xScale = (GRAPH_SETTINGS.width - GRAPH_SETTINGS.leftGutter - (2 * GRAPH_SETTINGS.graphPad)) / totalDays,
                yScale = (GRAPH_SETTINGS.height - GRAPH_SETTINGS.bottomGutter- (2 * GRAPH_SETTINGS.graphPad)) / (maxY - minY);

            //TODO: something like this should probably be the model for the graph view...
            this.config = {
                'firstDay'  : firstDay,
                'totalDays' : totalDays,
                'minY'      : minY,
                'maxY'      : maxY,
                'xScale'    : xScale,
                'yScale'    : yScale,
                'movAvgDays': 10
            };

            
        },
        plotPoints: function() {
            var models = this.collection.models,
                firstDay = this.config.firstDay,
                yScale = this.config.yScale,
                xScale = this.config.xScale,
                maxY = this.config.maxY,
                xPos = 0, yPos = 0;

            _.each(models, function(model) {
                //Index of Model - may vary from ID if we are missing data, so we compare diff in # days
                day = Math.abs(Moment(firstDay).diff(model.get('timestamp'), 'days'));
                //Scale and add a little padding to all sides
                yPos = (maxY - model.get('track')[this.graphVar]) * yScale - GRAPH_SETTINGS.graphPad;
                //Scale, indexed by day. Add padding for sides
                xPos = xScale * day + GRAPH_SETTINGS.leftGutter + GRAPH_SETTINGS.graphPad;
                this.r.circle(xPos, yPos, 2).attr({fill:GRAPH_SETTINGS.color});
            }, this);

        },
        addLabels: function() {
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
                    xPos = (xScale  * n) + GRAPH_SETTINGS.leftGutter + GRAPH_SETTINGS.graphPad;
                    yPos = GRAPH_SETTINGS.height - 5; //add padding for text
                    labels.push(this.r.text(xPos, yPos, label).attr(GRAPH_SETTINGS.txt));
                }
            }, this);
        },
        movingAverage: function() {
            var models = this.collection.models,
                days = this.config.totalDays,
                firstDay = this.config.firstDay,
                yScale = this.config.yScale,
                xScale = this.config.xScale,
                maxY = this.config.maxY,
                movAvgDays = this.config.movAvgDays,
                yPos = 0, xPos = 0,
                prevDayIndex = 0, missingDays = 0,
                avg = 0, trackArray = [], pathStr = '';

            //Add a index to each model for days since start
            this.collection.createDayIndex();

            /* Moving Avg:
                - Go through each of the days since start. 
                - Take first value as average. Subsequently, average with average
                - Once days > 10, days - 10 value from avg (10 day moving avg)
                - Move path on plot accordingly
            */
            _.each(models, function(model) {
                var dayIndex = model.get('dayIndex'),
                    trackVar = model.get('track')[this.graphVar]; //this is our 'n'

                //push tracking varibale to track array
                if (dayIndex > prevDayIndex) {
                    //If we miss days, add null entry
                    _(dayIndex - prevDayIndex).times( function(n) {
                        trackArray.push(null);
                    });
                    trackArray.push(trackVar);
                } else {
                    trackArray.push(trackVar)
                }

                //Grab our first day if we do not have avg
                if (!avg) {
                    avg = trackVar;

                    //start the line on graph
                    //TODO: Make these position functions to call for whole view, not DRY now (& the path drawing?)
                    yPos = (maxY - avg) * yScale - GRAPH_SETTINGS.graphPad;
                    xPos = xScale * dayIndex + GRAPH_SETTINGS.leftGutter + GRAPH_SETTINGS.graphPad;
                    pathStr = 'M' + xPos + ' ' + yPos + 'R ';
                } else {

                    //Moving Average: MA(n) = MA(n-1) - W(n-10)/n + W(n)/n

                    if (_.isUndefined(trackArray[dayIndex - movAvgDays])) {
                        //This happens for the first elements without a history
                        //console.log('undefined avg');

                        //We do a regular average at first.
                        avg = avg + ((trackVar - avg) / dayIndex);
                    } else if (_.isNull(trackArray[dayIndex - movAvgDays])) {
                        //Happens with missing data in middle of series
                        //console.log('null avg');
                        missingDays += 1;
                        avg = avg + ((trackVar - avg) / (movAvgDays - missingDays));
                    } else {
                        //Nice data with a point we can drop
                        //console.log('regular avg');
                        avg = avg - trackArray[dayIndex - movAvgDays]/movAvgDays + trackVar/movAvgDays;

                        //reset our missing day index
                        missingDays = 0;
                    }


                    yPos = (maxY - avg) * yScale - GRAPH_SETTINGS.graphPad;
                    xPos = xScale * dayIndex + GRAPH_SETTINGS.leftGutter + GRAPH_SETTINGS.graphPad;
                    pathStr += xPos + ',' + yPos + ' ';
                }
                
                prevDayIndex = dayIndex + 1; //store for easy indexing of location
            }, this);

            //add to graph
            this.r.path(pathStr).attr({'stroke':GRAPH_SETTINGS.color, 'stroke-width':'2px'});

        }
    });

    return GraphView;
});