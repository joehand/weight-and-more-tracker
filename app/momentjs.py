from jinja2 import Markup

"""
Gives a nice little shortcut for formatting time then adding the right class to have Moment.js parse it
"""

class momentjs:
	def __init__(self, timestamp):
		self.timestamp = timestamp

	def render(self, format):
		return Markup("<span class=\"moment %s\">%s</span>" % (format, self.timestamp.strftime("%Y-%m-%dT%H:%M:%S Z")))

	def format(self, fmt):
		return self.render("format(\"moment %s\")" % fmt)

	def calendar(self):
		return self.render("calendar")

	def fromNow(self):
		return self.render("fromNow")