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
SECRET_KEY = 'a402bg6bsbp&k7y%)nt-9^enu+a00*&*qffbt=2a2(42v@n74s'

OPENID_PROVIDERS = [
    { 'name': 'Google', 'url': 'https://www.google.com/accounts/o8/id' }]

OPENID_DEFAULT = 'https://www.google.com/accounts/o8/id'

# administrator list
ADMINS = ['joe.a.hand@gmail.com']

#pagination (not set up yet)
POSTS_PER_PAGE = 30
