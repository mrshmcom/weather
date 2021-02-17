import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Picker,
  ScrollView,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, {
  Marker,
  UrlTile,
  AnimatedRegion,
  Animated,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LocationHelper from '../helpers/Location';
import ForecastHelper from '../helpers/Forecast';

import {setSetting} from '../store/action/Setting';
import {SetLocation, SetGeo} from '../store/action/Location';
import {SetForecast} from '../store/action/Forecast';

import legends from '../constants/legends.json';

import {OPEN_WEATHER_API_KEY} from '@env';

export default function Map() {
  const dispatch = useDispatch();

  const settingRedux = useSelector((state) => state.SettingReducer.setting);
  const LocationRedux = useSelector((state) => state.LocationReducer.location);
  const GeoLocationRedux = useSelector((state) => state.LocationReducer.geo);

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [mapTypeState, setMapTypeState] = useState('temp_new');
  const [loading, setLoading] = useState(true);
  const [ZOOM, setZOOM] = useState(1);

  useEffect(() => {
    setLoading(true);

    setLatitude(LocationRedux.latitude);
    setLongitude(LocationRedux.longitude);

    setLoading(false);
  }, [LocationRedux]);

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
        alignItems: 'center',
        backgroundColor: '#5b97ff',
      }}>
      <Animated
        provider={PROVIDER_GOOGLE}
        style={{width: '100%', height: '100%'}}
        onRegionChange={(region) => {
          // console.log(region);
          // setLatitude(region.latitude);
          // setLongitude(region.longitude);
        }}
        // initialRegion={{
        //   latitude: LocationRedux.latitude,
        //   longitude: LocationRedux.longitude,
        //   latitudeDelta: ZOOM,
        //   longitudeDelta: ZOOM,
        // }}
        region={
          new AnimatedRegion({
            latitude: LocationRedux.latitude,
            longitude: LocationRedux.longitude,
            latitudeDelta: 10,
            longitudeDelta: 10,
          })
        }>
        <UrlTile
          urlTemplate={`https://tile.openweathermap.org/map/${mapTypeState}/{z}/{x}/{y}.png?appid=${OPEN_WEATHER_API_KEY}`}
          maximumZ={19}
          flipY={false}
        />
        <Marker
          draggable
          coordinate={{
            latitude: LocationRedux.latitude,
            longitude: LocationRedux.longitude,
          }}
          title={GeoLocationRedux.name}
          description={GeoLocationRedux.name}
          onDragEnd={async (marker) => {
            // console.log(marker.nativeEvent.coordinate);
            // const settingData = {
            //   ...settingRedux,
            //   current: false,
            // };
            // console.log('settingData', settingData);
            // dispatch(setSetting(settingData));
            // await AsyncStorage.setItem('setting', JSON.stringify(settingData));
            // const locationData = {
            //   latitude: marker.nativeEvent.coordinate.latitude,
            //   longitude: marker.nativeEvent.coordinate.longitude,
            // };
            // console.log('locationData', locationData);
            // await AsyncStorage.setItem(
            //   'location',
            //   JSON.stringify(locationData),
            // );
            // dispatch(SetLocation(locationData));
            // const geoLocationLoad = await LocationHelper.geoLocation(
            //   settingRedux,
            //   locationData,
            // );
            // dispatch(SetGeo(geoLocationLoad));
            // console.log('geoLocationLoad', geoLocationLoad);
            // const forecastFunction = await ForecastHelper.Sync(locationData);
            // dispatch(SetForecast(forecastFunction));
          }}
        />
      </Animated>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 5,
          width: '40%',
          height: 50,
          position: 'absolute',
          right: 10,
          top: 10,
        }}>
        <Picker
          selectedValue={mapTypeState}
          style={{height: 50}}
          itemStyle={{}}
          onValueChange={async (itemValue, itemIndex) => {
            setMapTypeState(itemValue);
          }}>
          <Picker.Item label="Temperature (°C)" value="temp_new" />
          <Picker.Item label="Precipitation (mm)" value="precipitation_new" />
          <Picker.Item label="Clouds (%)" value="clouds_new" />
          <Picker.Item label="Sea level pressure (kPa)" value="pressure_new" />
          <Picker.Item label="Wind speed (m/s)" value="wind_new" />
        </Picker>
      </View>
      <View
        style={{
          backgroundColor: 'transparent',
          borderRadius: 5,
          width: 20,
          height: '50%',
          position: 'absolute',
          right: 10,
          bottom: 10,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.1)',
        }}>
        {legends[mapTypeState].map((element) => {
          return (
            <View
              style={{
                width: '100%',
                height: 100 / legends[mapTypeState].length + '%',
                backgroundColor: element.color,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: element.text ? element.text : 'white',
                  fontSize: 8,
                }}>
                {element.value}
              </Text>
            </View>
          );
        })}
      </View>
      {/* <View
        style={{
          backgroundColor: 'white',
          borderRadius: 5,
          width: 40,
          height: 80,
          position: 'absolute',
          right: 10,
          bottom: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            setZOOM(ZOOM / 2);
          }}
          // disabled={ZOOM >= 15}
          style={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0,0,0,0.1)',
          }}>
          <Text>
            <Ionicons
              name="ios-add-circle-outline"
              size={25}
              // color={ZOOM >= 15 ? 'gray' : 'black'}
            />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setZOOM(ZOOM * 2);
          }}
          // disabled={ZOOM <= 3}
          style={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>
            <Ionicons
              name="ios-remove-circle-outline"
              size={25}
              // color={ZOOM <= 3 ? 'gray' : 'black'}
            />
          </Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}
