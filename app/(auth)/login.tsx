import axios from 'axios';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!usuario || !contrasena) {
      Alert.alert('Error', 'Por favor ingresa usuario y contraseña');
      return;
    }

    try {
      console.log('Intentando login con:', usuario, contrasena);
      
      const response = await axios.post(
        "http://192.168.0.137:3000/users/login",
        {
          username: usuario,
          password: contrasena
        }
      );

      console.log('Respuesta del servidor:', response.data);

      if (response.data.success === true) {
        Alert.alert('Éxito', 'Login correcto');
        router.replace('/menu');
      } else {
        Alert.alert('Error', 'Credenciales incorrectas');
      }
    } catch (err: any) {
      console.error('Error completo:', err);
      if (err.response) {
        console.log('Error response:', err.response.data);
        Alert.alert('Error', 'Credenciales incorrectas');
      } else if (err.request) {
        console.log('Error request:', err.request);
        Alert.alert('Error', 'No se pudo conectar con el servidor. Verifica que esté corriendo.');
      } else {
        console.log('Error:', err.message);
        Alert.alert('Error', 'Error desconocido: ' + err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
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