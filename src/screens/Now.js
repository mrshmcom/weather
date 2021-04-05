import React, {useState, useEffect} from 'react';
import {
  RefreshControl,
  ScrollView,
  View,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
  Text,
} from 'react-native';
import Moment from 'moment';
import Jalali from 'moment-jalaali';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LineChart} from 'react-native-chart-kit';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Forecast from '../helpers/Forecast';
import Location from '../helpers/Location';
import Setting from '../helpers/Setting';
import Localize from '../helpers/Localize';
import Unit from '../helpers/Unit';

import Icon from '../components/Icon';
import Wind from '../components/Wind';

import {SetForecast} from '../store/action/Forecast';
import {SetLocation, SetGeo} from '../store/action/Location';

export default () => {
  const dispatch = useDispatch();

  const forecastRedux = useSelector((state) => state.ForecastReducer.forecast);
  const geoLocationRedux = useSelector((state) => state.LocationReducer.geo);
  const LocationRedux = useSelector((state) => state.LocationReducer.location);
  const SettingRedux = useSelector((state) => state.SettingReducer.setting);

  const [refreshing, setRefreshing] = useState(false);
  const [stared, setStared] = useState(false);

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

  const checkStar = async () => {
    const bookmark = JSON.parse(await AsyncStorage.getItem('bookmark'));
    if (bookmark) {
      const filterBook = bookmark.filter(
        (x) => x.place_name === geoLocationRedux.name,
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
  };

  const Bookmark = async () => {
    setStared(true);
    const bookmark = JSON.parse(await AsyncStorage.getItem('bookmark'));

    bookmark.push({
      center: [LocationRedux.longitude, LocationRedux.latitude],
      place_name: geoLocationRedux.name,
      text: geoLocationRedux.name,
    });

    AsyncStorage.setItem('bookmark', JSON.stringify(bookmark));

    ToastAndroid.show(
      'Bookmarked Succeccfuly',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const UnBookmark = async () => {
    setStared(false);
    const bookmark = JSON.parse(await AsyncStorage.getItem('bookmark'));

    const filterBook = bookmark.filter(
      (x) => x.place_name !== geoLocationRedux.name,
    );

    AsyncStorage.setItem('bookmark', JSON.stringify(filterBook));

    ToastAndroid.show(
      'Removed Succeccfuly',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  useEffect(() => {
    checkStar();
  }, [geoLocationRedux]);

  return (
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
                marginHorizontal: 5,
                direction: 'ltr',
                fontFamily: 'IRANSansMobile',
              }}>
              {geoLocationRedux.name}
            </Text>
            <View>
              {stared ? (
                <TouchableOpacity
                  onPress={() => {
                    UnBookmark();
                  }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 30,
                  }}>
                  <Ionicons name="star" size={16} color="gold" />
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
                  <Ionicons name="star-outline" size={16} color="gold" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="ios-time-outline" size={16} color="white" />
            <Text
              style={{
                fontFamily: 'IRANSansMobile',
                color: 'white',
                textAlign: 'center',
                marginLeft: 5,
                direction: 'ltr',
              }}>
              {SettingRedux.timeZone !== forecastRedux.timezone
                ? Setting.Translate('zone') + ': '
                : ''}
              {SettingRedux.language === 'fa'
                ? Localize.getMonthName(
                    Localize.getWeekDayName(
                      Localize.toPersianString(
                        Jalali(forecastRedux.current.dt, 'X')
                          .utcOffset(forecastRedux.timezone_offset / 60)
                          .format('dddd، jD jMMMM، HH:mm'),
                      ),
                    ),
                  )
                : Moment(forecastRedux.current.dt, 'X')
                    .utcOffset(forecastRedux.timezone_offset / 60)
                    .format('ddd, MMM Do, h:mm a')}
            </Text>
          </View>
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
            {forecastRedux.current.weather.map((element, index) => {
              return <Icon type={element.icon} key={index} size={100} />;
            })}
          </View>
          <View
            style={{
              alignItems: 'flex-start',
              marginLeft: 10,
              flexDirection: 'row',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 75,
                fontFamily: 'IRANSansMobile',
              }}>
              {SettingRedux.language === 'fa'
                ? Localize.toPersianString(
                    Math.round(forecastRedux.current.temp).toString(),
                  )
                : Math.round(forecastRedux.current.temp)}
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: 25,
                marginTop: 10,
                fontFamily: 'IRANSansMobile',
              }}>
              {Unit.sign(SettingRedux.unit)}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 20,
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
            {Setting.Translate('feelsLike') +
              ' ' +
              (SettingRedux.language === 'fa'
                ? Localize.toPersianString(
                    Math.round(forecastRedux.current.feels_like).toString(),
                  )
                : Math.round(forecastRedux.current.feels_like)) +
              Unit.sign(SettingRedux.unit)}
          </Text>
          <View style={{flexDirection: 'row'}}>
            {forecastRedux.current.weather.map((element, index) => {
              return (
                <Text
                  style={{
                    color: 'white',
                    marginHorizontal: 2,
                    fontFamily: 'IRANSansMobile',
                  }}
                  key={index}>
                  {element.description.charAt(0).toUpperCase() +
                    element.description.slice(1)}
                </Text>
              );
            })}
          </View>
        </View>
        {forecastRedux.alerts && forecastRedux.alerts.length > 0
          ? forecastRedux.alerts.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    width: Dimensions.get('window').width - 40,
                    marginTop: 50,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    marginHorizontal: 20,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    backgroundColor: 'red',
                    borderRadius: 10,
                  }}>
                  <View style={{flexDirection: 'row', width: '100%'}}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '25%',
                      }}>
                      <Ionicons
                        name="ios-alert-circle"
                        size={50}
                        color="white"
                      />
                    </View>
                    <View style={{width: '75%', alignItems: 'flex-start'}}>
                      <Text
                        style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                        {Setting.Translate('alert') + ': ' + item.event}
                      </Text>
                      <Text
                        style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                        {Setting.Translate('from') +
                          ': ' +
                          (SettingRedux.language === 'fa'
                            ? Localize.getMonthName(
                                Localize.getWeekDayName(
                                  Localize.toPersianString(
                                    Jalali(item.start, 'X')
                                      .utcOffset(
                                        forecastRedux.timezone_offset / 60,
                                      )
                                      .format('dddd، jD jMMMM، HH:mm'),
                                  ),
                                ),
                              )
                            : Moment(item.start, 'X')
                                .utcOffset(forecastRedux.timezone_offset / 60)
                                .format('ddd, MMM Do, h:mm a'))}
                      </Text>
                      <Text
                        style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                        {Setting.Translate('to') +
                          ': ' +
                          (SettingRedux.language === 'fa'
                            ? Localize.getMonthName(
                                Localize.getWeekDayName(
                                  Localize.toPersianString(
                                    Jalali(item.end, 'X')
                                      .utcOffset(
                                        forecastRedux.timezone_offset / 60,
                                      )
                                      .format('dddd، jD jMMMM، HH:mm'),
                                  ),
                                ),
                              )
                            : Moment(item.end, 'X')
                                .utcOffset(forecastRedux.timezone_offset / 60)
                                .format('ddd, MMM Do, h:mm a'))}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      height: 1,
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      marginVertical: 10,
                    }}
                  />
                  <View>
                    <Text
                      style={{
                        textAlign: 'justify',
                        color: 'white',
                        fontFamily: 'IRANSansMobile',
                      }}>
                      {item.sender_name +
                        ': ' +
                        item.description.replace(/\n/g, '')}
                    </Text>
                  </View>
                </View>
              );
            })
          : null}
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
            {forecastRedux.current.rain ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 5,
                }}>
                <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                  <Ionicons name="ios-water" size={14} color="white" />{' '}
                  {Setting.Translate('rain')}
                </Text>
                <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                  {(SettingRedux.language === 'fa'
                    ? Localize.toPersianString(
                        forecastRedux.current.rain['1h'].toString(),
                      )
                    : forecastRedux.current.rain['1h']) + ' mm'}
                </Text>
              </View>
            ) : null}
            {forecastRedux.current.snow ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 5,
                }}>
                <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                  <Ionicons name="ios-snow" size={14} color="white" />{' '}
                  {Setting.Translate('snow')}
                </Text>
                <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                  {(SettingRedux.language === 'fa'
                    ? Localize.toPersianString(
                        forecastRedux.current.snow['1h'].toString(),
                      )
                    : forecastRedux.current.snow['1h']) + ' mm'}
                </Text>
              </View>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                <Ionicons name="ios-water-outline" size={14} color="white" />{' '}
                {Setting.Translate('dewPoint')}
              </Text>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                {(SettingRedux.language === 'fa'
                  ? Localize.toPersianString(
                      forecastRedux.current.dew_point.toString(),
                    )
                  : forecastRedux.current.dew_point) +
                  Unit.sign(SettingRedux.unit)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                <MaterialCommunityIcons
                  name="air-humidifier"
                  size={14}
                  color="white"
                />{' '}
                {Setting.Translate('humidity')}
              </Text>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                {(SettingRedux.language === 'fa'
                  ? Localize.toPersianString(
                      forecastRedux.current.humidity.toString(),
                    )
                  : forecastRedux.current.humidity) + '%'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                <MaterialCommunityIcons
                  name="weather-cloudy"
                  size={14}
                  color="white"
                />{' '}
                {Setting.Translate('clouds')}
              </Text>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                {(SettingRedux.language === 'fa'
                  ? Localize.toPersianString(
                      forecastRedux.current.clouds.toString(),
                    )
                  : forecastRedux.current.clouds) + '%'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                <MaterialCommunityIcons
                  name="weather-windy"
                  size={14}
                  color="white"
                />{' '}
                {Setting.Translate('wind')}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Wind degree={forecastRedux.current.wind_deg} size={14} />
                <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                  {' ' +
                    (SettingRedux.language === 'fa'
                      ? Localize.toPersianString(
                          forecastRedux.current.wind_speed.toString(),
                        )
                      : forecastRedux.current.wind_speed) +
                    ' ' +
                    Unit.speed(SettingRedux.unit)}
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
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                <MaterialCommunityIcons
                  name="coolant-temperature"
                  size={14}
                  color="white"
                />{' '}
                {Setting.Translate('pressure')}
              </Text>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                {(SettingRedux.language === 'fa'
                  ? Localize.toPersianString(
                      forecastRedux.current.pressure.toString(),
                    )
                  : forecastRedux.current.pressure) + ' hPa'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                <MaterialCommunityIcons
                  name="weather-sunny-alert"
                  size={14}
                  color="white"
                />{' '}
                {Setting.Translate('uvIndex')}
              </Text>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                {SettingRedux.language === 'fa'
                  ? Localize.toPersianString(
                      forecastRedux.current.uvi.toString(),
                    )
                  : forecastRedux.current.uvi}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                <MaterialCommunityIcons name="eye" size={14} color="white" />{' '}
                {Setting.Translate('visibility')}
              </Text>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                {(SettingRedux.language === 'fa'
                  ? Localize.toPersianString(
                      forecastRedux.current.visibility.toString(),
                    )
                  : forecastRedux.current.visibility) + ' m'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                <MaterialCommunityIcons
                  name="weather-sunset-up"
                  size={14}
                  color="white"
                />{' '}
                {Setting.Translate('sunrise')}
              </Text>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                {SettingRedux.language === 'fa'
                  ? Localize.toPersianString(
                      Moment(forecastRedux.current.sunrise, 'X')
                        .utcOffset(forecastRedux.timezone_offset / 60)
                        .format('HH:mm'),
                    )
                  : Moment(forecastRedux.current.sunrise, 'X')
                      .utcOffset(forecastRedux.timezone_offset / 60)
                      .format('h:mm A')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                <MaterialCommunityIcons
                  name="weather-sunset-down"
                  size={14}
                  color="white"
                />{' '}
                {Setting.Translate('sunset')}
              </Text>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                {SettingRedux.language === 'fa'
                  ? Localize.toPersianString(
                      Moment(forecastRedux.current.sunset, 'X')
                        .utcOffset(forecastRedux.timezone_offset / 60)
                        .format('HH:mm'),
                    )
                  : Moment(forecastRedux.current.sunset, 'X')
                      .utcOffset(forecastRedux.timezone_offset / 60)
                      .format('h:mm A')}
              </Text>
            </View>
          </View>
        </View>
        {forecastRedux.minutely ? (
          <View
            style={{
              marginVertical: 30,
              paddingBottom: 10,
              paddingHorizontal: 0,
              backgroundColor: '#fff',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'IRANSansMobile_Bold',
                color: '#5b97ff',
                marginVertical: 10,
              }}>
              {Setting.Translate('precipitationVolume')}
            </Text>
            <LineChart
              bezier
              data={{
                labels: forecastRedux.minutely.map((minute, index) => {
                  return index % 5 === 0
                    ? Moment(minute.dt, 'X')
                        .utcOffset(forecastRedux.timezone_offset / 60)
                        .format('HH:mm')
                    : '';
                }),
                datasets: [
                  {
                    data: forecastRedux.minutely.map((minute, index) => {
                      return minute.precipitation;
                    }),
                  },
                ],
              }}
              width={Dimensions.get('window').width - 20} // from react-native
              height={220}
              // yAxisLabel="prep"
              yAxisSuffix="mm"
              yAxisInterval={5} // optional, defaults to 1
              // xAxisLabel=""
              verticalLabelRotation={-90}
              horizontalLabelRotation={0}
              fromZero={false}
              xLabelsOffset={15}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientFromOpacity: 1,
                backgroundGradientTo: '#fff',
                backgroundGradientToOpacity: 1,
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(91, 151, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(91, 151, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '2',
                  strokeWidth: '0',
                  stroke: '#5b97ff',
                },
              }}
            />
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};
