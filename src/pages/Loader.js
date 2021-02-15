import React, {useEffect, useState} from 'react';
import {View, useWindowDimensions, Linking, Share} from 'react-native';
import {useDispatch} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import WeatherPage from './Weather';
import LocationPage from './Location';
import SettingPage from './Setting';
import SupportPage from './Support';
import AboutPage from './About';

import Loading from '../components/Loading';

import SettingHelper from '../helpers/Setting';

import {setSetting} from '../store/action/Setting';

const Drawer = createDrawerNavigator();

export default () => {
  const dispatch = useDispatch();
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;

  const [loading, setLoading] = useState(true);

  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Share App"
          onPress={() =>
            Share.share({
              message:
                'Ammazing and beautifull weather app. check out this here:' +
                '\n' +
                'https://weather.mrshm.ir',
            })
          }
        />
        <DrawerItem
          label="Website"
          onPress={() => Linking.openURL('https://weather.mrshm.ir')}
        />
      </DrawerContentScrollView>
    );
  };

  const Load = async () => {
    try {
      const settingLoad = await SettingHelper.load();
      dispatch(setSetting(settingLoad));
      console.log('settingLoad', settingLoad);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    Load();
  }, []);

  return (
    <View style={{flex: 1}}>
      {loading ? (
        <Loading />
      ) : (
        <NavigationContainer>
          <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            drawerContentOptions={{
              inactiveTintColor: '#555555',
              activeTintColor: '#000000',
              // itemStyle: {marginVertical: 30},
            }}
            // openByDefault
            overlayColor="rgba(0,0,0,0.5)"
            drawerType={isLargeScreen ? 'permanent' : 'front'}
            drawerStyle={{
              backgroundColor: '#ffffff',
              color: '#ffffff',
              // width: isLargeScreen ? 240 : '100%',
            }}>
            <Drawer.Screen name="Weather" component={WeatherPage} />
            <Drawer.Screen name="Locations" component={LocationPage} />
            <Drawer.Screen name="Setting" component={SettingPage} />
            <Drawer.Screen name="Support" component={SupportPage} />
            <Drawer.Screen name="About" component={AboutPage} />
          </Drawer.Navigator>
        </NavigationContainer>
      )}
    </View>
  );
};
