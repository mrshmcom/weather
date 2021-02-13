import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, Keyboard} from 'react-native';
import {List} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ForecastHelper from '../helpers/Forecast';

import {setSetting} from '../store/action/Setting';
import {SetLocation, SetGeo} from '../store/action/Location';
import {SetForecast} from '../store/action/Forecast';

export default (props) => {
  const {
    item,
    setSearchField,
    setSearchResult,
    setSearchLoading,
    searchInput,
  } = props;
  const dispatch = useDispatch();

  const settingRedux = useSelector((state) => state.SettingReducer.setting);

  const [stared, setStared] = useState(false);

  const checkStar = async () => {
    const bookmark = JSON.parse(await AsyncStorage.getItem('bookmark'));
    if (bookmark) {
      const filterBook = bookmark.filter(
        (x) => x.place_name === item.place_name,
      );

      if (filterBook.length > 0) {
        setStared(true);
      } else {
        setStared(false);
      }
    } else {
      setStared(false);
      await AsyncStorage.setItem('bookmark', JSON.stringify([]));
    }
  };

  const Bookmark = async () => {
    setStared(!stared);
    const bookmark = JSON.parse(await AsyncStorage.getItem('bookmark'));

    bookmark.push(item);

    await AsyncStorage.setItem('bookmark', JSON.stringify(bookmark));
  };

  useEffect(() => {
    checkStar();
  }, [item]);

  return (
    <List.Item
      style={{
        borderTopWidth: 1,
        borderTopColor: '#eeeeee',
      }}
      onPress={async () => {
        setSearchLoading(true);
        Keyboard.dismiss();
        searchInput.current.blur();
        // searchInput.current.clear();
        setSearchField('');
        setSearchResult([]);
        const settingData = {
          ...settingRedux,
          current: false,
        };
        dispatch(setSetting(settingData));
        await AsyncStorage.setItem('setting', JSON.stringify(settingData));

        const locationData = {
          latitude: item.center[1],
          longitude: item.center[0],
        };
        await AsyncStorage.setItem('location', JSON.stringify(locationData));
        dispatch(SetLocation(locationData));

        const geoLocationData = {
          name: item.place_name,
          link: `https://www.google.com/maps/@${locationData.latitude},${locationData.longitude},19z`,
        };
        await AsyncStorage.setItem('geo', JSON.stringify(geoLocationData));
        dispatch(SetGeo(geoLocationData));

        const forecastFunction = await ForecastHelper.Sync(locationData);
        dispatch(SetForecast(forecastFunction));

        setSearchLoading(false);
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
            Bookmark();
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 30,
          }}>
          {stared ? (
            <Ionicons name="star" size={20} color="gold" />
          ) : (
            <Ionicons name="star-outline" size={20} color="gray" />
          )}
        </TouchableOpacity>
      )}
    />
  );
};
