import React from 'react';
import LottieView from 'lottie-react-native';

export default (props) => {
  const {type, size} = props;

  const icon = (condition) => {
    let i;
    switch (condition) {
      case '01d':
        i = require('../assets/animations/sunny.json');
        break;
      case '01n':
        i = require('../assets/animations/night.json');
        break;
      case '02d':
        i = require('../assets/animations/partly-cloudy.json');
        break;
      case '02n':
        i = require('../assets/animations/cloudynight.json');
        break;
      case '03d':
        i = require('../assets/animations/windy.json');
        break;
      case '03n':
        i = require('../assets/animations/windy.json');
        break;
      case '04d':
        i = require('../assets/animations/windy.json');
        break;
      case '04n':
        i = require('../assets/animations/windy.json');
        break;
      case '09d':
        i = require('../assets/animations/partly-shower.json');
        break;
      case '09n':
        i = require('../assets/animations/rainynight.json');
        break;
      case '10d':
        i = require('../assets/animations/partly-shower.json');
        break;
      case '10n':
        i = require('../assets/animations/rainynight.json');
        break;
      case '11d':
        i = require('../assets/animations/storm.json');
        break;
      case '11n':
        i = require('../assets/animations/storm.json');
        break;
      case '13d':
        i = require('../assets/animations/snow.json');
        break;
      case '13n':
        i = require('../assets/animations/snow.json');
        break;
      case '50d':
        i = require('../assets/animations/mist.json');
        break;
      case '50n':
        i = require('../assets/animations/mist.json');
        break;
    }
    return i;
  };

  return (
    <LottieView source={icon(type)} style={{height: size}} autoPlay loop />
  );
};
