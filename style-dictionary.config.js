import StyleDictionary from 'style-dictionary';
import { promises as fs } from 'fs';
import path from 'path';

const tokenFiles = await fs.readdir('./tokens');
const jsonFiles = tokenFiles.filter(f => f.endsWith('.json'));

// Tous les fichiers sont chargés ensemble pour résoudre les références
const configs = jsonFiles.map(file => {
  const name = path.basename(file, '.json');
  return {
    source: jsonFiles.map(f => `tokens/${f}`), // tous les fichiers en source
    platforms: {
      web: {
        transformGroup: 'css',
        buildPath: 'build/web/',
        files: [{
          destination: `${name}.css`,
          format: 'css/variables',
          filter: (token) => token.filePath === `tokens/${file}`, // filtre par fichier
        }]
      },
      ios: {
        transformGroup: 'ios-swift',
        buildPath: 'build/ios/',
        files: [{
          destination: `${name}.swift`,
          format: 'ios-swift/class.swift',
          className: name.replace(/[^a-zA-Z0-9]/g, '_'),
          filter: (token) => token.filePath === `tokens/${file}`,
        }]
      },
      android: {
        transformGroup: 'android',
        buildPath: 'build/android/',
        files: [{
          destination: `${name}.xml`,
          format: 'android/resources',
          filter: (token) => token.filePath === `tokens/${file}`,
        }]
      }
    }
  };
});

for (const config of configs) {
  const sd = new StyleDictionary(config);
  await sd.buildAllPlatforms();
}
