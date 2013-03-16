from flask import g
from app import admin
from app.models import User, Post
from flask.ext.superadmin import model

# Register the admin views/models
class UserAdminModel(model.ModelAdmin):
    list_display = ('name','email', 'last_seen')

    def is_accessible(self):
        return g.user.is_authenticated() and g.user.role == 1 #must be admin

class PostAdminModel(model.ModelAdmin):
    list_display = ('author','timestamp')

    #i'd like to return all of the users posts here instead so the can edit, need to figure out how to do that. But would also need to fix text box thing.

    def is_accessible(self):
        return g.user.is_authenticated() and g.user.role == 1 #must be admin. 


admin.register(User, UserAdminModel)
admin.register(Post, PostAdminModel)
