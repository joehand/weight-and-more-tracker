define(['backbone', 'underscore', 'moment'], function(Backbone, _, Moment) {
    /*
        Bootstraped Models 

        posts = [
            {
                'content': "some writing",
                'timestamp': "2013-03-11T09:49:37",
                'weight':187.6,
                'diet':6,
                'floss':true,
                'meditation':true,
                'exercise':3,
                'happy':3,
            },
            {
                ...
            }
        ]
    */

    var Post = Backbone.Model.extend ({
        idAttribute: '_id'
    });

    var Posts = Backbone.Collection.extend({
        model: Post,
        initialize: function() {
            this.on("reset", this.addMissingDays);
        },
        comparator: function(post) {
        //sort collection by oldest => newest
            return post.get('timestamp');
        },
        addMissingDays: function() {
        //Update collection to add models for days no data was tracked.
            var prevDay = 0,
                newModels = [];

            _.each(this.models, function(model, i) {
                var dayYear = Moment(model.get('timestamp')).dayOfYear(),
                    newModel = {};

                model.set('real', true);
                if (i === (this.models.length - 1)) {
                    model.set('lastData', true);
                }

                //start our index where data starts
                if (i === 0) {
                    prevDay = dayYear - 1;
                }

                if (dayYear > (prevDay + 1)) {
                    //If we miss days, add null entry for each missing day
                    _(dayYear - (prevDay+1)).times( function(n) {
                        newModel.timestamp = Moment().dayOfYear(prevDay + 1 + n).format("YYYY-MM-DD");
                        newModel.real = false; //add a little identifier
                        newModels.push(newModel);
                    });
                }

                //set for next iteration
                prevDay = dayYear;
            }, this);
           this.add(newModels);
        },
        addAnalysis: function(data) {
            _.each(data, function(point) {
                var avg = point.weightAvg,
                    id = point.postRef;

                this.get(id).set('weightAvg', avg);
            }, this);
        },
        addGoals: function(data) {
            var start = Moment(data.goal.start_date),
                end = Moment(data.goal.end_date),
                goal = data.goal.weight,
                duration = end.diff(start, 'days'),
                models = this.filter( function(model) { return model.get('timestamp') >= start.format("YYYY-MM-DD"); }),
                startWeight = _.find(models, function(model) { return model.get('real'); }).get('weight'),
                dailyChange = Math.abs(startWeight - goal)/duration,
                dailyWeights = [],
                newModels = [];

            if (!startWeight) {
              /*  //goal was set today, add another model for today
                var newModel = {};
                newModel.timestamp = Moment().format("YYYY-MM-DDTHH:mm:ss");
                newModel.real = false; //add a little identifier*/
            }

            _(duration + 1).times(function(n){
                var dayWeight = {};
                if (n === 0) {
                    dayWeight.weight = startWeight;
                    dayWeight.timestamp = start.format("YYYY-MM-DD");
                } else {
                    dayWeight.weight = dailyWeights[n-1].weight - dailyChange;
                    dayWeight.timestamp = Moment(dailyWeights[n-1].timestamp).add('days', 1).format("YYYY-MM-DD") 
                }
                dailyWeights.push(dayWeight);
            });

            _.each(dailyWeights, function(dailyWeight, i) {
                if (models[i]) {
                    models[i].set('targetWeight', dailyWeight.weight);
                } else {
                    var newModel = {};
                    newModel.timestamp = dailyWeight.timestamp;
                    newModel.real = false; //add a little identifier
                    newModel.targetWeight = dailyWeight.weight;
                    newModels.push(newModel);
                }
            }, this);
           this.add(newModels);
        }
    });

    return Posts;
});