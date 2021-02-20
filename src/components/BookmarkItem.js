import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import {List} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ForecastHelper from '../helpers/Forecast';

import {setSetting} from '../store/action/Setting';
import {SetLocation, SetGeo} from '../store/action/Location';
import {SetForecast} from '../store/action/Forecast';

export default (props) => {
  const {item, LoadLocations, navigation} = props;
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);

  const settingRedux = useSelector((state) => state.SettingReducer.setting);

  const checkStar = async () => {
    const bookmark = JSON.parse(await AsyncStorage.getItem('bookmark'));
    if (bookmark) {
      const filterBook = bookmark.filter(
        (x) => x.place_name === item.place_name,
      );

      if (filterBook.length > 0) {
      } else {
      }
    } else {
      AsyncStorage.setItem('bookmark', JSON.stringify([]));
    }
  };

  const Delete = async () => {
    let bookmark = JSON.parse(await AsyncStorage.getItem('bookmark'));

    bookmark = bookmark.filter((x) => x.place_name !== item.place_name);

    AsyncStorage.setItem('bookmark', JSON.stringify(bookmark));

    LoadLocations();
  };

  useEffect(() => {
    checkStar();
  }, [item]);

  return refreshing ? (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: '#eeeeee',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 20,
      }}>
      <ActivityIndicator size="small" color="black" style={{marginEnd: 10}} />
      <Text>Loading Data...</Text>
    </View>
  ) : (
    <List.Item
      style={{
        borderTopWidth: 1,
        borderTopColor: '#eeeeee',
      }}
      onPress={async () => {
        setRefreshing(true);
        const settingData = {
          ...settingRedux,
          current: false,
        };
        dispatch(setSetting(settingData));
        AsyncStorage.setItem('setting', JSON.stringify(settingData));

        const locationData = {
          latitude: item.center[1],
          longitude: item.center[0],
        };
        AsyncStorage.setItem('location', JSON.stringify(locationData));
        dispatch(SetLocation(locationData));

        const geoLocationData = {
          name: item.place_name,
          link: `https://www.google.com/maps/@${locationData.latitude},${locationData.longitude},19z`,
        };
        AsyncStorage.setItem('geo', JSON.stringify(geoLocationData));
        dispatch(SetGeo(geoLocationData));

        const forecastFunction = await ForecastHelper.Sync(locationData);
        dispatch(SetForecast(forecastFunction));

        setRefreshing(false);
        navigation.navigate('Weather');
      }}
      title={item.text}
      description={item.place_name}
      left={() => (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 30,
          }}>
          <Ionicons name="ios-location-sharp" size={20} color="gray" />
        </View>
      )}
      right={() => (
        <TouchableOpacity
          onPress={() => {
            Delete();
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 30,
          }}>
          <Ionicons name="ios-trash" size={20} color="red" />
        </TouchableOpacity>
      )}
    />
  );
};
