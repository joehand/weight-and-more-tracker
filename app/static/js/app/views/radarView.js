define(['backbone', 'underscore', 'jquery', 'moment', 'chart'], function(Backbone, _, $, Moment, Chart) {

    var CHART_OPTIONS = {
        //Boolean - If we want to override with a hard coded scale
        scaleOverride : true,
        //** Required if scaleOverride is true **
        //Number - The number of steps in a hard coded scale
        scaleSteps : 10,
        //Number - The value jump in the hard coded scale
        scaleStepWidth : 1,
        //Number - The centre starting value
        scaleStartValue : 0
    }

    var RadarView = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this);
            var ctx = this.ctx = this.el.getContext('2d');
            
            this.getData();
            this.$el.css({'margin':'10px auto', 'display':'block'}); //TODO: should be in real css...
            this.render();
        },
        render: function(){
             var data = this.data = {
                labels: this.labels,
                datasets: [
                    {
                        fillColor : "rgba(151,187,205,0.5)",
                        strokeColor : "rgba(151,187,205,1)",
                        pointColor : "rgba(151,187,205,1)",
                        pointStrokeColor : "#fff",
                        data : this.dataset
                    }
                ]
            }

            this.chart = new Chart(this.ctx).Radar(data ,CHART_OPTIONS);
            return this;
        },
        getData: function() {
            if (this.model.length > 1) {
                var happy = 0, exercise = 0, diet = 0;
                //average the models
                _.each(this.model, function(model, i) {
                    if (model.get('happy') && model.get('exercise') && model.get('diet')) {
                        happy = happy + (model.get('happy') - happy) / (i + 1);
                        exercise = exercise + (model.get('exercise') - exercise) / (i + 1);
                        diet = diet + (model.get('diet') - diet) / (i + 1);
                    }
                }, this)
                this.dataset = [happy, exercise, diet];
            } else {
                this.dataset = [this.model.get('happy'), this.model.get('exercise'), this.model.get('diet')];
            }
            this.labels = ['Happy', 'Exercise', 'Diet'];
        }
    });

    return RadarView;
});