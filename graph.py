from pandas import Series, date_range, rolling_mean, Period, PeriodIndex
from numpy.random import randn
import matplotlib.pyplot as plt

from app.models import Track

tracks = Track.objects.order_by('timestamp')
times = []
weights = []

for track in tracks:
    times.append(Period(track.timestamp, freq='D'))
    weights.append(track.weight)

periods = PeriodIndex(times)

ts = Series(weights, index=periods)
mean = rolling_mean(ts, 10)


plt.figure()
plt.plot(ts, "k.")
plt.plot(mean,"r")
#plt.show()

for i, entry in enumerate(mean):
    print entry
    print times[i].to_timestamp()


"""
from __future__ import division
from pylab import plot, ylim, xlim, show, xlabel, ylabel, grid
from numpy import linspace, loadtxt, ones, convolve
import numpy as numpy


def movingaverage(interval, window_size):
    window= numpy.ones(int(window_size))/float(window_size)
    return numpy.convolve(interval, window, 'same')


y_av = movingaverage(y, 10)
print y_av
print type(y_av)
"""