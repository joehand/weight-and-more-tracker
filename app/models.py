from app import db
from hashlib import md5
from datetime import datetime

ROLE_USER = 0
ROLE_ADMIN = 1

class WeightGoal(db.EmbeddedDocument):
    weight_goal = db.FloatField()
    goal_date = db.DateTimeField()
    created_at = db.DateTimeField(default=datetime.utcnow)

    def JSON_goal_start(self):
        return self.created_at.strftime('%Y-%m-%d')

    def JSON_goal_end(self):
        return self.goal_date.strftime('%Y-%m-%d')


class User(db.Document):
    created_at = db.DateTimeField(default=datetime.utcnow)
    name = db.StringField()
    email = db.EmailField()
    role = db.IntField()
    about_me = db.StringField(max_length=140)
    last_seen = db.DateTimeField(default=datetime.utcnow)
    remember_me = db.BooleanField(default = False)
    goal = db.EmbeddedDocumentField(WeightGoal)

    def avatar(self, size):
        return 'http://www.gravatar.com/avatar/' + md5(self.email).hexdigest() + '?d=mm&s=' + str(size)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)

    def JSONTime(self):
        return self.last_seen.strftime('%Y-%m-%d')

    def __unicode__(self):
        return unicode(self.id)

    def __repr__(self):
        return "%s/%s" % (self.id, self.name)

    meta = {
        'indexes': ['-created_at', 'email'],
        'ordering': ['-created_at']
    }

"""
Todo: Implement the TrackingData as a Dynamic Document so users can add/change what they are tracking
    - How does this work with EmbeddedDocument?
    - Need to implement adding fields on the fly in the views
"""
class Track(db.Document):
    author = db.ReferenceField(User)
    note = db.StringField()
    weight = db.FloatField()
    happy = db.IntField()
    diet = db.IntField()
    exercise = db.IntField()
    meditation = db.BooleanField(default = False)
    floss = db.BooleanField(default = False)
    timestamp = db.DateTimeField(default=datetime.utcnow, required=True)

    def __unicode__(self):
        return unicode(self.id)

    def get_id(self):
        return unicode(self.id)

    def JSONTime(self):
        return self.timestamp.strftime('%Y-%m-%d')

    meta = {
        'indexes': ['-timestamp'],
        'ordering': ['-timestamp']
    }

class DailyAnalysis(db.EmbeddedDocument):
    postRef = db.ReferenceField(Track)
    date = db.DateTimeField(required=True)
    weightAvg = db.FloatField()

    def __unicode__(self):
        return unicode(self.postRef)

    def JSONTime(self):
        return self.date.strftime('%Y-%m-%d')

    meta = {
        'indexes': ['-date'],
        'ordering': ['-date']
    }

class Analysis(db.Document):
    author = db.ReferenceField(User)
    dailyAnalysis = db.ListField(db.EmbeddedDocumentField(DailyAnalysis))
    timestamp = db.DateTimeField(default=datetime.utcnow, required=True)

    def __unicode__(self):
        return unicode(self.id)

    meta = {
        'indexes': ['-timestamp'],
        'ordering': ['-timestamp']
    }
