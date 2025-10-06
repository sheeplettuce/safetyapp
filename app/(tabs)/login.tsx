import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Aquí agregarías tu lógica de autenticación
    if (usuario && contrasena) {
      // Si las credenciales son válidas, navegar al menú
      router.replace('/menu');
    } else {
      alert('Por favor ingresa usuario y contraseña');
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón circular en la esquina superior izquierda */}
      <TouchableOpacity style={styles.backButton}>
        <View style={styles.backButtonCircle} />
      </TouchableOpacity>

      {/* Imagen de usuario */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/user.png')}
          style={styles.userImage}
          contentFit="contain"
        />
      </View>

      {/* Formulario */}
      <View style={styles.formContainer}>
        {/* Campo Usuario */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            style={styles.input}
            value={usuario}
            onChangeText={setUsuario}
            placeholder=""
            placeholderTextColor="#FFB3E6"
            autoCapitalize="none"
          />
        </View>

        {/* Campo Contraseña */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={contrasena}
            onChangeText={setContrasena}
            placeholder=""
            placeholderTextColor="#FFB3E6"
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        {/* Botón de login */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE6F5',
    alignItems: 'center',
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF69B4',
  },
  imageContainer: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 50,
  },
  userImage: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#FF69B4',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#FFB3E6',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FF1493',
    borderWidth: 0,
  },
  loginButton: {
    backgroundColor: '#FF69B4',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});