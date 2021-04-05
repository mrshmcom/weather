import React from 'react';
import {
  View,
  TouchableOpacity,
  Linking,
  Image,
  ScrollView,
  Text,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import NavBar from '../components/NavBar';

import Setting from '../helpers/Setting';

export default (props) => {
  const {navigation} = props;

  return (
    <View style={{backgroundColor: '#fff', width: '100%', height: '100%'}}>
      <NavBar
        navigation={navigation}
        title={Setting.Translate('drawerAboutPage')}
      />
      <ScrollView>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../assets/images/playstore-icon.png')}
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              marginVertical: 20,
            }}
          />
          <Text style={{fontSize: 20, fontFamily: 'IRANSansMobile_Bold'}}>
            {Setting.Translate('loadingTitle')}
          </Text>
          <Text
            style={{
              marginTop: 10,
              color: 'gray',
              fontFamily: 'IRANSansMobile',
            }}>
            {Setting.Translate('developing')}
          </Text>
          <Text style={{fontFamily: 'IRANSansMobile_Bold'}}>
            {Setting.Translate('mrshm')}
          </Text>
          <View
            style={{
              paddingHorizontal: 20,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginVertical: 30,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#5b97ff',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
              }}
              onPress={() => {
                Linking.openURL('https://mrshm.ir');
              }}>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                {Setting.Translate('drawerWebsitePage')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#5b97ff',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
              }}
              onPress={() => {
                Linking.openURL('mailto:hi@mrshm.ir');
              }}>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                {Setting.Translate('mail')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#5b97ff',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
              }}
              onPress={() => {
                navigation.navigate('Support');
              }}>
              <Text style={{color: 'white', fontFamily: 'IRANSansMobile'}}>
                {Setting.Translate('drawerSupportPage')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginHorizontal: 20, marginVertical: 20}}>
          <Text>Copyrights</Text>
          <View style={{marginVertical: 10}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{width: 30, fontFamily: 'IRANSansMobile'}}>
                <Ionicons name="ios-sunny" size={16} color="black" />
              </Text>
              <Text>Forecast</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: 30}} />
              <Text
                style={{marginEnd: 30, textAlign: 'justify', color: 'gray'}}>
                © 2012 — 2021 OpenWeather ® All rights reserved.
              </Text>
            </View>
          </View>
          <View style={{marginVertical: 10}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{width: 30}}>
                <Ionicons name="ios-location-sharp" size={16} color="black" />
              </Text>
              <Text>Geo Location</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: 30}} />
              <Text
                style={{marginEnd: 30, textAlign: 'justify', color: 'gray'}}>
                © 2021 Mapbox and its suppliers. All rights reserved. Use of
                this data is subject to the Mapbox Terms of Service
                (https://www.mapbox.com/about/maps/). This response and the
                information it contains may not be retained. POI(s) provided by
                Foursquare."
              </Text>
            </View>
          </View>
          <View style={{marginVertical: 10}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{width: 30}}>
                <Ionicons name="ios-map" size={16} color="black" />
              </Text>
              <Text>Map</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: 30}} />
              <Text
                style={{marginEnd: 30, textAlign: 'justify', color: 'gray'}}>
                Copyright (c) 2017 Airbnb Licensed under the The MIT License
                (MIT) (the "License"); you may not use this file except in
                compliance with the License. You may obtain a copy of the
                License at
                https://raw.githubusercontent.com/airbnb/react-native-maps/master/LICENSE
                Unless required by applicable law or agreed to in writing,
                software distributed under the License is distributed on an "AS
                IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
                express or implied. See the License for the specific language
                governing permissions and limitations under the License.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
