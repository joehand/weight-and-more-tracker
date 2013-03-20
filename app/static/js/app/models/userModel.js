define(['backbone', 'underscore', 'jquery', 'moment'], function(Backbone, _, $, Moment) {
    /*
        Bootstraped Model: 

        user = {
            'name'  : "Joe",
            'email'     : "joe.a.hand@gmail.com",
            'last_seen' : "2013-03-13T00:45:47"
        }
    */
    var User = Backbone.Model.extend ({
        idAttribute: '_id'
    });

    return User;
});