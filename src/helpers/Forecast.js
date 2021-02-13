import {Platform} from 'react-native';
import Axios from 'axios';
import Moment from 'moment';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_URL, OPEN_WEATHER_API_KEY} from '@env';

import Unit from '../helpers/Unit';
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
          lang: setting.lang,
          units: setting.unit,
        },
      });

      if (forecast.status === 200) {
        await AsyncStorage.setItem('forecast', JSON.stringify(forecast.data));

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

        Notification.schedule({
          channelId: 'Weather',
          title:
            forecast.data.current.weather[0].description
              .charAt(0)
              .toUpperCase() +
            forecast.data.current.weather[0].description.slice(1) +
            ' in ' +
            geo.name,
          message:
            'Current temp: ' +
            Math.round(forecast.data.current.temp) +
            Unit.sign(setting.unit) +
            ' (High: ' +
            Math.round(forecast.data.daily[0].temp.max) +
            Unit.sign(setting.unit) +
            ' | Low: ' +
            Math.round(forecast.data.daily[0].temp.min) +
            Unit.sign(setting.unit) +
            ')',
          largeIconUrl: `http://openweathermap.org/img/wn/${forecast.data.current.weather[0].icon}@4x.png`,
          vibrate: false,
          playSound: false,
          data: new Date(Date.now() + 2 * 60 * 60 * 1000),
          allowWhileIdle: true,
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
