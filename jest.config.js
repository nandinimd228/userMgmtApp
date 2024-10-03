module.exports = {
  preset: 'react-native',
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
  // transform: {
  //   '^.+\\.tsx?$': 'ts-jest',
  //   '^.+\\.jsx?$': 'babel-jest',
  // },
  transformIgnorePatterns: [
    "node_modules/(?!react-native|react-navigation)/",
  ],
  //setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'node'],
};