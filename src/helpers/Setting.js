import {I18nManager} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

const translationGetters = {
  af: () => require('../languages/af.json'),
  al: () => require('../languages/al.json'),
  ar: () => require('../languages/ar.json'),
  az: () => require('../languages/az.json'),
  bg: () => require('../languages/bg.json'),
  ca: () => require('../languages/ca.json'),
  cz: () => require('../languages/cz.json'),
  da: () => require('../languages/da.json'),
  de: () => require('../languages/de.json'),
  el: () => require('../languages/el.json'),
  en: () => require('../languages/en.json'),
  eu: () => require('../languages/eu.json'),
  fa: () => require('../languages/fa.json'),
  fi: () => require('../languages/fi.json'),
  fr: () => require('../languages/fr.json'),
  gl: () => require('../languages/gl.json'),
  he: () => require('../languages/he.json'),
  hi: () => require('../languages/hi.json'),
  hr: () => require('../languages/hr.json'),
  hu: () => require('../languages/hu.json'),
  id: () => require('../languages/id.json'),
  it: () => require('../languages/it.json'),
  ja: () => require('../languages/ja.json'),
  kr: () => require('../languages/kr.json'),
  la: () => require('../languages/la.json'),
  lt: () => require('../languages/lt.json'),
  mk: () => require('../languages/mk.json'),
  no: () => require('../languages/no.json'),
  nl: () => require('../languages/nl.json'),
  pl: () => require('../languages/pl.json'),
  pt: () => require('../languages/pt.json'),
  pt_br: () => require('../languages/pt_br.json'),
  ro: () => require('../languages/ro.json'),
  ru: () => require('../languages/ru.json'),
  se: () => require('../languages/se.json'),
  sk: () => require('../languages/sk.json'),
  sl: () => require('../languages/sl.json'),
  es: () => require('../languages/es.json'),
  sr: () => require('../languages/sr.json'),
  th: () => require('../languages/th.json'),
  tr: () => require('../languages/tr.json'),
  ua: () => require('../languages/ua.json'),
  vi: () => require('../languages/vi.json'),
  zh_cn: () => require('../languages/zh_cn.json'),
  zh_tw: () => require('../languages/zh_tw.json'),
  zu: () => require('../languages/zu.json'),
};

class Setting {
  static async load() {
    try {
      const settingStore = JSON.parse(await AsyncStorage.getItem('setting'));
      const getLocales = RNLocalize.getLocales();
      const getTimeZone = RNLocalize.getTimeZone();

      if (!settingStore) {
        const settingData = {
          current: true,
          language: getLocales[0].languageCode,
          isRTL: getLocales[0].isRTL,
          unit: 'metric',
          timeZone: getTimeZone,
        };

        this.setI18nConfig(getLocales[0].languageCode, getLocales[0].isRTL);

        await AsyncStorage.setItem('setting', JSON.stringify(settingData));
        return settingData;
      } else {
        this.setI18nConfig(settingStore.language, settingStore.isRTL);
        return settingStore;
      }
    } catch (error) {
      throw ('setting load', error);
    }
  }

  static Translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key),
  );

  static setI18nConfig(languageCode = 'en', isRTL = false) {
    this.Translate.cache.clear();

    I18nManager.forceRTL(isRTL);
    i18n.translations = {
      [languageCode]: translationGetters[languageCode](),
    };
    i18n.locale = languageCode;
  }

  static getWeekDayName(weekDay) {
    return weekDay
      .replace(/Saturday/g, 'شنبه')
      .replace(/Sunday/g, 'یک‌شنبه')
      .replace(/Monday/g, 'دوشنبه')
      .replace(/Tuesday/g, 'سه‌شنبه')
      .replace(/Wednesday/g, 'چهارشنبه')
      .replace(/Thursday/g, 'پنج‌شنبه')
      .replace(/Friday/g, 'جمعه')
      .replace(/Sat/g, 'ش')
      .replace(/Sun/g, 'ی')
      .replace(/Mon/g, 'د')
      .replace(/Tue/g, 'س')
      .replace(/Wed/g, 'چ')
      .replace(/Thu/g, 'پ')
      .replace(/Fri/g, 'ج');
  }

  static getMonthName(month) {
    return month
      .replace(/Farvardin/g, 'فروردین')
      .replace(/Ordibehesht/g, 'اردیبهشت')
      .replace(/Khordad/g, 'خرداد')
      .replace(/Tir/g, 'تیر')
      .replace(/Mordad/g, 'مرداد')
      .replace(/Shahrivar/g, 'شهریور')
      .replace(/Mehr/g, 'مهر')
      .replace(/Aban/g, 'آبان')
      .replace(/Azar/g, 'آذر')
      .replace(/Dey/g, 'دی')
      .replace(/Bahman/g, 'بهمن')
      .replace(/Esfand/g, 'اسفند');
  }

  static toPersianString(string) {
    return string
      .replace(/1/g, '۱')
      .replace(/2/g, '۲')
      .replace(/3/g, '۳')
      .replace(/4/g, '۴')
      .replace(/5/g, '۵')
      .replace(/6/g, '۶')
      .replace(/7/g, '۷')
      .replace(/8/g, '۸')
      .replace(/9/g, '۹')
      .replace(/0/g, '۰');
  }
}

export default Setting;
