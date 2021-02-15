import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Linking,
  Image,
  ScrollView,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import NavBar from '../components/NavBar';

export default (props) => {
  const {navigation} = props;

  return (
    <View style={{backgroundColor: '#fff', width: '100%', height: '100%'}}>
      <NavBar navigation={navigation} title="About" />
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
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Weather</Text>
          <Text style={{marginTop: 10, color: 'gray'}}>Developing by:</Text>
          <Text style={{fontWeight: 'bold'}}>Mohammadreza Shahmohammadi</Text>
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
              <Text style={{color: 'white'}}>Website</Text>
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
              <Text style={{color: 'white'}}>Email</Text>
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
              <Text style={{color: 'white'}}>Support</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginHorizontal: 20}}>
          <Text style={{fontWeight: 'bold'}}>Copyrights:</Text>
          <View style={{marginVertical: 10}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{width: 30}}>
                <Ionicons name="ios-sunny" size={16} color="black" />
              </Text>
              <Text style={{fontWeight: 'bold'}}>Forecast: </Text>
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
              <Text style={{fontWeight: 'bold'}}>Geo Location: </Text>
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
              <Text style={{fontWeight: 'bold'}}>Map: </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: 30}} />
              <Text
                style={{marginEnd: 30, textAlign: 'justify', color: 'gray'}}>
                © 2021 OpenStreetMap and contributors
                https://www.openstreetmap.org/copyright
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
