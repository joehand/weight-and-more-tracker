define(['backbone', 'underscore', 'jquery', 'moment', 'chart'], function(Backbone, _, $, Moment, Chart) {

    var GraphView = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this);
            var ctx = this.ctx = this.el.getContext('2d');
            
            this.getData();
            this.$el.css({'margin':'20px auto', 'display':'block'}); //TODO: should be in real css...
            this.render();
        },
        render: function(){
             var data = this.data = {
                labels: this.labels,
                datasets: [
                    {
                        fillColor : "rgba(0,0,0,0)",  
                        strokeColor : "rgba(0,0,0,0)", 
                        pointColor : "rgba(52,73,94,1)",
                        pointStrokeColor : "#fff",
                        data : this.weights
                    },
                    {
                        fillColor : "rgba(151,187,205,0)",  
                        strokeColor : "rgba(26,188,156,1)",
                        pointColor : "rgba(151,187,205,0)",  
                        pointStrokeColor : "rgba(151,187,205,0)", 
                        data : this.avgs
                    }
                ]
            };

            this.chart = new Chart(this.ctx).Line(data);
            return this;
        },
        getData: function() {
            var weights = [],
                avgs = [],
                labels = [];

            _.each(this.collection.models, function(model, i) {
                var weight = model.get('weight'),
                    avg = model.get('weightAvg');

                    //only put some labels in
                    if (i % 3 === 0) {
                        label = Moment(model.get('timestamp')).format('MMM D');
                    } else {
                        label = '';
                    }

                weights.push(weight);
                if (avg === undefined) {
                    avg = avgs[i - 1];
                }
                avgs.push(avg)
                labels.push(label);
            });

            this.weights = weights;
            this.avgs = avgs;
            this.labels = labels;
        }
    });

    return GraphView;
});