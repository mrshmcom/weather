import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {SUPPORT_URL} from '@env';

export default (props) => {
  const {navigation} = props;

  return (
    <View style={{backgroundColor: '#fff', width: '100%', height: '100%'}}>
      <View
        style={{
          width: '100%',
          height: 45,
          flexDirection: 'row',
          paddingHorizontal: 25,
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#5b97ff',
        }}>
        <TouchableOpacity
          style={{
            width: 35,
            height: 35,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Ionicons name={'ios-arrow-back'} size={20} color="gray" />
        </TouchableOpacity>
        <View
          style={{flex: 1, flexDirection: 'row-reverse', alignItems: 'center'}}>
          <Text size={15} style={{color: 'white'}}>
            Support
          </Text>
        </View>
      </View>
      <WebView
        source={{
          uri: SUPPORT_URL,
        }}
      />
    </View>
  );
};
