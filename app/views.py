from flask import render_template, flash, redirect, session, url_for, request, g
from flask.ext.login import login_user, logout_user, current_user, login_required

from app import app, db, lm, oid, admin
from forms import EditForm, LoginForm, PostForm, TestForm
from models import User, Post, ROLE_USER, ROLE_ADMIN, TrackingData, Track
from datetime import datetime
from config import POSTS_PER_PAGE

#Add the admin view!
import admin_view


#Index Page w/ Form and some viz
@app.route('/', methods = ['GET', 'POST'])
@login_required
def index():
	form = PostForm()
	if form.validate_on_submit():
		tracking = TrackingData (
				weight = form.tracking.weight.data,
				happy = form.tracking.happy.data,
				diet = form.tracking.diet.data,
				exercise = form.tracking.exercise.data,
				floss = form.tracking.floss.data,
				meditation = form.tracking.meditation.data)
		post = Post(
			note = form.note.data,
			timestamp = datetime.utcnow(),
			author = g.user.to_dbref(),
			tracking = tracking)
		post.save()
		flash('Your post is now live!')
		return redirect(url_for('index'))
	posts = Post.objects(author=g.user)
	return render_template("index.html", 
		title = 'Home',
		form = form,
		posts = posts)


@app.route('/test', methods = ['GET', 'POST'])
@login_required
def test():
	form = TestForm()
	if form.validate_on_submit():
		track = Track (
				author = g.user.to_dbref(),
				note = form.note.data,
				weight = form.weight.data,
				happy = form.happy.data,
				diet = form.diet.data,
				exercise = form.exercise.data,
				floss = form.floss.data,
				meditation = form.meditation.data)
		track.save()
		flash('Your post is now live!')
		return redirect(url_for('test'))
	return render_template("test.html", 
		title = 'Home',
		form = form)


@app.route('/u/<name>')
@login_required
def user(name):
	user = User.objects(name = name).first()
	if user == None:
		flash('User ' + name + ' not found.')
		return redirect(url_for('index'))
	if g.user == user:
		posts = Post.objects(author=user)
		return render_template('user.html',
			user = user, 
			posts = posts)
	flash('You can only look at your own profile.')
	return redirect(url_for('index'))

@app.route('/edit', methods = ['GET', 'POST'])
@login_required
def edit():
	form = EditForm()
	if form.validate_on_submit():
		g.user.name = form.name.data
		g.user.about_me = form.about_me.data
		g.user.save()
		flash('Your changes have been saved.')
		return redirect(url_for('edit'))
	else:
		form.name.data = g.user.name
		form.about_me.data = g.user.about_me
	return render_template('edit.html',
		form = form)

@app.route('/login', methods = ['GET', 'POST'])
@oid.loginhandler
def login():
	if g.user is not None and g.user.is_authenticated():
		return redirect(url_for('index'))
	form = LoginForm()
	if form.validate_on_submit():
		session['remember_me'] = form.remember_me.data
		return oid.try_login(app.config['OPENID_DEFAULT'], ask_for = ['nickname', 'fullname', 'email'])
	return render_template('login.html',
		title = 'Sign In',
		form = form,
		providers = app.config['OPENID_PROVIDERS'])

@app.route('/logout')
def logout():
	logout_user()
	return redirect(url_for('index'))

@oid.after_login
def after_login(resp):
	if resp.email is None or resp.email == "":
		flash('Invalid login. Please try again.')
		redirect(url_for('login'))
	user = User.objects(email = resp.email).first()
	if user is None:
		name = resp.name or resp.fullname
		if name is None or name == "":
			name = resp.email.split('@')[0]
		user = User(name = name, email = resp.email, role = ROLE_USER)
		user.save()
	remember_me = False
	if 'remember_me' in session:
		remember_me = session['remember_me']
		session.pop('remember_me', None)
	login_user(user, remember = remember_me)
	return redirect(request.args.get('next') or url_for('index'))

@app.before_request
def before_request():
	g.user = current_user
	if g.user.is_authenticated():
		g.user.last_seen = datetime.utcnow()
		g.user.save()

#user loader callback function
@lm.user_loader
def load_user(userid):
	return User.objects.get(id = userid)

@app.errorhandler(404)
def internal_error(error):
	return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
	return render_template('500.html'), 500	
