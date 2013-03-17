from app.models import User, Post, Track
from flask.ext.mongoengine.wtf import model_form

#create my forms, pretty stinking easy
PostForm = model_form(Post)
EditForm = model_form(User)
LoginForm = model_form(User)
TestForm = model_form(Track, exclude=['timestamp', 'author'])