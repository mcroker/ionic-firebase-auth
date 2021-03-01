// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const http = require('http');

exports.config = {
  allScriptsTimeout: 100000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome',
    loggingPrefs: { "driver": "INFO", "browser": "INFO" },
    chromeOptions: {
      args: ['--window-size=1125,2436'] // THIS!
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () { }
  },
  params: {
    bookinfo_stub_url: 'http://localhost:3000',
    firebase_firestore_port: '8080',
    firebase_auth_port: '9099'
  },
  async onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.json')
    });
    await deleteAllEmulatorFirestoreData(browser.params.firebase_firestore_port);
    await deleteAllEmulatorAuthData(browser.params.firebase_auth_port);
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};

function deleteAllEmulatorFirestoreData(firestorePort) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        protocol: 'http:',
        method: 'DELETE',
        hostname: 'localhost',
        port: firestorePort,
        path: '/emulator/v1/projects/readtrack-dev-64a12/databases/(default)/documents'
      },
      res => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          console.log(`Error Deleting fireStore data`);
          console.log(`statusCode: ${res.statusCode}`);
          console.log(`statusMessage: ${res.statusMessage}`);
          reject(res.statusMessage);
        }
      }
    ).end();
  });
}

function deleteAllEmulatorAuthData(authPort) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        protocol: 'http:',
        method: 'DELETE',
        hostname: 'localhost',
        port: authPort,
        path: '/emulator/v1/projects/readtrack-dev-64a12/accounts',
        headers: {
          Authorization: 'Bearer owner'
        }
      },
      res => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          console.log(`Error Deleting fireStore data`);
          console.log(`statusCode: ${res.statusCode}`);
          console.log(`statusMessage: ${res.statusMessage}`);
          reject(res.statusMessage);
        }
      }
    ).end();
  });
}

