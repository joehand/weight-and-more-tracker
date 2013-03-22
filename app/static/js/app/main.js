define(['backbone', 'underscore', 'jquery', 'model/userModel', 'model/postModel', 'view/vizView', 'view/formView', 'view/momentView'], function(Backbone, _, $, User, Posts, VizView, FormView, MomentView) {

    if ($('form').length) {
        var formView = new FormView({
            el: 'form'
        });
    }

    if ($('.moment').length) {
        var momentView = new MomentView({
            el: '.moment'
        });
    }

    // Make sure we have bootstrapped models
    if (typeof postsBootstrap !== 'undefined') {
        console.log('Starting main viz');
        //Load the bootstrap models (generated in template)
        var user = new User(userBootstrap);
        var posts = new Posts();
        posts.reset(postsBootstrap);
        posts.addAnalysis(dailyAnalysis);
        //Start up the main view passing the posts as our collection and user as the model. boom.

        var vizView = new VizView({
            collection : posts,
            model : user
        });  
    }
});