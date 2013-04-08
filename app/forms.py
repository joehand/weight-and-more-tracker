from models import User, Track
from flask.ext.mongoengine.wtf import model_form

#create my forms, pretty stinking easy
TrackForm = model_form(Track, exclude=['timestamp', 'author'])
EditForm = model_form(User, exclude=['last_seen', 'created_at' , 'role', 'email'], field_args = {
    'goal_date' : {
        'format' : '%Y-%m-%d'
    }
})
LoginForm = model_form(User)