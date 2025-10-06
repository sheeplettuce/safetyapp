import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Contact {
  id: number;
  name: string;
}

const EmergencyScreen: React.FC = () => {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: 'Emergencia 911' },
    { id: 2, name: 'Contacto 1' },
    { id: 3, name: 'Contacto 2' },
  ]);

  const handleAddContact = () => {
    console.log('Agregar nuevo contacto');
    // Aquí puedes agregar lógica para agregar un nuevo contacto
  };

  const handleContactPress = (contact: Contact) => {
    console.log('Contacto presionado:', contact.name);
    // Aquí puedes agregar lógica para llamar o editar el contacto
  };

  return (
    <View style={styles.container}>
      {/* Botón de regreso */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace('/menu')}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      {/* Icono principal de teléfono */}
      <View style={styles.headerContainer}>
        <View style={styles.phoneIconCircle}>
          <Text style={styles.phoneIcon}>📞</Text>
        </View>
      </View>

      {/* Lista de contactos */}
      <ScrollView style={styles.contactsContainer}>
        {contacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={styles.contactItem}
            onPress={() => handleContactPress(contact)}
          >
            <View style={styles.contactIconCircle}>
              <Text style={styles.contactIcon}>👤</Text>
            </View>
            <Text style={styles.contactName}>{contact.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default EmergencyScreen;

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
    paddingTop: 40,
    paddingBottom: 40,
  },
  phoneIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF69B4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneIcon: {
    fontSize: 50,
  },
  contactsContainer: {
    flex: 1,
    paddingHorizontal: 30,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 24,
    paddingVertical: 8,
  },
  contactIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFB3E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactIcon: {
    fontSize: 32,
  },
  contactName: {
    fontSize: 18,
    color: '#FF1493',
    fontWeight: '500',
  },
});