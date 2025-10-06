import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MenuScreen: React.FC = () => {
  const router = useRouter();

const handleEmergencyNumbers = () => {
  router.push('/emergency');
};

const handleViewMap = () => {
  router.push('/map');
};

  const handlePanicButton = () => {
  router.push('/panic');
  };

  const handleHelpChat = () => {
    router.push('/chats');
  };

  return (
    <View style={styles.container}>
      {/* Botón de regreso */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace('/login')}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      {/* Opciones del menú */}
      <View style={styles.menuContainer}>
        {/* Añadir numeros de emergencia */}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleEmergencyNumbers}
        >
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>📞</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.menuText}>Añadir numeros de</Text>
            <Text style={styles.menuText}>emergencia</Text>
          </View>
        </TouchableOpacity>

        {/* Ver el mapa */}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleViewMap}
        >
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>📍</Text>
          </View>
          <Text style={styles.menuText}>Ver el mapa</Text>
        </TouchableOpacity>

        {/* Boton de panico */}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handlePanicButton}
        >
          <View style={[styles.iconCircle, styles.panicButton]}>
            <View style={styles.panicButtonInner} />
          </View>
          <Text style={styles.menuText}>Boton de panico</Text>
        </TouchableOpacity>

        {/* Chat de ayuda */}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleHelpChat}
        >
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>💬</Text>
          </View>
          <Text style={styles.menuText}>Chat de ayuda</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MenuScreen;

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
  menuContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 100,
    gap: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFB3E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 28,
  },
  panicButton: {
    backgroundColor: '#FF69B4',
    borderWidth: 3,
    borderColor: '#FFB3E6',
    position: 'relative',
  },
  panicButtonInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF1493',
  },
  textContainer: {
    flexDirection: 'column',
  },
  menuText: {
    fontSize: 16,
    color: '#FF1493',
    fontWeight: '500',
  },
});