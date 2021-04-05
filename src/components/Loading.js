import React from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import LottieView from 'lottie-react-native';

export default (props) => {
  const {data} = props;
  return (
    <View
      style={{
        backgroundColor: '#5b97ff',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <LottieView
        source={require('../assets/animations/day-night.json')}
        style={{height: 400}}
        autoPlay
        loop
      />
      <ActivityIndicator size="large" color="white" />
      <Text style={{color: 'white'}}>{data}</Text>
      <View
        style={{
          marginTop: 50,
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
          }}>
          Weather
        </Text>
        <Text
          style={{
            color: 'white',
            fontSize: 15,
          }}>
          by Mohammadreza
        </Text>
      </View>
    </View>
  );
};
