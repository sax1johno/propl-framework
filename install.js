/**
 * Install scripts are contained within each application component and allow tasks to be run prior to the initial
 * build and run of the application.  This can be helpful for things like generating default
 * users or taxonomy in a the database.
 * 
 * Running this script from the command line will automatically run all of the install
 * scripts encountered in the entire application structure.
 **/

var mongoose = require('mongoose'),
    _ = require('underscore'),
    q = require("q"),
    glob = require('glob'),
    async = require('async');

var express = require('express');

var app = express();

require('./build/app');

var promises = [];

glob("./build/components/*/bin/*.js", function (er, files) {
    if (er) {
        console.log("an error was encountered", er);
    } else {
        console.log("Files = ", files);
        async.eachSeries(files, function(file, callback) {
            console.log("file = ", file);
            console.log("adding ", file, " install script");
            promises.push(require("./" + file)());
            callback();
        }, function(err) {
            if (!err) {
                q.all(promises)
                    .then(function() {
                        console.log("All install scripts were run");
                        process.exit();
                    }, function(err) {
                        console.error("An error was encountered", err);
                        process.exit();
                    });
            } else {
                console.error("Something went wrong: ", err);
                process.exit();
            }
        });
    }
});