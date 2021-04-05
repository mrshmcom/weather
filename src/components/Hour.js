import React, {useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import Moment from 'moment';
import Jalali from 'moment-jalaali';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
        paddingVertical: 5,
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
            width: '20%',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
          <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
            {setting.language === 'fa'
              ? Localize.toPersianString(
                  Localize.getWeekDayName(
                    Jalali(data.dt, 'X')
                      .utcOffset(setting.timeZone)
                      .format('HH:mm ddd'),
                  ),
                )
              : Moment(data.dt, 'X')
                  .utcOffset(zone / 60)
                  .format('HH:mm ddd')}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '80%',
          }}>
          <View
            style={{
              alignItems: 'flex-start',
              flexDirection: 'row',
              width: '50%',
              justifyContent: 'flex-end',
            }}>
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
          <View
            style={{
              width: '20%',
              alignContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            {data.weather.map((element, index) => {
              return <Icon type={element.icon} size={30} key={index} />;
            })}
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-end',
              width: '30%',
            }}>
            <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
              {(setting.language === 'fa'
                ? Localize.toPersianString(
                    Math.round(data.temp) +
                      ' (' +
                      Math.round(data.feels_like) +
                      ')',
                  )
                : Math.round(data.temp) +
                  ' (' +
                  Math.round(data.feels_like) +
                  ')') + Unit.sign(setting.unit)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={[
          collapsed ? {minHeight: 100} : {height: 0},
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
                name="weather-cloudy"
                size={14}
                color="white"
              />{' '}
              {Setting.Translate('clouds')}
            </Text>
            <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
              {(setting.language === 'fa'
                ? Localize.toPersianString(data.clouds.toString())
                : data.clouds) + '%'}
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
              {(setting.language === 'fa'
                ? Localize.toPersianString(
                    Math.round(data.pop * 100).toString(),
                  )
                : Math.round(data.pop * 100)) + '%'}
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
                {(setting.language === 'fa'
                  ? Localize.toPersianString(data.rain['1h'].toString())
                  : data.rain['1h']) + ' mm'}
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
                {(setting.language === 'fa'
                  ? Localize.toPersianString(data.snow['1h'].toString())
                  : data.snow['1h']) + ' mm'}
              </Text>
            </View>
          ) : null}
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
              <MaterialCommunityIcons name="eye" size={14} color="white" />{' '}
              {Setting.Translate('visibility')}
            </Text>
            <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
              {(setting.language === 'fa'
                ? Localize.toPersianString(data.visibility.toString())
                : data.visibility) + ' m'}
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
        </View>
      </View>
    </View>
  );
};
