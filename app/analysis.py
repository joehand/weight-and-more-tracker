from pandas import Series, rolling_mean, Period, PeriodIndex
from models import Track, DailyAnalysis, Analysis
from decorators import async


@async
def calculate_weightAvg_async(user):
    tracks = Track.objects.order_by('timestamp')
    times = []
    weights = []
    postRef = []

    #Loop through all tracks and create period object for each day
    for track in tracks:
        times.append(Period(track.timestamp, freq='D'))
        weights.append(track.weight)
        postRef.append(track.to_dbref())

    periods = PeriodIndex(times)

    ts = Series(weights, index=periods)
    mean = rolling_mean(ts, 10)

    print mean

    new_Analysis = Analysis(
        author = user
        )

    for i, entry in enumerate(mean):
        my_data = DailyAnalysis (
            weightAvg = entry,
            date = times[i].to_timestamp(),
            postRef = postRef[i]
            )
        new_Analysis.dailyAnalysis.append(my_data)

    new_Analysis.save()

"""
Old version using matplotlib/pylab/numpy:

from __future__ import division
from decorators import async
from pylab import plot, ylim, xlim, show, xlabel, ylabel, grid
from numpy import linspace, loadtxt, ones, convolve
import numpy as numpy

from models import Track, DailyAnalysis, Analysis


def movingaverage(interval, window_size):
    window= numpy.ones(int(window_size))/float(window_size)
    return numpy.convolve(interval, window, 'same')

@async
def calculate_weightAvg_async(user):
    x = []
    y = []
    postRef = []

    data = Track.objects(author=user).order_by('timestamp')

    for track in data:
        x.append(track.timestamp.timetuple().tm_yday)
        y.append(track.weight)
        postRef.append(track.to_dbref())

    y_av = movingaverage(y, 10)

    new_Analysis = Analysis(
        author = user
        )

    for i, avg in enumerate(y_av):
        my_data = DailyAnalysis (
            weightAvg = avg,
            day = x[i],
            postRef = postRef[i]
            )
        print '(' + str(x[i]) + ', ' + str(avg) + ')'    
        new_Analysis.dailyAnalysis.append(my_data)

    new_Analysis.save()
"""