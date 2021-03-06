from app import api
from models import User, Track, Analysis, DailyAnalysis
from flask.ext.login import current_user

from flask.ext.mongorest import MongoRest
from flask.ext.mongorest.views import ResourceView
from flask.ext.mongorest.resources import Resource
from flask.ext.mongorest import operators as ops
from flask.ext.mongorest.methods import *
from flask.ext.mongorest.authentication import AuthenticationBase

class SessionAuthentication(AuthenticationBase):
    def authorized(self):
        return current_user.is_authenticated()

class BaseResourceView(ResourceView):
    authentication_methods = [SessionAuthentication]

class UserResource(Resource):
    document = User

@api.register(name='api_user', url='/user/')
class UserView(ResourceView):
    resource = UserResource
    methods = [Create, Update, Fetch, List]
    authentication_methods = [SessionAuthentication]

class TrackResource(Resource):
    document = Track
    related_resources = {
        'author': UserResource
    }
    filters = {
        'author_id': [ops.Exact],
    }
    rename_fields = {
        'author': 'author_id',
    }

@api.register(name='api_track', url='/track/')
class TrackView(ResourceView):
    resource = TrackResource
    methods = [Create, Update, Fetch, List]
    authentication_methods = [SessionAuthentication]

class DailyAnalysisResource(Resource):
    document = DailyAnalysis

class AnalysisResource(Resource):
    document = Analysis
    related_resources = {
        'author': UserResource,
        'dailyAnalysis': DailyAnalysisResource
    }
    filters = {
        'author': [ops.Exact],
    }

@api.register(name='api_data', url='/data/')
class AnalysisView(ResourceView):
    resource = AnalysisResource
    methods = [Create, Update, Fetch, List]
    #authentication_methods = [SessionAuthentication]

