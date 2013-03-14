//The build will inline common dependencies into this file.

//For any third party dependencies, like jQuery, place them in the libs folder.

//Configure loading modules from the lib directory,
//except for 'app' ones, which are in a sibling
//directory.
requirejs.config({
    paths: {
        'model'              : 'app/models', //shortcuts for model/view files
        'view'               : 'app/views',
        'jquery'             : 'libs/jquery', //all the libs!
        'jqueryui'           : 'libs/jquery-ui',
        'underscore'         : 'libs/underscore',
        'backbone'           : 'libs/backbone',
        'bootstrap'          : 'libs/bootstrap.min',
        'moment'             : 'libs/moment.min',
        'eve'                : 'libs/raphael/eve', //part of raphael
        'raphael-core'       : 'libs/raphael/raphael.core',
        'raphael-svg'        : 'libs/raphael/raphael.svg',
        'raphael-vml'        : 'libs/raphael/raphael.vml',
        'raphael'            : 'libs/raphael/raphael.amd' //regular raphael & require don't like each other so we have to do this
    },
    shim: {
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
        jqueryui: {
            deps: ['jquery']
        },
        bootstrap: {
            deps: ['jquery']
        },
        raphael: {
            exports : 'Raphael'
        }
    }
});