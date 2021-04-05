import React, {useState} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import Moment from 'moment';
import Jalali from 'moment-jalaali';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Icon from './Icon';
import Wind from './Wind';

import Setting from '../helpers/Setting';
import Localize from '../helpers/Localize';
import Unit from '../helpers/Unit';

export default (props) => {
  const {data, setting, zone} = props;

  const [collapsed, setCollapsed] = useState(false);

  return (
    <View
      style={{
        flexDirection: 'column',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderColor: 'rgba(255,255,255,0.1)',
        borderBottomWidth: 1,
      }}>
      <TouchableOpacity
        onPress={() => {
          setCollapsed(!collapsed);
        }}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '50%',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
          <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
            {setting.language === 'fa'
              ? Localize.toPersianString(
                  Localize.getMonthName(
                    Localize.getWeekDayName(
                      Jalali(data.dt, 'X')
                        .utcOffset(zone / 60)
                        .format('dddd، jMMMM jD'),
                    ),
                  ),
                )
              : Moment(data.dt, 'X')
                  .utcOffset(zone / 60)
                  .format('dddd, MMMM D')}
          </Text>
          <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
            {data.weather.map((element, index) => {
              return (
                <Text
                  style={{color: 'white', fontFamily: 'IRANSansMobile'}}
                  key={index}>
                  {element.description.charAt(0).toUpperCase() +
                    element.description.slice(1)}
                </Text>
              );
            })}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '50%',
          }}>
          <View
            style={{
              alignContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            {data.weather.map((element, index) => {
              return <Icon type={element.icon} size={50} key={index} />;
            })}
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-end',
              width: '35%',
            }}>
            <Text style={{color: 'lightpink', fontFamily: 'IRANSansMobile'}}>
              {(setting.language === 'fa'
                ? Localize.toPersianString(Math.round(data.temp.max).toString())
                : Math.round(data.temp.max)) + Unit.sign(setting.unit)}
            </Text>
            <Text style={{color: 'aqua', fontFamily: 'IRANSansMobile'}}>
              {(setting.language === 'fa'
                ? Localize.toPersianString(Math.round(data.temp.min).toString())
                : Math.round(data.temp.min)) + Unit.sign(setting.unit)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={[
          collapsed ? {minHeight: 150} : {height: 0},
          {
            alignItems: 'center',
            justifyContent: 'space-between',
            overflow: 'hidden',
            flexDirection: 'row',
          },
        ]}>
        <View style={{width: '47%'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
              <MaterialCommunityIcons
                name="weather-sunset-up"
                size={14}
                color="white"
              />{' '}
              {Setting.Translate('morning')}
            </Text>
            <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
              {(setting.language === 'fa'
                ? Localize.toPersianString(
                    Math.round(data.temp.morn) +
                      ' (' +
                      Math.round(data.feels_like.morn) +
                      ')',
                  )
                : Math.round(data.temp.morn) +
                  ' (' +
                  Math.round(data.feels_like.morn) +
                  ')') + Unit.sign(setting.unit)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
              <MaterialCommunityIcons
                name="weather-sunny"
                size={14}
                color="white"
              />{' '}
              {Setting.Translate('day')}
            </Text>
            <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
              {(setting.language === 'fa'
                ? Localize.toPersianString(
                    Math.round(data.temp.day) +
                      ' (' +
                      Math.round(data.feels_like.day) +
                      ')',
                  )
                : Math.round(data.temp.day) +
                  ' (' +
                  Math.round(data.feels_like.day) +
                  ')') + Unit.sign(setting.unit)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
              <MaterialCommunityIcons
                name="weather-sunset-down"
                size={14}
                color="white"
              />{' '}
              {Setting.Translate('evening')}
            </Text>
            <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
              {(setting.language === 'fa'
                ? Localize.toPersianString(
                    Math.round(data.temp.eve) +
                      ' (' +
                      Math.round(data.feels_like.eve) +
                      ')',
                  )
                : Math.round(data.temp.eve) +
                  ' (' +
                  Math.round(data.feels_like.eve) +
                  ')') + Unit.sign(setting.unit)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
              <MaterialCommunityIcons
                name="weather-night"
                size={14}
                color="white"
              />{' '}
              {Setting.Translate('night')}
            </Text>
            <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
              {(setting.language === 'fa'
                ? Localize.toPersianString(
                    Math.round(data.temp.night) +
                      ' (' +
                      Math.round(data.feels_like.night) +
                      ')',
                  )
                : Math.round(data.temp.night) +
                  ' (' +
                  Math.round(data.feels_like.night) +
                  ')') + Unit.sign(setting.unit)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
              <Ionicons name="ios-water-outline" size={14} color="white" />{' '}
              {Setting.Translate('dewPoint')}
            </Text>
            <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
              {(setting.language === 'fa'
                ? Localize.toPersianString(data.dew_point.toString())
                : data.dew_point) + Unit.sign(setting.unit)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
              <MaterialCommunityIcons
                name="weather-rainy"
                size={14}
                color="white"
              />{' '}
              {Setting.Translate('precipitation')}
            </Text>
            <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
              {' ' +
                (setting.language === 'fa'
                  ? Localize.toPersianString(
                      Math.round(data.pop * 100).toString(),
                    )
                  : Math.round(data.pop * 100)) +
                '%'}
            </Text>
          </View>
          {data.rain ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                <Ionicons name="ios-water" size={14} color="white" />{' '}
                {Setting.Translate('rain')}
              </Text>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                {' ' +
                  (setting.language === 'fa'
                    ? Localize.toPersianString(data.rain.toString())
                    : data.rain) +
                  ' mm'}
              </Text>
            </View>
          ) : null}
          {data.snow ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                <Ionicons name="ios-snow" size={14} color="white" />{' '}
                {Setting.Translate('snow')}
              </Text>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                {' ' +
                  (setting.language === 'fa'
                    ? Localize.toPersianString(data.snow.toString())
                    : data.snow) +
                  ' mm'}
              </Text>
            </View>
          ) : null}
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
              {' ' +
                (setting.language === 'fa'
                  ? Localize.toPersianString(data.clouds.toString())
                  : data.clouds) +
                '%'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
              <MaterialCommunityIcons
                name="weather-windy"
                size={14}
                color="white"
              />{' '}
              {Setting.Translate('wind')}
            </Text>
            <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
              <Wind degree={data.wind_deg} size={14} />
              {' ' +
                (setting.language === 'fa'
                  ? Localize.toPersianString(data.wind_speed.toString())
                  : data.wind_speed) +
                ' ' +
                Unit.speed(setting.unit)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
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
              {(setting.language === 'fa'
                ? Localize.toPersianString(data.humidity.toString())
                : data.humidity) + '%'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
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
              {(setting.language === 'fa'
                ? Localize.toPersianString(data.pressure.toString())
                : data.pressure) + ' hPa'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
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
              {setting.language === 'fa'
                ? Localize.toPersianString(data.uvi.toString())
                : data.uvi}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
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
              {setting.language === 'fa'
                ? Localize.toPersianString(
                    Moment(data.sunrise, 'X')
                      .utcOffset(zone / 60)
                      .format('HH:mm'),
                  )
                : Moment(data.sunrise, 'X')
                    .utcOffset(zone / 60)
                    .format('hh:mm A')}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
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
              {setting.language === 'fa'
                ? Localize.toPersianString(
                    Moment(data.sunset, 'X')
                      .utcOffset(zone / 60)
                      .format('HH:mm'),
                  )
                : Moment(data.sunset, 'X')
                    .utcOffset(zone / 60)
                    .format('hh:mm A')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
