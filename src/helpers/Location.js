import {PermissionsAndroid} from 'react-native';
import Axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import {MAP_BOX_API_KEY} from '@env';

class Location {
  static requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Weather App needs location permission.',
          message:
            'To find your location to forecast, Weather App needs your geolocation.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        await this.requestLocationPermission();
      }
    } catch (error) {
      throw ('requestLocationPermission function ', error);
    }
  };

  static async currentPosition() {
    try {
      await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then((data) => {
          console.log('location setting data', data);
          // The user has accepted to enable the location services
          // data can be :
          //  - "already-enabled" if the location services has been already enabled
          //  - "enabled" if user has clicked on OK button in the popup
        })
        .catch((err) => {
          throw err;
          // The user has not accepted to enable the location services or something went wrong during the process
          // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
          // codes :
          //  - ERR00 : The user has clicked on Cancel button in the popup
          //  - ERR01 : If the Settings change are unavailable
          //  - ERR02 : If the popup has failed to open
          //  - ERR03 : Internal error
        });

      await this.requestLocationPermission();

      return new Promise((resolve, rejection) => {
        Geolocation.getCurrentPosition(
          async (position) => {
            resolve(position.coords);
          },
          (error) => {
            rejection(error);
          },
          {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
        );
      });
    } catch (error) {
      throw ('currentPosition function ', error);
    }
  }

  static async geoLocation(setting, loaction) {
    try {
      if (setting.current) {
        const getGeoLocatoin = (await Axios({
          url: 'https://darksky.net/rgeo',
          params: {
            hires: 1,
            lat: loaction.latitude,
            lon: loaction.longitude,
          },
        })) || {data: {name: ''}};

        if (getGeoLocatoin.status === 200) {
          const geoLocationData = {
            name:
              (getGeoLocatoin.data.street !== undefined
                ? getGeoLocatoin.data.street + ', '
                : '') +
              (getGeoLocatoin.data.name !== undefined
                ? getGeoLocatoin.data.name
                : 'No Where'),
            link: `https://www.google.com/maps/@${loaction.latitude},${loaction.longitude},19z`,
          };
          await AsyncStorage.setItem('geo', JSON.stringify(geoLocationData));
          return geoLocationData;
        } else {
          const geoLocationStore = JSON.parse(
            await AsyncStorage.getItem('geo'),
          );
          return geoLocationStore;
        }
      } else {
        const geoLocationStore = JSON.parse(await AsyncStorage.getItem('geo'));
        return geoLocationStore;
      }
    } catch (error) {
      throw ('geoLocation function ', error);
    }
  }

  static async load(setting) {
    try {
      if (setting.current) {
        const currentPosition = await this.currentPosition();

        await AsyncStorage.setItem('location', JSON.stringify(currentPosition));

        return currentPosition;
      } else {
        const locationStore = JSON.parse(
          await AsyncStorage.getItem('location'),
        );

        return locationStore;
      }
    } catch (error) {
      throw ('location load ', error);
    }
  }

  static async search(query) {
    try {
      const result = await Axios({
        method: 'GET',
        url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`,
        params: {
          access_token: MAP_BOX_API_KEY,
        },
      });

      if (result.status === 200) {
        return result.data.features;
      } else {
        return [];
      }
    } catch (error) {
      throw ('search function ', error);
    }
  }
}

export default Location;
