from models import User, Track, Words
from flask.ext.mongoengine.wtf import model_form

#create my forms, pretty stinking easy
TrackForm = model_form(Track, exclude=['timestamp', 'author'])
WordsForm = model_form(Words, exclude=['timestamp', 'author', 'numWords', 'minutes'])
EditForm = model_form(User)
LoginForm = model_form(User)