import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default (props) => {
  const {degree, size} = props;

  const arrow = (deg) => {
    let i;
    if (deg >= 0 && deg < 22.5) {
      i = 'arrow-up';
    } else if (deg > 337.5 && deg <= 360) {
      i = 'arrow-up';
    } else if (deg >= 22.5 && deg <= 67.5) {
      i = 'arrow-top-right';
    } else if (deg > 67.5 && deg < 112.5) {
      i = 'arrow-right';
    } else if (deg >= 112.5 && deg <= 157.5) {
      i = 'arrow-bottom-right';
    } else if (deg > 157.5 && deg < 202.5) {
      i = 'arrow-down';
    } else if (deg >= 202.5 && deg <= 247.5) {
      i = 'arrow-bottom-left';
    } else if (deg > 247.5 && deg < 292.5) {
      i = 'arrow-left';
    } else if (deg >= 292.5 && deg <= 337.5) {
      i = 'arrow-top-left';
    }
    return i;
  };

  return (
    <MaterialCommunityIcons name={arrow(degree)} size={size} color="white" />
  );
};
