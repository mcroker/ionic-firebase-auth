// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-junit-reporter'),
      require('karma-spec-reporter'),
      require('karma-verbose-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    // coverage reporter generates the coverage
    reporters: ['progress', 'coverage'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'src/**/*.js': ['coverage'],
      'capacitor/src/**/*.js': ['coverage'],
      'iap/src/**/*.js': ['coverage'],
      'ionic/src/**/*.js': ['coverage'],
      'ionic-auth-ui/src/**/*.js': ['coverage']
    },

    // optionally, configure the reporter
    coverageReporter: {
      type: 'lcov',
      dir: 'reports',
      subdir: 'coverage'
    },
    /* coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../reports/coverage'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    }, */
    junitReporter: {
      outputDir: 'reports/junit', // results will be saved as $outputDir/$browserName.xml
      outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
      suite: '', // suite will become the package name attribute in xml testsuite element
      useBrowserName: true, // add browser name to report and classes names
      nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
      classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
      properties: {}, // key value pair of properties to add to the <properties> section of the report
      xmlVersion: null // use '1' if reporting to be per SonarQube 6.2 XML format
    },
    reporters: ['kjhtml', 'junit', 'spec', 'coverage'],  // progress
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome', 'HeadlessChrome'],
    singleRun: false,
    customLaunchers: {
      HeadlessChrome: {
        base: "ChromeHeadless",
        flags: [
          "--no-sandbox", // required to run without privileges in Docker
          "--disable-web-security",
          "--disable-gpu",
          "--remote-debugging-port=9222"
        ]
      }
    },
  });
};
