from models import User, Track
from flask.ext.mongoengine.wtf import model_form

#create my forms, pretty stinking easy
TrackForm = model_form(Track, exclude=['timestamp', 'author'])
EditForm = model_form(User)
LoginForm = model_form(User)