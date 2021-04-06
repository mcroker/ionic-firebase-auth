module.exports = {
  branches: ['master', { name: 'beta', prerelease: true }],
  plugins: [
    "@semantic-release/commit-analyzer",
    ["@semantic-release/npm", {
      "pkgRoot": "./client/dist/ionic-firebase-auth"
    }],
    ["@semantic-release/exec", {
      "successCmd": "./sonar-scanner/sonar-scanner-4.6.0.2311-macosx/bin/sonar-scanner -Dsonar.host.url=https://sonarcloud.io -Dsonar.projectVersion=${nextRelease.version} -Dsonar.branch.name=${options.branch}"
    }]
  ]
};