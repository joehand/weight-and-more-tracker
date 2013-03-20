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

    console.log('Starting main viz');
    //Load the bootstrap models (generated in template)
    var posts = new Posts(postsBootstrap);
    var user = new User(userBootstrap);

    posts.url = '/data/?author__exact=' + user.id;
    posts.fetch({update:true, remove: false})

    //Start up the main view passing the posts as our collection and user as the model. boom.

    var vizView = new VizView({
        collection : posts,
        model : user
    });
});