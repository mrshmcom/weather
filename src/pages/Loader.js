import React, {useEffect, useState} from 'react';
import {View, useWindowDimensions, Linking, Share, Text} from 'react-native';
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

import Setting from '../helpers/Setting';

import {setSetting} from '../store/action/Setting';

const Drawer = createDrawerNavigator();

export default (prop) => {
  const {style} = prop;
  const dispatch = useDispatch();
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 1000;

  const [loading, setLoading] = useState(true);

  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label={() => {
            return (
              <Text style={{fontFamily: 'IRANSansMobile'}}>
                {Setting.Translate('drawerSharePage')}
              </Text>
            );
          }}
          onPress={() =>
            Share.share({
              message:
                Setting.Translate('shareAppMessage') +
                '\n' +
                'https://weather.mrshm.ir',
            })
          }
        />
        <DrawerItem
          label={() => {
            return (
              <Text style={{fontFamily: 'IRANSansMobile'}}>
                {Setting.Translate('drawerWebsitePage')}
              </Text>
            );
          }}
          onPress={() => Linking.openURL('https://weather.mrshm.ir')}
        />
      </DrawerContentScrollView>
    );
  };

  const Load = async () => {
    try {
      const settingLoad = await Setting.load();
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
    <View style={[style, {flex: 1}]}>
      {loading ? (
        <Loading data="Loading Settings" />
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
            <Drawer.Screen
              name="Weather"
              component={WeatherPage}
              options={{
                drawerLabel: () => {
                  return (
                    <Text style={{fontFamily: 'IRANSansMobile'}}>
                      {Setting.Translate('drawerWeatherPage')}
                    </Text>
                  );
                },
              }}
            />
            <Drawer.Screen
              name="Locations"
              component={LocationPage}
              options={{
                drawerLabel: () => {
                  return (
                    <Text style={{fontFamily: 'IRANSansMobile'}}>
                      {Setting.Translate('drawerLocationPage')}
                    </Text>
                  );
                },
              }}
            />
            <Drawer.Screen
              name="Setting"
              component={SettingPage}
              options={{
                drawerLabel: () => {
                  return (
                    <Text style={{fontFamily: 'IRANSansMobile'}}>
                      {Setting.Translate('drawerSettingPage')}
                    </Text>
                  );
                },
              }}
            />
            <Drawer.Screen
              name="Support"
              component={SupportPage}
              options={{
                drawerLabel: () => {
                  return (
                    <Text style={{fontFamily: 'IRANSansMobile'}}>
                      {Setting.Translate('drawerSupportPage')}
                    </Text>
                  );
                },
              }}
            />
            <Drawer.Screen
              name="About"
              component={AboutPage}
              options={{
                drawerLabel: () => {
                  return (
                    <Text style={{fontFamily: 'IRANSansMobile'}}>
                      {Setting.Translate('drawerAboutPage')}
                    </Text>
                  );
                },
              }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      )}
    </View>
  );
};
