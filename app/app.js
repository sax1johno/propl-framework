var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    config = require('./config'),
    requireDir = require('require-dir'),
    async = require('async'),
    _ = require('underscore'),
    url = require('url'),
    sutil = require('util'),
    Router = express.Router,
    flash = require('connect-flash'),
    session = require("express-session"),
    MemStore = session.MemoryStore,
    MongoStore = require('express-session-mongo'),
    routes = requireDir('./components', {recurse: true});

/**
 * Application controllers go here
 **/

var app = express(),
    environment = app.get('env'),
    data = config[environment].data;

console.log("Environment = ", environment);
// Set the configuration of this app based on the current environment.
// You can get the configuration from anywhere by calling app.get('config') or 
// req.app.get('config') in a request.
app.set('config', config[environment]);

// view engine setup
app.set('views', path.join(__dirname, '/components/index/views'));
app.set('view engine', 'jade');

var connectionString = [
    "mongodb://",
    data.mongodb.username,
    ":",
    data.mongodb.password,
    "@",
    data.mongodb.host,
    "/",
    data.mongodb.database
    ].join('');
    
console.log("connection string is", connectionString);
mongoose.connect(connectionString);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(
  {
    secret: '8y3l138ut13je31r13sad13vs8h3ety3r8t13w8weyhel', 
    store: MemStore({
      reapInterval: 60000 * 10
    })
  }
));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// Expose all session messages to the view.
app.use(function(req, res, next) {
  res.locals.messages = req.session.messages
  next()
})

console.log("right before adding routes to the app");

// mount up routes objects here
console.log("Routes = ", routes);

async.each(_.keys(routes), function(component, callback) {
  // Perform operation on file here.
  app.set('components', _.keys(routes));
  console.log("component = ", _.keys(routes[component]));
  async.each(_.keys(routes[component].routes), function(route, cb) {
    console.log("Route is ", routes[component].routes[route]);
    if(component == 'index') {
      app.use('/', routes[component].routes[route]);
    } else {
      // console.log(sutil.inspect(routes[component].routes[route]));
      var thisUrl = "/";
      if (route == "index") {
        thisUrl += component;
        console.log("route = ", thisUrl);
      } else if (route == 'admin') {
        thisUrl += 'admin/' + component;
        console.log("route = ", thisUrl);
      } else if (route == 'api') {
        thisUrl += 'api/' + component;
        console.log("route = ", thisUrl);
      } else {
        thisUrl += component + '/' + route;
        console.log("route = ", thisUrl);
      }
      console.log(
        "Loading", 
        route, 
        "in component", 
        component, 
        "at route ", 
        thisUrl
      );
      
      // console.log(sutil.inspect(routes[component].routes[route]));
      app.use(thisUrl, routes[component].routes[route]);
    }
    cb();
  }, function(err) {
    if (err) {
      callback(err);
    } else {
      
      callback();
    }
  });
}, function(err){
    // if any of the file processing produced an error, err would equal that error
    if( err ) {
      // One of the iterations produced an error.
      // All processing will now stop.
      console.log('Routes failed to process: ', err);
    } else {
      console.log('All routes have been processed successfully.');
    }
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404);
    res.render('404.jade', {title: '404: File Not Found'});
});

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

app.use(function(error, req, res, next) {
  console.log(error);
    res.status(500);
     res.render('500.jade', {title:'500: Internal Server Error', error: error});
  });

module.exports = app;
