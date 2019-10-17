/**
 * @format
 */

import 'react-native-gesture-handler';
import TrackPlayer from 'react-native-track-player';

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

TrackPlayer.registerPlaybackService(() => require('./app/player-service/service.js'));
// TrackPlayer.updateOptions({
//     stopWithApp: true,
//     capabilities: [
//       TrackPlayer.CAPABILITY_PLAY,
//       TrackPlayer.CAPABILITY_PAUSE,
//       TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
//       TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
//       TrackPlayer.CAPABILITY_STOP
//     ],
//     compactCapabilities: [
//       TrackPlayer.CAPABILITY_PLAY,
//       TrackPlayer.CAPABILITY_PAUSE
//     ]
// });
