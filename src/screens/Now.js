import React, {useState, useEffect} from 'react';
import {
  RefreshControl,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import Moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Forecast from '../helpers/Forecast';
import Location from '../helpers/Location';
import Unit from '../helpers/Unit';

import Icon from '../components/Icon';
import Wind from '../components/Wind';

import {SetForecast} from '../store/action/Forecast';
import {SetLocation, SetGeo} from '../store/action/Location';

export default () => {
  const dispatch = useDispatch();

  const forecastRedux = useSelector((state) => state.ForecastReducer.forecast);
  const geoLocationRedux = useSelector((state) => state.LocationReducer.geo);
  const SettingRedux = useSelector((state) => state.SettingReducer.setting);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [geoState, setGeoState] = useState({});
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
      dispatch(SetForecast(forecastFunction));
      setForecastState(forecastFunction);

      setRefreshing(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(true);

    setForecastState(forecastRedux);
    setGeoState(geoLocationRedux);
    setSettingState(SettingRedux);

    setLoading(false);
  }, [forecastRedux, SettingRedux, geoLocationRedux]);

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
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#5b97ff',
        height: '100%',
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={Sync} />
      }>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          paddingTop: 30,
          paddingBottom: 30,
        }}>
        <View
          style={{
            alignItems: 'center',
            marginBottom: 30,
            maxWidth: '75%',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="ios-location-sharp" size={16} color="white" />
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                marginLeft: 5,
                direction: 'ltr',
              }}>
              {geoState.name}
            </Text>
          </View>
          <Text style={{color: 'white', textAlign: 'center'}}>
            {Moment(forecastState.current.dt, 'X').format(
              'ddd, MMM Do, h:mm a',
            )}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View
            style={{
              justifyContent: 'center',
              marginRight: 10,
              flexDirection: 'row',
            }}>
            {forecastState.current.weather.map((element, index) => {
              return <Icon type={element.icon} key={index} size={100} />;
            })}
          </View>
          <View
            style={{
              alignItems: 'flex-start',
              marginLeft: 10,
              flexDirection: 'row',
            }}>
            <Text style={{color: 'white', fontSize: 75}}>
              {Math.round(forecastState.current.temp)}
            </Text>
            <Text style={{color: 'white', fontSize: 25, marginTop: 10}}>
              {Unit.sign(settingState.unit)}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 20,
            alignItems: 'center',
          }}>
          <Text style={{color: 'white'}}>
            Feels Like {Math.round(forecastState.current.feels_like)}
            {Unit.sign(settingState.unit)}
          </Text>
          <View style={{flexDirection: 'row'}}>
            {forecastState.current.weather.map((element, index) => {
              return (
                <Text style={{color: 'white', marginHorizontal: 2}} key={index}>
                  {element.description.charAt(0).toUpperCase() +
                    element.description.slice(1)}
                </Text>
              );
            })}
          </View>
        </View>
        <View
          style={{
            width: '100%',
            marginTop: 50,
            paddingHorizontal: 20,
            alignItems: 'center',
            justifyContent: 'space-between',
            overflow: 'hidden',
            flexDirection: 'row',
          }}>
          <View style={{width: '47%'}}>
            {forecastState.current.rain ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 5,
                }}>
                <Text style={{color: 'white'}}>
                  <Ionicons name="ios-water" size={14} color="white" /> Rain
                </Text>
                <Text style={{color: 'white'}}>
                  {forecastState.current.rain['1h'] + ' mm'}
                </Text>
              </View>
            ) : null}
            {forecastState.current.snow ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 5,
                }}>
                <Text style={{color: 'white'}}>
                  <Ionicons name="ios-snow" size={14} color="white" /> Snow
                </Text>
                <Text style={{color: 'white'}}>
                  {forecastState.current.snow['1h'] + ' mm'}
                </Text>
              </View>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white'}}>
                <Ionicons name="ios-water-outline" size={14} color="white" />{' '}
                Dew Point
              </Text>
              <Text style={{color: 'white'}}>
                {forecastState.current.dew_point + Unit.sign(settingState.unit)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white'}}>
                <MaterialCommunityIcons
                  name="air-humidifier"
                  size={14}
                  color="white"
                />{' '}
                Humidity
              </Text>
              <Text style={{color: 'white'}}>
                {forecastState.current.humidity + '%'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white'}}>
                <MaterialCommunityIcons
                  name="weather-cloudy"
                  size={14}
                  color="white"
                />{' '}
                Clouds
              </Text>
              <Text style={{color: 'white'}}>
                {forecastState.current.clouds + '%'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white'}}>
                <MaterialCommunityIcons
                  name="weather-windy"
                  size={14}
                  color="white"
                />{' '}
                Wind
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Wind degree={forecastState.current.wind_deg} size={14} />
                <Text style={{color: 'white'}}>
                  {' ' +
                    forecastState.current.wind_speed +
                    ' ' +
                    Unit.speed(settingState.unit)}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              height: '100%',
              width: 1,
              backgroundColor: 'rgba(255,255,255,0.1)',
            }}
          />
          <View style={{width: '47%'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white'}}>
                <MaterialCommunityIcons
                  name="coolant-temperature"
                  size={14}
                  color="white"
                />{' '}
                Pressure
              </Text>
              <Text style={{color: 'white'}}>
                {forecastState.current.pressure + ' hPa'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white'}}>
                <MaterialCommunityIcons
                  name="weather-sunny-alert"
                  size={14}
                  color="white"
                />{' '}
                UV Index
              </Text>
              <Text style={{color: 'white'}}>{forecastState.current.uvi}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white'}}>
                <MaterialCommunityIcons name="eye" size={14} color="white" />{' '}
                Visibility
              </Text>
              <Text style={{color: 'white'}}>
                {forecastState.current.visibility + ' m'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white'}}>
                <MaterialCommunityIcons
                  name="weather-sunset-up"
                  size={14}
                  color="white"
                />{' '}
                Sunrise
              </Text>
              <Text style={{color: 'white'}}>
                {Moment(forecastState.current.sunrise, 'X').format('h:mm A')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white'}}>
                <MaterialCommunityIcons
                  name="weather-sunset-down"
                  size={14}
                  color="white"
                />{' '}
                Sunset
              </Text>
              <Text style={{color: 'white'}}>
                {Moment(forecastState.current.sunset, 'X').format('h:mm A')}
              </Text>
            </View>
          </View>
        </View>
        {forecastState.minutely ? (
          <View
            style={{
              marginTop: 50,
              marginBottom: 20,
              height: 100,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
            }}>
            {forecastState.minutely.map((minute, index) => {
              return (
                <View
                  key={minute}
                  style={{
                    height: '100%',
                    width: `${100 / forecastState.minutely.length}%`,
                    justifyContent: 'flex-end',
                  }}>
                  {index % 2 === 0 ? (
                    <Text
                      style={{
                        fontSize: 5,
                        color: 'white',
                        marginBottom: 5,
                        transform: [{rotate: '-90deg'}],
                      }}>
                      {Math.round(minute.precipitation)}
                    </Text>
                  ) : null}
                  <View
                    style={{
                      width: `100%`,
                      height: minute.precipitation * 10,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderTopWidth: 1,
                      borderTopColor: 'rgba(255,255,255,0.2)',
                      borderBottomWidth: 1,
                      borderBottomColor: 'rgba(255,255,255,0.2)',
                    }}
                  />
                  <View style={{height: 30}}>
                    {index % 2 === 0 ? (
                      <Text
                        style={{
                          fontSize: 5,
                          color: 'white',
                          marginTop: 5,
                          transform: [{rotate: '-90deg'}],
                        }}>
                        {Moment(minute.dt, 'X').format('m')}
                      </Text>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};
