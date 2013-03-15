define(['backbone', 'underscore', 'jquery', 'moment'], function(Backbone, _, $, Moment) {
    /*
        Bootstraped Models 

        user = {
            'name'  : "Joe",
            'email'     : "joe.a.hand@gmail.com",
            'last_seen' : "2013-03-13T00:45:47"
        }

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
    var User = Backbone.Model.extend ({
        idAttribute: '_id'
    });


    var Post = Backbone.Model.extend ({
        idAttribute: '_id'
    });

    var Posts = Backbone.Collection.extend({
        model: Post,
        comparator: function(post) {
            //sort collection by oldest => newest
            return post.get('timestamp');
        },
        getMaxVal: function(variable) {
            //returns Max in collection of variable from tracking object
            var max = _.max(this.models, function(post){ 
                        return post.get('track')[variable];
                    });

            return max.get('track')[variable];
        },
        getMinVal: function(variable) {
            //returns Min in collection of variable from tracking object
            var min = _.min(this.models, function(post){ 
                        return post.get('track')[variable];
                    });

            return min.get('track')[variable];
        },
        getNumDays: function() {
            //get number of days the collection spans
            var models = this.models,
                d0 = moment(_.first(models).get('timestamp'));
                d1 = moment(_.last(models).get('timestamp'));

            //always want +Num, just in case
            return Math.abs(d0.diff(d1, 'days'));
        }
    });

    var api = {
        'User'  : User,
        'Posts' : Posts
    };

    return api;


});