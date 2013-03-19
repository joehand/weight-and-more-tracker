define(['backbone', 'underscore', 'jquery', 'model/MainModel', 'view/vizView', 'view/formView', 'view/momentView'], function(Backbone, _, $, MainModel, VizView, FormView, MomentView) {

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

    if (typeof viz !== 'undefined') {
        console.log('Starting main viz');
        //Load the bootstrap models (generated in template)
        var posts = new MainModel.Posts(postsBootstrap);
        var user = new MainModel.User(userBootstrap);

        //Start up the main view passing the posts as our collection and user as the model. boom.
        var vizView = new VizView({
            collection : posts,
            model : user
        });
        /* 
            sample API call for data! (needs parsing)
        var analysis = new MainModel.Analysis()
        analysis.url = '/data/?author__exact=' + user.id;
        analysis.fetch()
        console.log(analysis)
        */

    }
});