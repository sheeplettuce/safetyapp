import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BACKEND_URL = 'http://192.168.0.137:3000';
const USER_ID = 1; // TODO: Obtener del login
const EMERGENCY_WHATSAPP = '524622916549'; // Número de WhatsApp de emergencia

const PanicScreen: React.FC = () => {
  const router = useRouter();
  const [isActivating, setIsActivating] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const handlePanicButton = () => {
    Alert.alert(
      'Botón de Pánico',
      '¿Estás seguro de que quieres activar el botón de pánico?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Activar',
          style: 'destructive',
          onPress: () => activatePanic(),
        },
      ]
    );
  };

  const activatePanic = async () => {
    setIsActivating(true);
    
    try {
      // ACCIÓN 1: Tomar foto
      console.log('📸 ACCIÓN 1: Tomando foto...');
      const photoBase64 = await takePhoto();
      
      // ACCIÓN 2: Obtener ubicación
      console.log('📍 ACCIÓN 2: Obteniendo ubicación...');
      const location = await getLocation();
      
      // ACCIÓN 3: Enviar por WhatsApp
      console.log('📱 ACCIÓN 3: Enviando alerta por WhatsApp...');
      await sendWhatsAppAlert(location, photoBase64);
      
      // ACCIÓN 4: Guardar en base de datos
      console.log('💾 ACCIÓN 4: Guardando registro...');
      if (photoBase64) {
        const photoId = await savePhoto(photoBase64);
        await saveLocation(location?.latitude, location?.longitude);
        await registerPanic(location?.latitude, location?.longitude, photoId);
      }
      
      setIsActivating(false);
      Alert.alert(
        '✅ Pánico Activado', 
        'Se ha enviado la alerta de emergencia por WhatsApp con tu ubicación y foto.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/menu') }]
      );
    } catch (error) {
      setIsActivating(false);
      console.error('Error activando pánico:', error);
      Alert.alert('Error', 'Hubo un problema al activar el pánico');
    }
  };

  const takePhoto = async (): Promise<string | null> => {
    try {
      if (!permission?.granted) {
        const result = await requestPermission();
        if (!result.granted) {
          Alert.alert('Error', 'Se necesita permiso de cámara');
          return null;
        }
      }

      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.5,
        });

        if (photo && photo.base64) {
          console.log('✅ Foto capturada');
          return photo.base64;
        }
      }
      return null;
    } catch (error) {
      console.error('Error tomando foto:', error);
      return null;
    }
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesita permiso de ubicación');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      console.log('✅ Ubicación obtenida:', location.coords);
      return location.coords;
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      return null;
    }
  };

  const sendWhatsAppAlert = async (
    location: { latitude: number; longitude: number } | null,
    photoBase64: string | null
  ) => {
    try {
      let message = '🚨 *ALERTA DE PÁNICO* 🚨\n\n';
      message += '⚠️ Se ha activado el botón de pánico\n\n';

      if (location) {
        message += `📍 *Ubicación:*\n`;
        message += `Latitud: ${location.latitude}\n`;
        message += `Longitud: ${location.longitude}\n`;
        message += `Google Maps: https://www.google.com/maps?q=${location.latitude},${location.longitude}\n\n`;
      } else {
        message += '📍 Ubicación no disponible\n\n';
      }

      if (photoBase64) {
        message += '📷 Foto capturada (ver en la base de datos)\n\n';
      }

      message += `🕐 Hora: ${new Date().toLocaleString('es-MX')}\n`;
      message += '⚠️ *Por favor responda de inmediato*';

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `whatsapp://send?phone=${EMERGENCY_WHATSAPP}&text=${encodedMessage}`;

      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
        console.log('✅ WhatsApp abierto');
      } else {
        Alert.alert('Error', 'No se puede abrir WhatsApp');
      }
    } catch (error) {
      console.error('Error enviando WhatsApp:', error);
    }
  };

  const savePhoto = async (photoBase64: string): Promise<number | null> => {
    try {
      const response = await fetch(`${BACKEND_URL}/panic/photo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: USER_ID,
          photo_base64: photoBase64,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('✅ Foto guardada en DB con ID:', data.photo_id);
        return data.photo_id;
      }
      return null;
    } catch (error) {
      console.error('Error guardando foto:', error);
      return null;
    }
  };

  const saveLocation = async (latitude?: number, longitude?: number) => {
    if (!latitude || !longitude) return;

    try {
      const response = await fetch(`${BACKEND_URL}/panic/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: USER_ID,
          latitude,
          longitude,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('✅ Ubicación guardada en DB');
      }
    } catch (error) {
      console.error('Error guardando ubicación:', error);
    }
  };

  const registerPanic = async (
    latitude?: number,
    longitude?: number,
    photoId?: number | null
  ) => {
    try {
      const response = await fetch(`${BACKEND_URL}/panic/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: USER_ID,
          latitude: latitude || null,
          longitude: longitude || null,
          photo_id: photoId || null,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('✅ Pánico registrado en DB con ID:', data.panic_id);
      }
    } catch (error) {
      console.error('Error registrando pánico:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Cámara invisible */}
      {permission?.granted && (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="front"
        />
      )}

      {/* Botón de regreso */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace('/(tabs)/menu')}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      {/* Botón de pánico principal */}
      <View style={styles.panicButtonContainer}>
        <TouchableOpacity
          style={[styles.panicButton, isActivating && styles.panicButtonActive]}
          onPress={handlePanicButton}
          disabled={isActivating}
        >
          <View style={styles.panicButtonOuter}>
            <View style={styles.panicButtonMiddle}>
              <View style={styles.panicButtonInner} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Acciones que se ejecutarán */}
      <View style={styles.actionsContainer}>
        <View style={styles.actionItem}>
          <View style={styles.actionIconCircle}>
            <Text style={styles.actionIcon}>📱</Text>
          </View>
          <Text style={styles.actionText}>Alerta por WhatsApp</Text>
        </View>

        <View style={styles.actionItem}>
          <View style={styles.actionIconCircle}>
            <Text style={styles.actionIcon}>📷</Text>
          </View>
          <Text style={styles.actionText}>Foto capturada</Text>
        </View>

        <View style={styles.actionItem}>
          <View style={styles.actionIconCircle}>
            <Text style={styles.actionIcon}>📍</Text>
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionText}>Ubicación en tiempo</Text>
            <Text style={styles.actionText}>real</Text>
          </View>
        </View>
      </View>

      {isActivating && (
        <View style={styles.activatingOverlay}>
          <Text style={styles.activatingText}>🚨 Activando pánico...</Text>
          <Text style={styles.activatingSubtext}>
            No cierres la aplicación
          </Text>
        </View>
      )}
    </View>
  );
};

export default PanicScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE6F5',
    paddingTop: 50,
  },
  camera: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
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
  panicButtonContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 60,
  },
  panicButton: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panicButtonActive: {
    opacity: 0.7,
  },
  panicButtonOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#D0D0D0',
  },
  panicButtonMiddle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FF69B4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  panicButtonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF1493',
  },
  actionsContainer: {
    paddingHorizontal: 30,
    gap: 24,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  actionIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFB3E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 28,
  },
  actionTextContainer: {
    flexDirection: 'column',
  },
  actionText: {
    fontSize: 16,
    color: '#FF1493',
    fontWeight: '500',
  },
  activatingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 20, 147, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activatingText: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  activatingSubtext: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
  },
});