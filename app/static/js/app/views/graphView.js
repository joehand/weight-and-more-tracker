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
            this.addLabels();
        },
        addLabels: function() {
            var time = this.collection.models[0].get('timestamp');
            var label = Moment(time).format('MMM D');

            console.log(label);

            var text = this.r.text(50, 50, label).attr(GRAPH_SETTINGS.txt);

            console.log($(text[0].width());
        }
    });

    return GraphView;
});