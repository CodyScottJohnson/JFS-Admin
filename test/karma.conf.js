// Karma configuration
// Generated on 2016-05-20

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      'jasmine'
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/ng-idle/angular-idle.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/moment/moment.js',
      'bower_components/lodash/lodash.js',
      'bower_components/angular-bootstrap-contextmenu/contextMenu.js',
      'bower_components/angular-filter/dist/angular-filter.js',
      'bower_components/angular-scroll-glue/src/scrollglue.js',
      'bower_components/angular-toastr/dist/angular-toastr.tpls.js',
      'bower_components/angular-moment/angular-moment.js',
      'bower_components/angular-summernote/dist/angular-summernote.js',
      'bower_components/angular-xeditable/dist/js/xeditable.js',
      'bower_components/blob-polyfill/Blob.js',
      'bower_components/file-saver.js/FileSaver.js',
      'bower_components/angular-file-saver/dist/angular-file-saver.bundle.js',
      'bower_components/angular-fullscreen/src/angular-fullscreen.js',
      'bower_components/Chart.js/Chart.js',
      'bower_components/angular-chart.js/dist/angular-chart.js',
      'bower_components/angular-file-upload/dist/angular-file-upload.min.js',
      'bower_components/angular-sortable-view/src/angular-sortable-view.js',
      'bower_components/ng-tags-input/ng-tags-input.js',
      'bower_components/angular-ui-switch/angular-ui-switch.js',
      'bower_components/angular-local-storage/dist/angular-local-storage.js',
      'bower_components/ng-cropper/dist/ngCropper.all.js',
      'bower_components/numbro/numbro.js',
      'bower_components/pikaday/pikaday.js',
      'bower_components/zeroclipboard/dist/ZeroClipboard.js',
      'bower_components/handsontable/dist/handsontable.js',
      'bower_components/ngHandsontable/dist/ngHandsontable.js',
      'bower_components/angular-svg-round-progressbar/build/roundProgress.js',
      'bower_components/chartist/dist/chartist.js',
      'bower_components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
