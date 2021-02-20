import {Platform} from 'react-native';
import Axios from 'axios';
import Moment from 'moment';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_URL, OPEN_WEATHER_API_KEY} from '@env';

import Unit from '../helpers/Unit';
import Setting from '../helpers/Setting';
import Notification from '../helpers/Notification';
import {db} from '../helpers/Database';

class Forecast {
  static async Sync(location) {
    try {
      const setting = JSON.parse(await AsyncStorage.getItem('setting'));
      const geo = JSON.parse(await AsyncStorage.getItem('geo'));

      const forecast = await Axios({
        method: 'GET',
        url: 'https://api.openweathermap.org/data/2.5/onecall',
        params: {
          appid: OPEN_WEATHER_API_KEY,
          lat: location.latitude,
          lon: location.longitude,
          lang: setting.language,
          units: setting.unit,
        },
      });

      if (forecast.status === 200) {
        AsyncStorage.setItem('forecast', JSON.stringify(forecast.data));

        const sendingData = {
          FCMToken: (await messaging().getToken()) || undefined,
          geo: geo,
          location: location,
          forecast: forecast.data.current,
          OS: Platform.OS,
          Version: Platform.Version,
          constants: Platform.constants,
          date: Moment().toString(),
        };

        Axios({
          url: API_URL,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          data: sendingData,
        });

        db.ref('/forecast').push(sendingData);

        if (forecast.data.alerts && forecast.data.alerts.length > 0) {
          forecast.data.alerts.map((item, index) => {
            Notification.local({
              channelId: 'Alerts',
              id: item.start,
              title: Setting.Translate('alert') + ': ' + item.event,
              message: (item.sender_name + ': ' + item.description).substr(
                0,
                100,
              ),
              vibrate: true,
              vibration: 1000,
              playSound: true,
              allowWhileIdle: true,
            });
          });
        }

        Notification.schedule({
          channelId: 'Weather',
          id: forecast.data.current.data,
          title:
            forecast.data.current.weather[0].description
              .charAt(0)
              .toUpperCase() +
            forecast.data.current.weather[0].description.slice(1) +
            ' ' +
            Setting.Translate('in') +
            ' ' +
            geo.name,
          message:
            Setting.Translate('currentTemp') +
            ': ' +
            Math.round(forecast.data.current.temp) +
            Unit.sign(setting.unit) +
            ' (' +
            Setting.Translate('high') +
            ': ' +
            Math.round(forecast.data.daily[0].temp.max) +
            Unit.sign(setting.unit) +
            ' | ' +
            Setting.Translate('low') +
            ': ' +
            Math.round(forecast.data.daily[0].temp.min) +
            Unit.sign(setting.unit) +
            ')',
          largeIconUrl: `http://openweathermap.org/img/wn/${forecast.data.current.weather[0].icon}@4x.png`,
          vibrate: false,
          playSound: false,
          data: new Date(Date.now() + 2 * 3600 * 1000),
          allowWhileIdle: true,
          // ongoing: true,
          invokeApp: false,
          // actions: ['Setting', 'OK'],
        });

        return forecast.data;
      } else {
        throw forecast.statusText;
      }
    } catch (error) {
      throw ('forecast sync funcon ', error);
    }
  }
}

export default Forecast;
