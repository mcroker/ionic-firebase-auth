module.exports = {
  branches: ['master', { name: 'beta', prerelease: true }],
  plugins: ["@semantic-release/npm", {
    "pkgRoot": "dist/npx-firebase"
  }]
};