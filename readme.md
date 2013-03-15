##Weight & More Tracker

A basic application to track your weight and a few other items once per day. You can see the app live and start tracking things at [track.joehand.org](http://track.joehand.org/).

### Current Features

* Track things:
    * Weight 
    * Happiness, Exercise, Diet on 1 - 10 scale
    * Did you floss & meditate?
    * Write a note about your day (formatted w/ markdown)
* See the things you have tracked

***(Pretty basic so far!)***

This came about because I was weighing myself every night before bed. Those measurements gave me weight and approximate bedtime. Once it became habitual I added a few other things to help me better reflect on the day. Then I naturally wanted to play with the data!

### Planned-ish Features

These are the things I have thought about tackling. I plan on doing them in order of most exciting => least.

* Add graph for 10-day moving average of weight
* Alerts for when your weight gets above (or below...) a base range.
* More graphs!
* Deeper analysis of relationships between diet/exercise/happiness & weight. 
* NLP on notes
* Dynamic fields so the user can create a set of default fields to see daily and can add any fields on an ad-hoc basis.
* Better UI
* More tracking!!
    * Time standing/sitting at desk
    * Coffee per day
    * Water per day
    * Smiles per day
* Email reminders to track things
* Email alerts when things get out of whack from averages
* [750words](http://750words.com) style daily writing

## Code Description 

The application is written with [Flask](http://flask.pocoo.org/docs/). It uses MongoDB for the database.

***This is my first real Python/Flask app so any suggestions or improvements are welcome.*** 

### Installation Cheat-Sheet

* Get a virtualenv within the project folder & activate it
* Run `pip install -r requirements.txt`
* Rename `config-template.py` to `config.py` and update to reflect your environment (mostly the DB info)
* Start server with `python app.py` or `foreman start`
* Visit [localhost:5000](http://localhost:5000)

### Installation Details

In order to run this application I recommend you have virtualenv installed (see the Flask [installation instructions](http://flask.pocoo.org/docs/installation/)). Once you have a virtual environment inside the project folder, activate it and install all the requirements with `pip install -r requirements.txt`. This will install the Flask & Python extensions used in the project.

You will need to have a running MongoDB either locally or on the interwebs somewhere. Rename the config-template.py file to config.py and update the DB information to reflect your settings.

You have your choice of two servers! The default Flask server is available if you run `python app.py` (from within your venv of course). You can also run `foreman start` to run the Gunicorn server. I use the Flask server for local development and Gunicorn for production. 

Visit the site at [localhost:5000](http://localhost:5000)!

### Front-End Bits

The javascript is all loaded through Require.js. The config.js file sets some handy paths and uses Require's shim to get dependencies worked out. The main fun starts in main.js. Information is bootstraped via Flask into JS models and then used from there, but not for much just yet.

####JS Library List:
* [Require](http://requirejs.org/) for js Modules
* [Backbone](http://backbonejs.org/) for MVC fun
* [Underscore](http://underscorejs.org/) for utilities/backbone
* [Moment](http://momentjs.com/) for time formating/utilities
* [Raphael](http://raphaeljs.com/) for graph/svg stuff
* jQuery
* jQuery-UI and Twitter Bootstrap for the UI 

Notes: 
* Raphael is loaded funny because it doesn't play well with require and thus needs to be split up and tamed. See this [repo](https://github.com/pajtai/raphael-amd). 
* I am using jQuery-UI and Twitter Bootstrap JS because it came with the UI library. I wanted it to look nice and this was a quick plug in. I could downsize a bit here because they are hardly being used. 
* SO many libraries!


####CSS Stuff
I am using SCSS to compile the main.css file. Right now this is done manually. I tried to hook up a flask extension or two to do this and failed/got frustrated. Ideally, I would like to use the SCSS files in development and have live changes. Then in production have flask tell the css to pre-compile.

CSS Libraries:
* Normalize
* Bootstrap
* Flat-UI
* Typeplate

I definitely have quite a lot of overlap in the libraries and need to work on that. But function first, then style. 

## Acknowledgements

Thank you all the smart people who made these libraries and Flask extentions. 

Thank you Google for letting me Google things. 

Thank you much to [this tutorial](http://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world) which helped me on my way with Flask. There are probably quite a few things copied from there...
