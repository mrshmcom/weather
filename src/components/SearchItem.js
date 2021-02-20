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
    try {
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
        AsyncStorage.setItem('bookmark', JSON.stringify([]));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Bookmark = async () => {
    try {
      setStared(true);
      const bookmark = JSON.parse(await AsyncStorage.getItem('bookmark'));

      bookmark.push(item);

      AsyncStorage.setItem('bookmark', JSON.stringify(bookmark));
    } catch (error) {
      console.log(error);
    }
  };

  const UnBookmark = async () => {
    try {
      setStared(false);
      const bookmark = JSON.parse(await AsyncStorage.getItem('bookmark'));

      const filterBook = bookmark.filter(
        (x) => x.place_name !== item.place_name,
      );

      AsyncStorage.setItem('bookmark', JSON.stringify(filterBook));
    } catch (error) {
      console.log(error);
    }
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
        try {
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

          setSearchLoading(false);
        } catch (error) {
          setSearchLoading(false);
          console.log(error);
        }
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
      right={() =>
        stared ? (
          <TouchableOpacity
            onPress={() => {
              UnBookmark();
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 30,
            }}>
            <Ionicons name="star" size={20} color="gold" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              Bookmark();
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 30,
            }}>
            <Ionicons name="star-outline" size={20} color="gray" />
          </TouchableOpacity>
        )
      }
    />
  );
};
