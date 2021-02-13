/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Notification from './src/helpers/Notification';

Notification.config();

AppRegistry.registerComponent(appName, () => App);
