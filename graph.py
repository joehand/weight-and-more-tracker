from __future__ import division
from pylab import plot, ylim, xlim, show, xlabel, ylabel, grid
from numpy import linspace, loadtxt, ones, convolve
import numpy as numpy

from app.models import Track

def movingaverage(interval, window_size):
    window= numpy.ones(int(window_size))/float(window_size)
    return numpy.convolve(interval, window, 'same')

tracks = Track.objects.order_by('timestamp')
x = []
y = []

for track in tracks:
    x.append(track.timestamp.timetuple().tm_yday)
    y.append(track.weight)

y_av = movingaverage(y, 10)
print y_av
print type(y_av)