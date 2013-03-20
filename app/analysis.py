from __future__ import division
from decorators import async
from pylab import plot, ylim, xlim, show, xlabel, ylabel, grid
from numpy import linspace, loadtxt, ones, convolve
import numpy as numpy

from models import Track, DailyAnalysis, Analysis


def movingaverage(interval, window_size):
    window= numpy.ones(int(window_size))/float(window_size)
    return numpy.convolve(interval, window, 'same')

"""
This is way too expensive right now...
"""
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