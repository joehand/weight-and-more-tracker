from flask import Flask
app = Flask(__name__)
app.config.from_object('config')

from mongoengine import connect
from flask.ext.mongoengine import MongoEngine

#Connect to the DB
app.config['MONGODB_DB'] = app.config['DB_NAME']
connect(app.config['DB_NAME'], host='mongodb://' + app.config['DB_USERNAME'] + ':' + app.config['DB_PASSWORD'] + '@' + app.config['DB_HOST_ADDRESS'])
db = MongoEngine(app)

#login/openid
import os
from flask.ext.login import LoginManager
from flask.ext.openid import OpenID
from config import basedir

lm = LoginManager()
lm.init_app(app)
lm.login_view = 'login'
oid = OpenID(app, os.path.join(basedir, 'tmp'))

#email support
from flask.ext.mail import Mail
mail = Mail(app)

#moment formatting
from momentjs import momentjs
app.jinja_env.globals['momentjs'] = momentjs

#markdown parsing
from flask.ext.markdown import Markdown
Markdown(app)

#Super Admin
from flask.ext.superadmin import Admin

admin = Admin(app, 'My Tracker')

#import final app bits
from app import views, models