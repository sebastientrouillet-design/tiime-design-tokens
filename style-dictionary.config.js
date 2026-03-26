export default {
  source: ['tokens/**/*.json'],
  platforms: {
    web: {
      transformGroup: 'css',
      buildPath: 'build/web/',
      files: [{ destination: 'variables.css', format: 'css/variables' }]
    },
    ios: {
      transformGroup: 'ios-swift',
      buildPath: 'build/ios/',
      files: [{ destination: 'DesignTokens.swift', format: 'ios-swift/class.swift', className: 'DesignTokens' }]
    },
    android: {
      transformGroup: 'android',
      buildPath: 'build/android/',
      files: [{ destination: 'tokens.xml', format: 'android/resources' }]
    }
  }
};
