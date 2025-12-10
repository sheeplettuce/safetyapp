import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PanicScreen: React.FC = () => {
  const router = useRouter();
  const [isActivating, setIsActivating] = useState(false);

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

  const activatePanic = () => {
    setIsActivating(true);
    
    // TODO: Implementar llamada a emergencia 911
    console.log('🚨 ACCIÓN 1: Llamando a Emergencia 911...');
    
    // TODO: Implementar captura de foto
    console.log('📸 ACCIÓN 2: Tomando foto...');
    
    // TODO: Implementar envío de ubicación en tiempo real
    console.log('📍 ACCIÓN 3: Enviando ubicación en tiempo real...');
    
    // Espacio para la lógica de activación del pánico
    // Aquí irán las funciones para:
    // - Llamar al número de emergencia
    // - Activar la cámara y tomar foto
    // - Obtener y enviar ubicación GPS
    // - Enviar notificaciones a contactos de emergencia
    
    setTimeout(() => {
      setIsActivating(false);
      Alert.alert('Pánico Activado', 'Todas las acciones han sido ejecutadas');
    }, 2000);
  };

  return (
    <View style={styles.container}>
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
        {/* Emergencia 911 */}
        <View style={styles.actionItem}>
          <View style={styles.actionIconCircle}>
            <Text style={styles.actionIcon}>📞</Text>
          </View>
          <Text style={styles.actionText}>Emergencia 911</Text>
        </View>

        {/* Foto tomada */}
        <View style={styles.actionItem}>
          <View style={styles.actionIconCircle}>
            <Text style={styles.actionIcon}>📷</Text>
          </View>
          <Text style={styles.actionText}>Foto tomada</Text>
        </View>

        {/* Ubicación en tiempo real */}
        <View style={styles.actionItem}>
          <View style={styles.actionIconCircle}>
            <Text style={styles.actionIcon}>📍</Text>
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionText}>ubicacion en tiempo</Text>
            <Text style={styles.actionText}>real</Text>
          </View>
        </View>
      </View>

      {isActivating && (
        <View style={styles.activatingOverlay}>
          <Text style={styles.activatingText}>Activando pánico...</Text>
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
    backgroundColor: 'rgba(255, 105, 180, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activatingText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
});