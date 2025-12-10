import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Aquí puedes verificar si el usuario tiene una sesión guardada
  useEffect(() => {
    // Por ahora, asumimos que no hay sesión (mostrará login)
    // Cuando hagas login exitoso, cambiarás este estado
    const checkAuth = async () => {
      // Implementar verificación de token/sesión guardada
      // setIsLoggedIn(true/false);
    };
    checkAuth();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isLoggedIn ? (
        <Stack.Screen 
          name="(auth)"
        />
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  );
}
