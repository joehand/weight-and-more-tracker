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

                //start our index where data starts
                if (i === 0) {
                    prevDay = dayYear - 1;
                }

                if (dayYear > (prevDay + 1)) {
                    //If we miss days, add null entry for each missing day
                    _(dayYear - prevDay).times( function(n) {
                        newModel.timestamp = Moment().dayOfYear(prevDay + 1 + n).format("YYYY-MM-DDTHH:mm:ss");
                        model.real = false; //add a little identifier
                        newModels.push(newModel);
                    });
                }

                //set for next iteration
                prevDay = dayYear;
            });
           this.add(newModels);
        },
        addAnalysis: function(data) {
            _.each(data, function(point) {
                var avg = point.weightAvg,
                    id = point.postRef;

                this.get(id).set('weightAvg', avg);
            }, this);
        }
    });

    return Posts;
});