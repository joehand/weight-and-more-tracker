from app.models import User, Post
from flask.ext.mongoengine.wtf import model_form


#create my forms, pretty stinking easy
PostForm = model_form(Post)
EditForm = model_form(User)
LoginForm = model_form(User)