import AsyncStorage from '@react-native-async-storage/async-storage';

class Setting {
  static async load() {
    try {
      const settingStore = JSON.parse(await AsyncStorage.getItem('setting'));

      if (!settingStore) {
        const settingData = {
          current: true,
          lang: 'en',
          unit: 'metric',
        };

        await AsyncStorage.setItem('setting', JSON.stringify(settingData));
        return settingData;
      } else {
        return settingStore;
      }
    } catch (error) {
      throw ('setting load', error);
    }
  }
}

export default Setting;
