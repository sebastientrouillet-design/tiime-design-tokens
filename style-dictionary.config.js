import StyleDictionary from 'style-dictionary';
import { promises as fs } from 'fs';
import path from 'path';

const tokenFiles = await fs.readdir('./tokens');
const jsonFiles = tokenFiles.filter(f => f.endsWith('.json'));

const files = {
  web: jsonFiles.map(file => ({
    destination: `${path.basename(file, '.json')}.css`,
    format: 'css/variables',
    filter: (token) => token.filePath.endsWith(file),
  })),
  ios: jsonFiles.map(file => ({
    destination: `${path.basename(file, '.json')}.swift`,
    format: 'ios-swift/class.swift',
    className: path.basename(file, '.json').replace(/[^a-zA-Z0-9]/g, '_'),
    filter: (token) => token.filePath.endsWith(file),
  })),
  android: jsonFiles.map(file => ({
    destination: `${path.basename(file, '.json')}.xml`,
    format: 'android/resources',
    filter: (token) => token.filePath.endsWith(file),
  })),
};

const sd = new StyleDictionary({
  source: jsonFiles.map(f => `tokens/${f}`),
  log: { verbosity: 'silent' },
  platforms: {
    web: {
      transformGroup: 'css',
      buildPath: 'build/web/',
      files: files.web,
    },
    ios: {
      transformGroup: 'ios-swift',
      buildPath: 'build/ios/',
      files: files.ios,
    },
    android: {
      transformGroup: 'android',
      buildPath: 'build/android/',
      files: files.android,
    },
  }
});

await sd.buildAllPlatforms();
