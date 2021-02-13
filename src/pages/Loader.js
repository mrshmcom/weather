import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  Text,
  View,
  useWindowDimensions,
  Linking,
  Share,
} from 'react-native';
import {Snackbar} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import LottieView from 'lottie-react-native';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import WeatherPage from './Weather';
import SettingPage from './Setting';
import SupportPage from './Support';

import ForecastHelper from '../helpers/Forecast';
import LocationHelper from '../helpers/Location';
import SettingHelper from '../helpers/Setting';

import {SetForecast} from '../store/action/Forecast';
import {SetLocation, SetGeo} from '../store/action/Location';
import {setSetting} from '../store/action/Setting';

const Drawer = createDrawerNavigator();

export default () => {
  const dispatch = useDispatch();
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;

  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [connected, setConnected] = useState(true);

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

  const LoadForecast = async (locationLoad) => {
    try {
      const forecastStore = JSON.parse(await AsyncStorage.getItem('forecast'));
      if (forecastStore) {
        dispatch(SetForecast(forecastStore));
        setLoading(false);
      }

      const forecastFunction = await ForecastHelper.Sync(locationLoad);
      dispatch(SetForecast(forecastFunction));
      console.log(forecastFunction.current);
    } catch (error) {
      throw ('forecast load function ', error);
    }
  };

  const Load = async () => {
    try {
      setFetching(true);

      const settingLoad = await SettingHelper.load();
      dispatch(setSetting(settingLoad));
      console.log('settingLoad', settingLoad);

      const locationLoad = await LocationHelper.load(settingLoad);
      dispatch(SetLocation(locationLoad));
      console.log('locationLoad', locationLoad);

      const geoLocationLoad = await LocationHelper.geoLocation(
        settingLoad,
        locationLoad,
      );
      dispatch(SetGeo(geoLocationLoad));
      console.log('geoLocationLoad', geoLocationLoad);

      await LoadForecast(locationLoad);

      setLoading(false);
    } catch (error) {
      console.log(error);

      setFetching(false);
    }
  };

  useEffect(() => {
    NetInfo.addEventListener((state) => {
      setConnected(state.isInternetReachable);
    });
    Load();
  }, []);

  return (
    <View style={{flex: 1}}>
      {loading ? (
        fetching ? (
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
        ) : !connected ? (
          <View
            style={{
              backgroundColor: '#5b97ff',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <LottieView
              source={require('../assets/animations/no-internet-connection-empty-state.json')}
              style={{width: '100%'}}
              autoPlay
              loop
            />
            <Text style={{color: 'white', marginTop: 20}}>
              No internet connection!
            </Text>
            <TouchableOpacity
              style={{
                marginVertical: 20,
                paddingVertical: 10,
                paddingHorizontal: 30,
                backgroundColor: 'white',
                borderRadius: 5,
              }}
              onPress={() => {
                Load();
              }}>
              <Text style={{color: '#5b97ff'}}>Reload</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: '#5b97ff',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <LottieView
              source={require('../assets/animations/no-data-error.json')}
              style={{width: '75%'}}
              autoPlay
              loop
            />
            <Text style={{color: 'white'}}>
              Unable to fetch data from server!
            </Text>
            <TouchableOpacity
              style={{
                marginVertical: 20,
                paddingVertical: 10,
                paddingHorizontal: 30,
                backgroundColor: 'white',
                borderRadius: 5,
              }}
              onPress={() => {
                Load();
              }}>
              <Text style={{color: '#5b97ff'}}>Reload</Text>
            </TouchableOpacity>
          </View>
        )
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
            <Drawer.Screen
              name="Setting"
              component={SettingPage}
              options={({route}) => ({
                title: 'Setting',
                // headerTitle: (props) => <Navbar {...props} />,
                headerStyle: {
                  backgroundColor: '#5b97ff',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              })}
            />
            <Drawer.Screen
              name="Support"
              component={SupportPage}
              options={({route}) => ({
                title: 'Support',
                // headerTitle: (props) => <Navbar {...props} />,
                headerStyle: {
                  backgroundColor: '#5b97ff',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              })}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      )}
      <Snackbar
        visible={!connected}
        action={{
          label: 'Reload',
          onPress: () => {
            Load();
          },
        }}
        onDismiss={() => {
          console.log('dismiss');
        }}>
        No internet connection!
      </Snackbar>
    </View>
  );
};
