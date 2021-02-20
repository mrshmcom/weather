import React, {useState} from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

import Hour from '../components/Hour';

import Forecast from '../helpers/Forecast';
import Location from '../helpers/Location';
import Setting from '../helpers/Setting';

import {SetForecast} from '../store/action/Forecast';
import {SetLocation, SetGeo} from '../store/action/Location';

export default function Hourly() {
  const dispatch = useDispatch();

  const forecastRedux = useSelector((state) => state.ForecastReducer.forecast);
  const SettingRedux = useSelector((state) => state.SettingReducer.setting);

  const [refreshing, setRefreshing] = useState(false);

  const Sync = async () => {
    try {
      setRefreshing(true);

      const locationLoad = await Location.load(SettingRedux);
      dispatch(SetLocation(locationLoad));

      if (SettingRedux.current) {
        const geoLocationLoad = await Location.geoLocation(locationLoad);
        dispatch(SetGeo(geoLocationLoad));
      } else {
        const geoLocationStore = JSON.parse(await AsyncStorage.getItem('geo'));
        dispatch(SetGeo(geoLocationStore));
      }

      const forecastFunction = await Forecast.Sync(locationLoad);
      dispatch(SetForecast(forecastFunction));

      setRefreshing(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5b97ff',
        width: '100%',
      }}>
      <FlatList
        // horizontal={true}
        style={{
          width: '100%',
        }}
        contentContainerStyle={{width: '100%'}}
        data={forecastRedux.hourly}
        keyExtractor={(item) => item.dt}
        renderItem={({item, index, separators}) => {
          return (
            <Hour
              data={item}
              setting={SettingRedux}
              zone={forecastRedux.timezone_offset}
            />
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={Sync} />
        }
        ListEmptyComponent={
          <View
            style={{
              alignItems: 'center',
            }}>
            <LottieView
              source={require('../assets/animations/no-data-error.json')}
              style={{width: '75%'}}
              autoPlay
              loop
            />
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>
              {Setting.Translate('noData')}
            </Text>
            <Text style={{color: 'white'}}>
              {Setting.Translate('pullDownRefresh')}
            </Text>
          </View>
        }
      />
    </View>
  );
}
