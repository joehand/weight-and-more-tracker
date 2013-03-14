define(['backbone', 'underscore', 'jquery', 'view/MainView', 'model/MainModel'], function(Backbone, _, $, MainView, MainModel) {
    
        //Load the bootstrap models (generated in template)
        var posts = new MainModel.Posts(postsBootstrap);
        var user = new MainModel.User(userBootstrap);

        //Start up the main view passing the posts as our collection and user as the model. boom.
        var mainView = new MainView({
            collection : posts,
            model : user
        });
});