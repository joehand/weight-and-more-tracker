from app import db
from hashlib import md5
from datetime import datetime

ROLE_USER = 0
ROLE_ADMIN = 1


class User(db.Document):
    created_at = db.DateTimeField(default=datetime.now)
    name = db.StringField()
    email = db.EmailField()
    role = db.IntField()
    about_me = db.StringField(max_length=140)
    last_seen = db.DateTimeField(default=datetime.now)
    remember_me = db.BooleanField(default = False)

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
        return self.last_seen.strftime('%Y-%m-%dT%H:%M:%S')

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
class TrackingData(db.EmbeddedDocument):
    weight = db.FloatField()
    happy = db.IntField()
    diet = db.IntField()
    exercise = db.IntField()
    meditation = db.BooleanField(default = False)
    floss = db.BooleanField(default = False)

class Post(db.Document):
    author = db.ReferenceField(User)
    note = db.StringField()
    tracking = db.EmbeddedDocumentField(TrackingData)
    timestamp = db.DateTimeField(default=datetime.now, required=True)

    def __unicode__(self):
        return unicode(self.id)

    def get_id(self):
        return unicode(self.id)

    def JSONTime(self):
        return self.timestamp.strftime('%Y-%m-%dT%H:%M:%S')

    meta = {
        'indexes': ['-timestamp'],
        'ordering': ['-timestamp']
    }