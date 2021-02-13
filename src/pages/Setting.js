import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, Picker} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Forecast from '../helpers/Forecast';
import Location from '../helpers/Location';

import {SetLocation, SetGeo} from '../store/action/Location';
import {SetForecast} from '../store/action/Forecast';
import {setSetting} from '../store/action/Setting';

export default (props) => {
  const {navigation} = props;
  const dispatch = useDispatch();

  const SettingRedux = useSelector((state) => state.SettingReducer.setting);

  const [settingState, setSettingState] = useState({});
  const [unit, setUnit] = useState(false);
  const [lang, setLang] = useState(false);

  const Load = async () => {
    setSettingState(SettingRedux);
    setUnit(SettingRedux.unit);
    setLang(SettingRedux.lang);
  };

  const Sync = async () => {
    try {
      const locationLoad = await Location.load(settingState);
      dispatch(SetLocation(locationLoad));

      const geoLocationLoad = await Location.geoLocation(
        settingState,
        locationLoad,
      );
      dispatch(SetGeo(geoLocationLoad));

      const forecastFunction = await Forecast.Sync(locationLoad);
      dispatch(SetForecast(forecastFunction));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    Load();
  }, [SettingRedux]);

  return (
    <View style={{backgroundColor: '#fff', width: '100%', height: '100%'}}>
      <View
        style={{
          width: '100%',
          height: 45,
          flexDirection: 'row',
          paddingHorizontal: 25,
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#5b97ff',
        }}>
        <TouchableOpacity
          style={{
            width: 35,
            height: 35,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Ionicons name={'ios-arrow-back'} size={20} color="gray" />
        </TouchableOpacity>
        <View
          style={{flex: 1, flexDirection: 'row-reverse', alignItems: 'center'}}>
          <Text size={15} style={{color: 'white'}}>
            Setting
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <View style={{width: '40%'}}>
          <Text style={{textAlign: 'right'}}>Unit</Text>
        </View>
        <View style={{width: '40%'}}>
          <Picker
            selectedValue={unit}
            style={{height: 50, width: 150}}
            itemStyle={{}}
            onValueChange={async (itemValue, itemIndex) => {
              setUnit(itemValue);
              const settingData = {
                ...settingState,
                unit: itemValue,
              };
              await AsyncStorage.setItem(
                'setting',
                JSON.stringify(settingData),
              );
              dispatch(setSetting(settingData));
              setSettingState(settingData);
              await Sync();
            }}>
            <Picker.Item label="Imperial" value="imperial" />
            <Picker.Item label="Metric" value="metric" />
            <Picker.Item label="SI" value="standard" />
          </Picker>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <View style={{width: '40%'}}>
          <Text style={{textAlign: 'right'}}>Language</Text>
        </View>
        <View style={{width: '40%'}}>
          <Picker
            selectedValue={lang}
            style={{height: 50, width: 150}}
            itemStyle={{}}
            onValueChange={async (itemValue, itemIndex) => {
              setLang(itemValue);
              const settingData = {
                ...settingState,
                lang: itemValue,
              };
              await AsyncStorage.setItem(
                'setting',
                JSON.stringify(settingData),
              );
              dispatch(setSetting(settingData));
              setSettingState(settingData);
              await Sync();
            }}>
            <Picker.Item value="af" label="Afrikaans" />
            <Picker.Item value="al" label="Albanian" />
            <Picker.Item value="ar" label="Arabic" />
            <Picker.Item value="az" label="Azerbaijani" />
            <Picker.Item value="bg" label="Bulgarian" />
            <Picker.Item value="ca" label="Catalan" />
            <Picker.Item value="cz" label="Czech" />
            <Picker.Item value="da" label="Danish" />
            <Picker.Item value="de" label="German" />
            <Picker.Item value="el" label="Greek" />
            <Picker.Item value="en" label="English" />
            <Picker.Item value="eu" label="Basque" />
            <Picker.Item value="fa" label="Persian (Farsi)" />
            <Picker.Item value="fi" label="Finnish" />
            <Picker.Item value="fr" label="French" />
            <Picker.Item value="gl" label="Galician" />
            <Picker.Item value="he" label="Hebrew" />
            <Picker.Item value="hi" label="Hindi" />
            <Picker.Item value="hr" label="Croatian" />
            <Picker.Item value="hu" label="Hungarian" />
            <Picker.Item value="id" label="Indonesian" />
            <Picker.Item value="it" label="Italian" />
            <Picker.Item value="ja" label="Japanese" />
            <Picker.Item value="kr" label="Korean" />
            <Picker.Item value="la" label="Latvian" />
            <Picker.Item value="lt" label="Lithuanian" />
            <Picker.Item value="mk" label="Macedonian" />
            <Picker.Item value="no" label="Norwegian" />
            <Picker.Item value="nl" label="Dutch" />
            <Picker.Item value="pl" label="Polish" />
            <Picker.Item value="pt" label="Portuguese" />
            <Picker.Item value="pt_br" label="Português Brasil" />
            <Picker.Item value="ro" label="Romanian" />
            <Picker.Item value="ru" label="Russian" />
            <Picker.Item value="se" label="Swedish" />
            <Picker.Item value="sk" label="Slovak" />
            <Picker.Item value="sl" label="Slovenian" />
            <Picker.Item value="es" label="Spanish" />
            <Picker.Item value="sr" label="Serbian" />
            <Picker.Item value="th" label="Thai" />
            <Picker.Item value="tr" label="Turkish" />
            <Picker.Item value="ua" label="Ukrainian" />
            <Picker.Item value="vi" label="Vietnamese" />
            <Picker.Item value="zh_cn" label="Chinese Simplified" />
            <Picker.Item value="zh_tw" label="Chinese Traditional" />
            <Picker.Item value="zu" label="Zulu" />
          </Picker>
        </View>
      </View>
    </View>
  );
};
