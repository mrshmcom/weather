import React from 'react';
import {View} from 'react-native';
import {WebView} from 'react-native-webview';

import NavBar from '../components/NavBar';

import Setting from '../helpers/Setting';

import {SUPPORT_URL} from '@env';

export default (props) => {
  const {navigation} = props;

  return (
    <View style={{backgroundColor: '#fff', width: '100%', height: '100%'}}>
      <NavBar
        navigation={navigation}
        title={Setting.Translate('drawerSupportPage')}
      />
      <WebView
        source={{
          uri: SUPPORT_URL,
        }}
      />
    </View>
  );
};
