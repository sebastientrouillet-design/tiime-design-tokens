import StyleDictionary from 'style-dictionary';
import { promises as fs } from 'fs';
import path from 'path';

const tokenFiles = await fs.readdir('./tokens');

const configs = tokenFiles
  .filter(f => f.endsWith('.json'))
  .map(file => {
    const name = path.basename(file, '.json');
    return {
      source: [`tokens/${file}`],
      platforms: {
        web: {
          transformGroup: 'css',
          buildPath: 'build/web/',
          files: [{
            destination: `${name}.css`,
            format: 'css/variables',
          }]
        },
        ios: {
          transformGroup: 'ios-swift',
          buildPath: 'build/ios/',
          files: [{
            destination: `${name}.swift`,
            format: 'ios-swift/class.swift',
            className: name.replace(/[^a-zA-Z0-9]/g, '_'),
          }]
        },
        android: {
          transformGroup: 'android',
          buildPath: 'build/android/',
          files: [{
            destination: `${name}.xml`,
            format: 'android/resources',
          }]
        }
      }
    };
  });

for (const config of configs) {
  const sd = new StyleDictionary(config);
  await sd.buildAllPlatforms();
}
