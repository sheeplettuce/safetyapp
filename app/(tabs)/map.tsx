import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const MapScreen: React.FC = () => {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  // Ubicación por defecto (Aguascalientes, México)
  const defaultRegion = {
    latitude: 21.8853,
    longitude: -102.2916,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const currentRegion = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : defaultRegion;

  return (
    <View style={styles.container}>
      {/* Botón de regreso */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace('/(tabs)/menu')}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      {/* Icono de ubicación */}
      <View style={styles.headerContainer}>
        <View style={styles.locationIconCircle}>
          <Text style={styles.locationIcon}>📍</Text>
        </View>
      </View>

      {/* Mapa */}
      <View style={styles.mapContainer}>
        <Text style={styles.mapLabel}>Aguascalientes</Text>
        <View style={styles.mapWrapper}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={currentRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {location && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Tu ubicación"
                pinColor="#FF69B4"
              />
            )}
          </MapView>
        </View>
        <Text style={styles.mapCredit}>created with mapchart.net</Text>
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE6F5',
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 30,
    color: '#FF69B4',
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  locationIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF69B4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIcon: {
    fontSize: 50,
  },
  mapContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mapLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
    fontWeight: '500',
  },
  mapWrapper: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    maxHeight: 400,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapCredit: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
    marginTop: 5,
  },
});