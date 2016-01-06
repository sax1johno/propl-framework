/**
 * Gulp is a required tool for the framework to run.  It contains the build rules
 * for all of the components and is run any time a component is added or modified.
 **/

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sync = require('run-sequence'),
    server = require('gulp-express'),
    clean = require('gulp-clean'),
    flatten = require('gulp-flatten'),
    chug = require('gulp-chug'),
    less = require('gulp-less'),
    path = require('path'),
    merge = require('merge-stream'),
    chmod = require('gulp-chmod');

var paths = {
  config: 'app/config.js',
  app: 'app/app.js',
  components: 'app/components/**',
//   app: ['client/app/**/*.{js,styl,html}', 'client/styles/**/*.styl'],
  dest: 'build',
  public: 'public'
};

gulp.task('copyPublic', function(done) {
  return gulp
    .src(['app/**/public/*', '!app/**/public/{vendor,vendor/**}'])
    .pipe(gulp.dest(paths.dest + "/temp"));
});

gulp.task('copyComponents', function() {
    var componentStream = gulp
    .src([
      'app/**/*.js',
      'app/*.js', 
      '!app/**/bin/*', 
      '!app/**/public/**/*',
      '!app/**/models/**/*'
    ])
    .pipe(flatten({ includeParents: 3}))
    .pipe(gulp.dest(paths.dest));
    
    var modelStream = gulp
      .src([
        'app/**/models/**/*'])
      .pipe(flatten({includeParents: 4}))
      .pipe(gulp.dest(paths.dest));
    
    return merge(componentStream, modelStream);
});

gulp.task('copyData', function() {
  var stream = gulp.src(
    [
      "app/**/*.json"
    ]).pipe(flatten())
    .pipe(gulp.dest(paths.dest + "/data"));
});

gulp.task('copyStyles', function() {
  var lessStream = gulp.src(['app/**/*.less', '!app/**/vendor/*', '!app/**/_partials/**'])
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(flatten())
    .pipe(gulp.dest(paths.dest + "/" + paths.public + '/css'));
    
  var cssStream = gulp.src(['app/**/*.css'])
    .pipe(flatten({includeParents: 1}))
    .pipe(gulp.dest(paths.dest + "/" + paths.public + '/css'));
  
  var fontStream = gulp.src(['app/**/fonts/*', '!app/**/vendor/**'])
    .pipe(flatten())
    .pipe(gulp.dest(paths.dest + "/" + paths.public + "/fonts"));
    
  var mergedStyles = merge(lessStream, cssStream);
  mergedStyles = merge(mergedStyles, fontStream);
});

gulp.task('copyViews', function() {
  return gulp.src(['app/**/*.jade', 'app/**/*.html', '!app/**/node_modules/*', '!app/**/public/{vendor,vendor/**}'])
    .pipe(flatten({includeParents: 3}))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('packPublic', function() {
  // First, do all plain javascript
  return gulp.src([
    'app/**/public/**/*.{js,css,jpg,jpeg,png,gif}', 
    '!app/**/public/{vendor,vendor/**}',
    '!app/**/bin/*'
    ])
    .pipe(flatten({ includeParents: -1 }))
    .pipe(gulp.dest(paths.dest + "/" + paths.public));
});

gulp.task('copyVendor', function() {
  // This task will compress all vendor assets into a single .js / .css file.
  // I chose not to use webpack in this case because the way it modifies external
  // plugins may be unpredictable.
  return gulp.src([
    '/app/**/vendor/**/*'])
    .pipe(flatten({includeParents: 3}))
    .pipe(gulp.dest(paths.dest + '/' + paths.public + '/vendor/'));
});

gulp.task('cleanPublic', function() {
  return gulp.src(
    [
      paths.dest + "/components/**/" + paths.public,
      paths.dest + "/temp"
    ])
    .pipe(clean());
});

/** 
 * Make everything in the 'build' folder read-only so we don't accidentally 
 * make changes to those files rather than the 'app' files.
 **/
gulp.task('finalizePermissions', function() {
 
    return gulp.src('build/**/*')
        .pipe(chmod(544))
        .pipe(gulp.dest(paths.dest));
  
});

gulp.task('build', ['copyComponents', 'copyViews'], function(done) {
  // Items that need to be done in series are done here.
  
  sync('copyPublic', 'copyStyles', 'packPublic', 'copyVendor', 'copyData', 'finalizePermissions', done);
  
});

gulp.task('clean', function() {
    return gulp.src('build', {read: false})
        .pipe(clean());
});

// gulp.task('watch', function() {
//   gulp.watch(paths.app, ['build', browser.reload]);
//   gulp.watch(paths.toCopy, ['copy', browser.reload]);
// });

// gulp.task('serve', function() {
//   browser({
//     port: process.env.PORT || 8000,
//     open: false,
//     ghostMode: false,
//     server: {
//       baseDir: 'dist'
//     }
//   });
// });

gulp.task('default', function(done) {
    sync('clean', 'build', done)
    /** Steps for the default task:
     * 
     * 1. run the tests for each component.
     * 2. In each component, grab the 'routes' file and copy it to the 'routes' folder.
     * 3. Grab the 'views' and copy that to the 'views/**' folder, where ** is the name
     *      of the component.
     * 4. ??Run all of the .js/.coffee/etc files through babel??
     **/
});
