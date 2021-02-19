import React from 'react';
import {Text} from 'react-native';
import {useSelector} from 'react-redux';

export default (props) => {
  const {children, style} = props;

  const settingRedux = useSelector((state) => state.SettingReducer.setting);

  return (
    <Text
      style={[
        {...style},
        {
          fontFamily:
            settingRedux.language === 'fa'
              ? style && style.fontWeight && style.fontWeight === 'bold'
                ? 'IRANSansMobile_Bold'
                : 'IRANSansMobile'
              : null,
          direction: settingRedux.isRTL ? 'rtl' : 'ltr',
        },
      ]}>
      {children}
    </Text>
  );
};
