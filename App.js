import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, SafeAreaView, Dimensions} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import {GOOGLE_PLACES_API_KEY} from './constants/GooglePlacesAPIKey';
import {getCurrentLocation} from './helper/helperFunction';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const App = () => {
  const mapRef = useRef();
  const [coord, setCoord] = useState();
  const [destination, setDestination] = useState();

  const onPressAddress = details => {
    let location = {
      latitude: details?.geometry?.location.lat,
      longitude: details?.geometry?.location.lng,
    };
    setDestination(location);
    moveToLocation(location.latitude, location.longitude);
  };

  const moveToLocation = async (latitude, longitude) => {
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      2000,
    );
  };

  const getLiveLocation = async () => {
    const {latitude, longitude} = await getCurrentLocation();
    setCoord({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  useEffect(() => {
    getLiveLocation();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          fetchDetails={true}
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            onPressAddress(details);
          }}
          query={{
            key: GOOGLE_PLACES_API_KEY,
            language: 'en',
          }}
        />
      </View>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={coord}>
        {coord !== undefined && <Marker coordinate={coord} />}
        {destination !== undefined && <Marker coordinate={destination} />}
        {coord != undefined && destination != undefined ? (
          <MapViewDirections
            origin={coord}
            destination={destination}
            apikey={GOOGLE_PLACES_API_KEY}
            strokeColor="hotpink"
            strokeWidth={4}
          />
        ) : null}
      </MapView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  searchContainer: {
    zIndex: 1,
    flex: 0.5,
    marginHorizontal: 10,
    marginVertical: 5,
  },
});

export default App;
