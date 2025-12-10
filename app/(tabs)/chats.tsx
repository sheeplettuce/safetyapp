import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface Contact {
  idcontact: number;
  name: string;
  phonenumber: string;
  user_id: number;
}

const ChatScreen: React.FC = () => {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const userId = 1; // TODO: Obtener del login

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.137:3000/users/contacts/${userId}`
      );
      if (response.data.success) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      console.error('Error cargando contactos:', error);
    }
  };

  const addContact = async () => {
    if (!newName || !newPhone) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const response = await axios.post(
        'http://192.168.0.137:3000/users/contacts',
        {
          user_id: userId,
          name: newName,
          phonenumber: newPhone
        }
      );

      if (response.data.success) {
        Alert.alert('Éxito', 'Contacto agregado');
        setNewName('');
        setNewPhone('');
        setShowAddForm(false);
        loadContacts();
      }
    } catch (error) {
      console.error('Error agregando contacto:', error);
      Alert.alert('Error', 'No se pudo agregar el contacto');
    }
  };

  const deleteContact = async (contactId: number) => {
    Alert.alert(
      'Eliminar Contacto',
      '¿Estás seguro de eliminar este contacto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await axios.delete(
                `http://192.168.0.137:3000/users/contacts/${contactId}`
              );
              if (response.data.success) {
                loadContacts();
              }
            } catch (error) {
              console.error('Error eliminando contacto:', error);
            }
          }
        }
      ]
    );
  };

  const handleContactPress = (contact: Contact) => {
    Alert.alert(
      contact.name,
      `Número: ${contact.phonenumber}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Llamar',
          onPress: () => console.log('Llamar a:', contact.phonenumber)
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteContact(contact.idcontact)
        }
      ]
    );
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleContactPress(item)}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>👤</Text>
      </View>
      
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.phoneNumber}>{item.phonenumber}</Text>
      </View>
    </TouchableOpacity>
  );

  // Contacto 911 permanente
  const render911Contact = () => (
    <TouchableOpacity
      style={[styles.contactItem, styles.emergencyContact]}
      onPress={() => Alert.alert('911', 'Llamar al 911')}
    >
      <View style={[styles.avatarContainer, styles.emergencyAvatar]}>
        <Text style={styles.avatar}>🚨</Text>
      </View>
      
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>Emergencias 911</Text>
        <Text style={styles.phoneNumber}>911</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/(tabs)/menu')}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.chatIconCircle}>
            <Text style={styles.chatIcon}>📞</Text>
          </View>
          <Text style={styles.headerTitle}>Contactos de Emergencia</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Text style={styles.addIcon}>{showAddForm ? '✕' : '+'}</Text>
        </TouchableOpacity>
      </View>

      {/* Formulario para agregar contacto */}
      {showAddForm && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#FFB3E6"
            value={newName}
            onChangeText={setNewName}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            placeholderTextColor="#FFB3E6"
            value={newPhone}
            onChangeText={setNewPhone}
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.saveButton} onPress={addContact}>
            <Text style={styles.saveButtonText}>Guardar Contacto</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista de contactos */}
      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={item => item.idcontact.toString()}
        style={styles.contactsList}
        ListHeaderComponent={render911Contact}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay contactos agregados</Text>
            <Text style={styles.emptySubtext}>Presiona + para agregar uno</Text>
          </View>
        }
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE6F5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FFE6F5',
    alignItems: 'center',
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
  addButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF69B4',
    borderRadius: 20,
  },
  addIcon: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 10,
  },
  chatIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFB3E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  chatIcon: {
    fontSize: 40,
  },
  headerTitle: {
    fontSize: 18,
    color: '#FF1493',
    fontWeight: '600',
  },
  addForm: {
    backgroundColor: '#FFF',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 15,
    gap: 10,
  },
  input: {
    backgroundColor: '#FFE6F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FF1493',
  },
  saveButton: {
    backgroundColor: '#FF69B4',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  contactsList: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  contactItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  emergencyContact: {
    backgroundColor: '#FFF5F5',
    borderBottomWidth: 2,
    borderBottomColor: '#FF69B4',
  },
  avatarContainer: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#FFB3E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  emergencyAvatar: {
    backgroundColor: '#FFE6F5',
  },
  avatar: {
    fontSize: 28,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 85,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BBB',
  },
});