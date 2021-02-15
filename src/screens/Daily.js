import React, {useState, useEffect} from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
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

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [forecastState, setForecastState] = useState({});
  const [settingState, setSettingState] = useState({});

  const Sync = async () => {
    try {
      setRefreshing(true);

      const locationLoad = await Location.load(settingState);
      dispatch(SetLocation(locationLoad));

      const geoLocationLoad = await Location.geoLocation(
        settingState,
        locationLoad,
      );
      dispatch(SetGeo(geoLocationLoad));

      const forecastFunction = await Forecast.Sync(locationLoad);
      setForecastState(forecastFunction);
      dispatch(SetForecast(forecastFunction));

      setRefreshing(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(true);

    setForecastState(forecastRedux);
    setSettingState(SettingRedux);

    setLoading(false);
  }, [forecastRedux, SettingRedux]);

  return loading ? (
    <View
      style={{
        backgroundColor: '#5b97ff',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" color="white" />
      <Text style={{color: 'white'}}>Loading</Text>
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#5b97ff',
      }}>
      <FlatList
        style={{width: '100%'}}
        contentContainerStyle={{width: '100%'}}
        data={forecastState.daily}
        keyExtractor={(item) => item.dt}
        renderItem={({item, index, separators}) => {
          return <Day data={item} setting={settingState} />;
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
