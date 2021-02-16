import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Picker,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {OPEN_WEATHER_API_KEY, THUNDER_FOREST_API_KEY} from '@env';

export default function Map() {
  const LocationRedux = useSelector((state) => state.LocationReducer.location);

  const [mapTypeState, setMapTypeState] = useState('temp_new');
  const [loading, setLoading] = useState(true);
  const [ZOOM, setZOOM] = useState(5);

  const scrollV = useRef(null);
  const scrollH = useRef(null);

  const Tile = (props) => {
    const {tileX, tileY, type} = props;
    return (
      <ImageBackground
        style={{width: 256, height: 256, backgroundColor: 'white'}}
        source={{
          uri: tileMaker(
            lon2tile(LocationRedux.longitude, ZOOM) + tileX,
            lat2tile(LocationRedux.latitude, ZOOM) + tileY,
            ZOOM,
          ).map,
        }}>
        <Image
          style={{width: 256, height: 256}}
          source={{
            uri: tileMaker(
              lon2tile(LocationRedux.longitude, ZOOM) + tileX,
              lat2tile(LocationRedux.latitude, ZOOM) + tileY,
              ZOOM,
            )[type],
          }}
        />
      </ImageBackground>
    );
  };

  const lon2tile = (lon, zoom) => {
    return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
  };

  const lat2tile = (lat, zoom) => {
    return Math.floor(
      ((1 -
        Math.log(
          Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180),
        ) /
          Math.PI) /
        2) *
        Math.pow(2, zoom),
    );
  };

  const tileMaker = (x, y, z) => {
    return {
      map: `http://a.tile.thunderforest.com/atlas/${z}/${x}/${y}.png?apikey=${THUNDER_FOREST_API_KEY}`,
      clouds_new: `https://tile.openweathermap.org/map/clouds_new/${z}/${x}/${y}.png?appid=${OPEN_WEATHER_API_KEY}`,
      precipitation_new: `https://tile.openweathermap.org/map/precipitation_new/${z}/${x}/${y}.png?appid=${OPEN_WEATHER_API_KEY}`,
      pressure_new: `https://tile.openweathermap.org/map/pressure_new/${z}/${x}/${y}.png?appid=${OPEN_WEATHER_API_KEY}`,
      wind_new: `https://tile.openweathermap.org/map/wind_new/${z}/${x}/${y}.png?appid=${OPEN_WEATHER_API_KEY}`,
      temp_new: `https://tile.openweathermap.org/map/temp_new/${z}/${x}/${y}.png?appid=${OPEN_WEATHER_API_KEY}`,
    };
  };

  useEffect(() => {
    setLoading(true);

    // scrollH.current.scrollTo({x: 0, y: 0, animated: true});
    // scrollV.current.scrollToEnd();

    setLoading(false);
  }, [LocationRedux]);

  return loading ? (
    <View
      style={{
        backgroundColor: '#5b97ff',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" color="white" />
      <Text style={{color: 'white'}}>Loading</Text>
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5b97ff',
      }}>
      <FlatList
        horizontal={true}
        data={[0]}
        renderItem={(x) => {
          return (
            <FlatList
              data={[0]}
              renderItem={(y) => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <View>
                      <Tile tileX={-1} tileY={-1} type={mapTypeState} />
                      <Tile tileX={-1} tileY={0} type={mapTypeState} />
                      <Tile tileX={-1} tileY={1} type={mapTypeState} />
                    </View>
                    <View>
                      <Tile tileX={0} tileY={-1} type={mapTypeState} />
                      <Tile tileX={0} tileY={0} type={mapTypeState} />
                      <Tile tileX={0} tileY={1} type={mapTypeState} />
                    </View>
                    <View>
                      <Tile tileX={1} tileY={-1} type={mapTypeState} />
                      <Tile tileX={1} tileY={0} type={mapTypeState} />
                      <Tile tileX={1} tileY={1} type={mapTypeState} />
                    </View>
                  </View>
                );
              }}
            />
          );
        }}
      />
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 5,
          width: '40%',
          height: 50,
          position: 'absolute',
          left: 10,
          bottom: 10,
        }}>
        <Picker
          selectedValue={mapTypeState}
          style={{height: 50}}
          itemStyle={{}}
          onValueChange={async (itemValue, itemIndex) => {
            setMapTypeState(itemValue);
          }}>
          <Picker.Item label="Temperature" value="temp_new" />
          <Picker.Item label="Precipitation" value="precipitation_new" />
          <Picker.Item label="Clouds" value="clouds_new" />
          <Picker.Item label="Sea level pressure" value="pressure_new" />
          <Picker.Item label="Wind speed" value="wind_new" />
        </Picker>
      </View>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 5,
          width: 40,
          height: 80,
          position: 'absolute',
          right: 10,
          bottom: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            ZOOM <= 14 && setZOOM(ZOOM + 1);
          }}
          disabled={ZOOM >= 15}
          style={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0,0,0,0.1)',
          }}>
          <Text>
            <Ionicons
              name="ios-add-circle-outline"
              size={25}
              color={ZOOM >= 15 ? 'gray' : 'black'}
            />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            ZOOM >= 4 && setZOOM(ZOOM - 1);
          }}
          disabled={ZOOM <= 3}
          style={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>
            <Ionicons
              name="ios-remove-circle-outline"
              size={25}
              color={ZOOM <= 3 ? 'gray' : 'black'}
            />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
