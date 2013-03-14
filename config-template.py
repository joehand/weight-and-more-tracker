"""
These are the basic config settings. Update these to reflect your environment.
"""

#Get our Base Directory
import os
basedir = os.path.abspath(os.path.dirname(__file__))

#MongoDB Info
DB_NAME = 'My_Awesome_DB'
DB_USERNAME = 'me'
DB_PASSWORD = 'password123'
DB_HOST_ADDRESS = ''

#Forms Config
CSRF_ENABLED = True
SECRET_KEY = 'this-is-my-super-secret-key'

#You can add other OPENID Providers here but they aren't set up to work currently.
OPENID_PROVIDERS = [
    { 'name': 'Google', 'url': 'https://www.google.com/accounts/o8/id' }]

#This is only here becase of a TODO. Need to make login form nicer.
OPENID_DEFAULT = 'https://www.google.com/accounts/o8/id'

# Administrator list. Maybe will be emailed for errors, eventually.
ADMINS = ['you@place.com']