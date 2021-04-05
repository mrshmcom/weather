import React, {useState, useEffect} from 'react';
import {View, FlatList, RefreshControl, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

import NavBar from '../components/NavBar';
import BookmarkItem from '../components/BookmarkItem';

import Setting from '../helpers/Setting';

export default (props) => {
  const {navigation} = props;

  const [refreshing, setRefreshing] = useState(false);
  const [locations, setLocations] = useState([]);

  const LoadLocations = async () => {
    try {
      setRefreshing(true);
      const bookmark = JSON.parse(await AsyncStorage.getItem('bookmark'));

      if (bookmark) {
        setLocations(bookmark);
      } else {
        AsyncStorage.setItem('bookmark', JSON.stringify([]));
      }
      setRefreshing(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    LoadLocations();
  }, []);

  return (
    <View style={{backgroundColor: '#fff', width: '100%', height: '100%'}}>
      <NavBar
        navigation={navigation}
        title={Setting.Translate('drawerLocationPage')}
      />
      <FlatList
        style={{width: '100%'}}
        contentContainerStyle={{width: '100%'}}
        data={locations}
        keyExtractor={(item) => item.place_name}
        renderItem={({item, index, separators}) => {
          return (
            <BookmarkItem
              item={item}
              LoadLocations={LoadLocations}
              navigation={navigation}
            />
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={LoadLocations} />
        }
        ListEmptyComponent={
          <View
            style={{
              alignItems: 'center',
            }}>
            <LottieView
              source={require('../assets/animations/no-data-error.json')}
              style={{width: '75%'}}
              autoPlay
              loop
            />
            <Text style={{fontSize: 20, fontFamily: 'IRANSansMobile_Bold'}}>
              {Setting.Translate('noLocation')}
            </Text>
            <Text style={{fontFamily: 'IRANSansMobile'}}>
              {Setting.Translate('pullDownRefresh')}
            </Text>
          </View>
        }
      />
    </View>
  );
};
