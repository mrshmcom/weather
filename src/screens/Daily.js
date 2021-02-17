import React, {useState} from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import LottieView from 'lottie-react-native';

import Day from '../components/Day';

import Forecast from '../helpers/Forecast';
import Location from '../helpers/Location';

import {SetForecast} from '../store/action/Forecast';
import {SetLocation, SetGeo} from '../store/action/Location';

export default function Daily() {
  const dispatch = useDispatch();

  const forecastRedux = useSelector((state) => state.ForecastReducer.forecast);
  const SettingRedux = useSelector((state) => state.SettingReducer.setting);

  const [refreshing, setRefreshing] = useState(false);

  const Sync = async () => {
    try {
      setRefreshing(true);

      const locationLoad = await Location.load(SettingRedux);
      dispatch(SetLocation(locationLoad));

      const geoLocationLoad = await Location.geoLocation(
        SettingRedux,
        locationLoad,
      );
      dispatch(SetGeo(geoLocationLoad));

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
        justifyContent: 'center',
        backgroundColor: '#5b97ff',
      }}>
      <FlatList
        style={{width: '100%'}}
        contentContainerStyle={{width: '100%'}}
        data={forecastRedux.daily}
        keyExtractor={(item) => item.dt}
        renderItem={({item, index, separators}) => {
          return <Day data={item} setting={SettingRedux} />;
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
              No Data!
            </Text>
            <Text style={{color: 'white'}}>Pull down to refresh.</Text>
          </View>
        }
      />
    </View>
  );
}
