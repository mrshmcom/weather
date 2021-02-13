import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Icon from './Icon';
import Wind from './Wind';

import Unit from '../helpers/Unit';

export default (props) => {
  const {data, setting} = props;

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
          }}>
          <Text style={{color: 'white'}}>
            {Moment(data.dt, 'X').format('dddd, MMMM D')}
          </Text>
          <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
            {data.weather.map((element, index) => {
              return (
                <Text style={{color: 'white'}} key={index}>
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
              return <Icon type={element.icon} size={50} />;
            })}
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-end',
              width: '35%',
            }}>
            <Text style={{color: 'white'}}>
              {Math.round(data.temp.max) + Unit.sign(setting.unit)}
            </Text>
            <Text style={{color: 'white'}}>
              {Math.round(data.temp.min) + Unit.sign(setting.unit)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          overflow: 'hidden',
          height: collapsed ? 170 : 0,
          flexDirection: 'row',
        }}>
        <View style={{width: '47%'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'white'}}>
              <MaterialCommunityIcons
                name="weather-sunset-up"
                size={14}
                color="white"
              />{' '}
              Morning
            </Text>
            <Text style={{color: 'white'}}>
              {Math.round(data.temp.morn) +
                ' (' +
                Math.round(data.feels_like.morn) +
                ')' +
                Unit.sign(setting.unit)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'white'}}>
              <MaterialCommunityIcons
                name="weather-sunny"
                size={14}
                color="white"
              />{' '}
              Day
            </Text>
            <Text style={{color: 'white'}}>
              {Math.round(data.temp.day) +
                ' (' +
                Math.round(data.feels_like.day) +
                ')' +
                Unit.sign(setting.unit)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'white'}}>
              <MaterialCommunityIcons
                name="weather-sunset-down"
                size={14}
                color="white"
              />{' '}
              Evening
            </Text>
            <Text style={{color: 'white'}}>
              {Math.round(data.temp.eve) +
                ' (' +
                Math.round(data.feels_like.eve) +
                ')' +
                Unit.sign(setting.unit)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'white'}}>
              <MaterialCommunityIcons
                name="weather-night"
                size={14}
                color="white"
              />{' '}
              Night
            </Text>
            <Text style={{color: 'white'}}>
              {Math.round(data.temp.night) +
                ' (' +
                Math.round(data.feels_like.night) +
                ')' +
                Unit.sign(setting.unit)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'white'}}>
              <Ionicons name="ios-water-outline" size={14} color="white" /> Dew
              Point
            </Text>
            <Text style={{color: 'white'}}>
              {data.dew_point + Unit.sign(setting.unit)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'white'}}>
              <MaterialCommunityIcons
                name="weather-rainy"
                size={14}
                color="white"
              />{' '}
              Precipitation
            </Text>
            <Text style={{color: 'white'}}>
              {' ' + Math.round(data.pop * 100) + '%'}
            </Text>
          </View>
          {data.rain ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: 'white'}}>
                <Ionicons name="ios-water" size={14} color="white" /> Rain
              </Text>
              <Text style={{color: 'white'}}>{' ' + data.rain + ' mm'}</Text>
            </View>
          ) : null}
          {data.snow ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: 'white'}}>
                <Ionicons name="ios-snow" size={14} color="white" /> Snow
              </Text>
              <Text style={{color: 'white'}}>{' ' + data.snow + ' mm'}</Text>
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
            <Text style={{color: 'white'}}>
              <MaterialCommunityIcons
                name="weather-cloudy"
                size={14}
                color="white"
              />{' '}
              Cloudiness
            </Text>
            <Text style={{color: 'white'}}>{' ' + data.clouds + '%'}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'white'}}>
              <MaterialCommunityIcons
                name="weather-windy"
                size={14}
                color="white"
              />{' '}
              Wind
            </Text>
            <Text style={{color: 'white'}}>
              <Wind degree={data.wind_deg} size={14} />
              {' ' + data.wind_speed + ' ' + Unit.speed(setting.unit)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'white'}}>
              <MaterialCommunityIcons
                name="air-humidifier"
                size={14}
                color="white"
              />{' '}
              Humidity
            </Text>
            <Text style={{color: 'white'}}>{data.humidity + '%'}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'white'}}>
              <MaterialCommunityIcons
                name="coolant-temperature"
                size={14}
                color="white"
              />{' '}
              Pressure
            </Text>
            <Text style={{color: 'white'}}>{data.pressure + ' hPa'}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'white'}}>
              <MaterialCommunityIcons
                name="weather-sunny-alert"
                size={14}
                color="white"
              />{' '}
              UV Index
            </Text>
            <Text style={{color: 'white'}}>{data.uvi}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
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
              {Moment(data.sunrise, 'X').format('hh:mm A')}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
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
              {Moment(data.sunset, 'X').format('hh:mm A')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
