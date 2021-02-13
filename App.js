/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import Axios from 'axios';

import Loader from './src/pages/Loader';

import ForecastReducer from './src/store/reducer/Forecast';
import LocationReducer from './src/store/reducer/Location';
import SettingReducer from './src/store/reducer/Setting';

Axios.defaults.timeout = 5000;

const App: () => React$Node = () => {
  return (
    <Provider
      store={createStore(
        combineReducers({
          ForecastReducer: ForecastReducer,
          LocationReducer: LocationReducer,
          SettingReducer: SettingReducer,
        }),
        applyMiddleware(thunk),
      )}>
      <StatusBar barStyle="default" backgroundColor="#5b97ff" />
      <Loader />
    </Provider>
  );
};

export default App;
