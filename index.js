/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {manageScript} from './src/lib/repack'
import {name as appName} from './app.json';

manageScript()

AppRegistry.registerComponent(appName, () => App);
