const StyleDictionary = require('style-dictionary');
const fs = require('fs');
const path = require('path');

const tokenFiles = fs.readdirSync('./tokens');
const jsonFiles = tokenFiles.filter(f => f.endsWith('.json'));

jsonFiles.forEach(file => {
  const name = path.basename(file, '.json');
  const sd = StyleDictionary.extend({
    source: jsonFiles.map(f => `tokens/${f}`),
    platforms: {
      web: {
        transformGroup: 'css',
        buildPath: 'build/web/',
        files: [{
          destination: `${name}.css`,
          format: 'css/variables',
          filter: (token) => token.filePath.endsWith(file),
        }]
      },
      ios: {
        transformGroup: 'ios-swift',
        buildPath: 'build/ios/',
        files: [{
          destination: `${name}.swift`,
          format: 'ios-swift/class.swift',
          className: name.replace(/[^a-zA-Z0-9]/g, '_'),
          filter: (token) => token.filePath.endsWith(file),
        }]
      },
      android: {
        transformGroup: 'android',
        buildPath: 'build/android/',
        files: [{
          destination: `${name}.xml`,
          format: 'android/resources',
          filter: (token) => token.filePath.endsWith(file),
        }]
      }
    }
  });
  sd.buildAllPlatforms();
});
