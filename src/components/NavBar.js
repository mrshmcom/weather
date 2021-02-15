import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default (props) => {
  const {navigation, title} = props;

  return (
    <View
      style={{
        width: '100%',
        height: 50,
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
          borderRadius: 5,
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
        <Text style={{color: 'white', fontSize: 14}}>{title}</Text>
      </View>
    </View>
  );
};
