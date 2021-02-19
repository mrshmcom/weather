import React, {useState, useEffect, useRef} from 'react';
import {
  TouchableOpacity,
  TextInput,
  View,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Snackbar} from 'react-native-paper';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import NetInfo from '@react-native-community/netinfo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Now from '../screens/Now';
import Daily from '../screens/Daily';
import Hourly from '../screens/Hourly';
import Map from '../screens/Map';

import SearchItem from '../components/SearchItem';
import Loading from '../components/Loading';
import Text from '../components/Text';

import Location from '../helpers/Location';
import Forecast from '../helpers/Forecast';
import Setting from '../helpers/Setting';

import {setSetting} from '../store/action/Setting';
import {SetLocation, SetGeo} from '../store/action/Location';
import {SetForecast} from '../store/action/Forecast';

const Tab = createMaterialTopTabNavigator();

export default (props) => {
  const {navigation} = props;
  const dispatch = useDispatch();

  const settingRedux = useSelector((state) => state.SettingReducer.setting);

  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [connected, setConnected] = useState(true);
  const [searchField, setSearchField] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchInput = useRef(null);

  const LoadForecast = async (locationLoad) => {
    try {
      const forecastStore = JSON.parse(await AsyncStorage.getItem('forecast'));
      if (forecastStore) {
        dispatch(SetForecast(forecastStore));
        setLoading(false);
      }

      const forecastFunction = await Forecast.Sync(locationLoad);
      dispatch(SetForecast(forecastFunction));
      console.log(forecastFunction.current);
    } catch (error) {
      throw ('forecast load function ', error);
    }
  };

  const Load = async () => {
    try {
      const locationLoad = await Location.load(settingRedux);
      dispatch(SetLocation(locationLoad));
      console.log('locationLoad', locationLoad);

      const geoLocationLoad = await Location.geoLocation(
        settingRedux,
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

  return loading ? (
    fetching ? (
      <Loading />
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
          {Setting.Translate('noInternetMessage')}
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
          <Text style={{color: '#5b97ff'}}>
            {Setting.Translate('reloadButton')}
          </Text>
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
          {Setting.Translate('noDataMessage')}
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
          <Text style={{color: '#5b97ff'}}>
            {Setting.Translate('reloadButton')}
          </Text>
        </TouchableOpacity>
      </View>
    )
  ) : (
    <View style={{flex: 1}}>
      <View style={{backgroundColor: '#5b97ff', padding: 10, paddingBottom: 0}}>
        <View
          style={{
            backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            borderRadius: 3,
            alignItems: 'center',
          }}>
          <MaterialCommunityIcons
            name="menu"
            size={24}
            color="gray"
            onPress={() => {
              navigation.toggleDrawer();
            }}
          />
          <TextInput
            ref={searchInput}
            placeholder={Setting.Translate('searchPlaceholder')}
            value={searchField}
            onChangeText={async (value) => {
              setSearchField(value);
              if (value.length > 1) {
                setSearchResult(await Location.search(value));
              }
            }}
            style={{
              width: '80%',
              height: 40,
              borderRadius: 5,
              borderWidth: 0,
              // padding: 5,
              backgroundColor: 'white',
              // marginVertical: 5,
            }}
          />
          {searchResult.length > 0 ? (
            <TouchableOpacity
              onPress={() => {
                searchInput.current.clear();
                setSearchResult([]);
                setSearchField('');
                Keyboard.dismiss();
              }}>
              <MaterialCommunityIcons
                name="close-circle"
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          ) : searchLoading ? (
            <ActivityIndicator color="gray" size={24} />
          ) : settingRedux.current ? (
            <TouchableOpacity
              onPress={() => {
                searchInput.current.focus();
              }}>
              <MaterialCommunityIcons name="magnify" size={24} color="gray" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={async () => {
                setSearchLoading(true);
                Keyboard.dismiss();
                searchInput.current.blur();
                searchInput.current.clear();
                setSearchField('');
                setSearchResult([]);
                const settingData = {
                  ...settingRedux,
                  current: true,
                };
                dispatch(setSetting(settingData));
                await AsyncStorage.setItem(
                  'setting',
                  JSON.stringify(settingData),
                );

                const locationLoad = await Location.load(settingData);
                dispatch(SetLocation(locationLoad));

                const geoLocationLoad = await Location.geoLocation(
                  settingData,
                  locationLoad,
                );
                dispatch(SetGeo(geoLocationLoad));

                const forecastFunction = await Forecast.Sync(locationLoad);
                dispatch(SetForecast(forecastFunction));

                setSearchLoading(false);
              }}>
              <MaterialIcons name="my-location" size={24} color="gray" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Tab.Navigator
        initialRouteName="weather"
        tabBarOptions={{
          activeTintColor: 'white',
          labelStyle: {fontSize: 12, fontWeight: 'normal'},
          style: {backgroundColor: '#5b97ff'},
        }}>
        <Tab.Screen
          name="Now"
          component={Now}
          options={{tabBarLabel: Setting.Translate('tabNow')}}
        />
        <Tab.Screen
          name="Hourly"
          component={Hourly}
          options={{tabBarLabel: Setting.Translate('tabHourly')}}
        />
        <Tab.Screen
          name="Daily"
          component={Daily}
          options={{tabBarLabel: Setting.Translate('tabDaily')}}
        />
        <Tab.Screen
          name="Map"
          component={Map}
          options={{tabBarLabel: Setting.Translate('tabMap')}}
        />
      </Tab.Navigator>
      {searchResult.length > 0 ? (
        <View
          style={{
            position: 'absolute',
            top: 50,
            left: 10,
            right: 10,
            zIndex: 1000,
            // maxHeight: '80%',
            backgroundColor: 'white',
            borderBottomRightRadius: 3,
            borderBottomLeftRadius: 3,
          }}>
          {searchResult.map((item, index) => {
            return (
              <SearchItem
                key={index}
                item={item}
                setSearchField={setSearchField}
                setSearchResult={setSearchResult}
                setSearchLoading={setSearchLoading}
                searchInput={searchInput}
              />
            );
          })}
        </View>
      ) : null}
      <Snackbar
        visible={!connected}
        action={{
          label: Setting.Translate('reloadButton'),
          onPress: () => {
            Load();
          },
        }}
        onDismiss={() => {
          console.log('dismiss');
        }}>
        {Setting.Translate('noInternetMessage')}
      </Snackbar>
    </View>
  );
};
