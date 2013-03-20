define(['backbone', 'underscore', 'jquery', 'moment'], function(Backbone, _, $, Moment) {
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
        comparator: function(post) {
            //sort collection by oldest => newest
            return post.get('timestamp');
        },
        createDayIndex: function() {
            var day = 0;
            _.each(this.models, function(model) {
                day = this.getNumDays(model.id);
                model.set('dayIndex', day);
            }, this);
        },
        getMaxVal: function(variable) {
            //returns Max in collection of variable from tracking object
            var max = _.max(this.models, function(post){ 
                        return post.get(variable);
                    });

            return max.get(variable);
        },
        getMinVal: function(variable) {
            //returns Min in collection of variable from tracking object
            var min = _.min(this.models, function(post){ 
                        return post.get(variable);
                    });

            return min.get(variable);
        },
        getNumDays: function(modelID) {
            //get number of days the collection spans or difference in days with input model
            var models = this.models,
                d0 = Moment(_.first(models).get('timestamp'));

                if (modelID) {
                    d1 = Moment(this.get(modelID).get('timestamp'));
                } else {
                    d1 = Moment(_.last(models).get('timestamp'));
                }

            //always want +Num, just in case
            return Math.abs(d0.diff(d1, 'days'));
        }
    });

    return Posts;


});