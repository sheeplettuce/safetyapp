import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';


interface Contact {
  id: number;
  name: string;
  phonenumber?: string;
}

const BACKEND_URL = 'http://192.168.0.137:3000';

const EmergencyScreen: React.FC = () => {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/contacts`);
      if (!res.ok) throw new Error('Failed to fetch contacts');
      const data: Contact[] = await res.json();
      setContacts(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudieron cargar los contactos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setNewContactName('');
    setNewContactPhone('');
    setIsEditing(false);
    setModalVisible(true);
  };

  const handleOpenEdit = (contact: Contact) => {
    setNewContactName(contact.name);
    setNewContactPhone(contact.phonenumber || '');
    setSelectedContact(contact);
    setIsEditing(true);
    setDetailModalVisible(false);
    setModalVisible(true);
  };

  const handleAddContact = async () => {
    if (!newContactName.trim()) {
      Alert.alert('Validación', 'Ingresa un nombre para el contacto');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newContactName.trim(),
          phonenumber: newContactPhone.trim()
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Error creando contacto');
      }
      await loadContacts();
      setModalVisible(false);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo crear el contacto');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContact = async () => {
    if (!selectedContact || !newContactName.trim()) {
      Alert.alert('Validación', 'Ingresa un nombre para el contacto');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/contacts/${selectedContact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newContactName.trim(),
          phonenumber: newContactPhone.trim()
        }),
      });
      if (!res.ok) throw new Error('Error actualizando contacto');
      await loadContacts();
      setModalVisible(false);
      setSelectedContact(null);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo actualizar el contacto');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id: number) => {
    Alert.alert(
      'Eliminar contacto',
      '¿Estás seguro de eliminar este contacto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const res = await fetch(`${BACKEND_URL}/contacts/${id}`, {
                method: 'DELETE',
              });
              if (!res.ok) throw new Error('Error eliminando contacto');
              await loadContacts();
              setDetailModalVisible(false);
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'No se pudo eliminar el contacto');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCallContact = async (phonenumber: string) => {
    if (!phonenumber || phonenumber.trim() === '') {
      Alert.alert('Error', 'Este contacto no tiene número de teléfono');
      return;
    }

    // Limpiar número: remover espacios y caracteres especiales que no sean números
    const cleanedNumber = phonenumber.replace(/\D/g, '');
    
    if (!cleanedNumber) {
      Alert.alert('Error', 'Número de teléfono inválido');
      return;
    }

    const phoneUrl = `tel:${cleanedNumber}`;
    
    try {
      console.log('Intentando llamar a:', phoneUrl);
      
      // En lugar de verificar, simplemente intentamos abrir
      // Esto funciona mejor en Expo Go y dispositivos reales
      await Linking.openURL(phoneUrl);
      console.log('Llamada iniciada exitosamente');
    } catch (err: any) {
      console.error('Error al intentar llamar:', err);
      
      // Si falla, mostrar el número para que el usuario marque manualmente
      Alert.alert(
        'Llamada no disponible',
        `No se puede realizar llamadas desde aquí.\n\nNúmero: ${phonenumber}\n\nCópialo y marca manualmente.`,
        [
          { text: 'OK' }
        ]
      );
    }
  };

  const handleContactPress = (contact: Contact) => {
    setSelectedContact(contact);
    setDetailModalVisible(true);
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

      {/* Icono principal de teléfono */}
      <View style={styles.headerContainer}>
        <View style={styles.phoneIconCircle}>
          <Text style={styles.phoneIcon}>📞</Text>
        </View>
      </View>

      {/* Lista de contactos */}
      <ScrollView style={styles.contactsContainer}>
        {loading && contacts.length === 0 ? (
          <ActivityIndicator size="large" color="#FF69B4" />
        ) : (
          contacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.contactItem}
              onPress={() => handleContactPress(contact)}
            >
              <View style={styles.contactIconCircle}>
                <Text style={styles.contactIcon}>👤</Text>
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactName}>{contact.name}</Text>
                {contact.phonenumber && (
                  <Text style={styles.contactPhone}>{contact.phonenumber}</Text>
                )}
              </View>
              {/* Botón de llamada rápida */}
              {contact.phonenumber && (
                <TouchableOpacity
                  style={styles.quickCallButton}
                  onPress={() => handleCallContact(contact.phonenumber!)}
                >
                  <Text style={styles.quickCallIcon}>📞</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Botón para abrir modal agregar contacto */}
      <TouchableOpacity style={styles.addButton} onPress={handleOpenAdd}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal para agregar/editar contacto */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            <Text style={modalStyles.title}>
              {isEditing ? 'Editar contacto' : 'Nuevo contacto'}
            </Text>
            <TextInput
              value={newContactName}
              onChangeText={setNewContactName}
              placeholder="Nombre del contacto"
              placeholderTextColor="#999"
              style={modalStyles.input}
            />
            <TextInput
              value={newContactPhone}
              onChangeText={setNewContactPhone}
              placeholder="Número de teléfono"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              style={modalStyles.input}
            />
            <View style={modalStyles.actions}>
              <TouchableOpacity
                style={[modalStyles.btn, modalStyles.cancel]}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedContact(null);
                }}
                disabled={loading}
              >
                <Text style={modalStyles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.btn, modalStyles.save]}
                onPress={isEditing ? handleUpdateContact : handleAddContact}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={modalStyles.btnText}>
                    {isEditing ? 'Actualizar' : 'Guardar'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de detalles del contacto */}
      <Modal visible={detailModalVisible} animationType="fade" transparent>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            {selectedContact && (
              <>
                <View style={modalStyles.detailHeader}>
                  <View style={styles.contactIconCircle}>
                    <Text style={styles.contactIcon}>👤</Text>
                  </View>
                </View>
                <Text style={modalStyles.detailName}>{selectedContact.name}</Text>
                {selectedContact.phonenumber && (
                  <Text style={modalStyles.detailPhone}>
                    {selectedContact.phonenumber}
                  </Text>
                )}
                
                {/* Botón principal de llamada */}
                {selectedContact.phonenumber && (
                  <TouchableOpacity
                    style={modalStyles.callButton}
                    onPress={() => handleCallContact(selectedContact.phonenumber!)}
                  >
                    <Text style={modalStyles.callButtonText}>📞 Llamar</Text>
                  </TouchableOpacity>
                )}

                <View style={modalStyles.detailActions}>
                  <TouchableOpacity
                    style={[modalStyles.detailBtn, modalStyles.editBtn]}
                    onPress={() => handleOpenEdit(selectedContact)}
                  >
                    <Text style={modalStyles.detailBtnText}>✏️ Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[modalStyles.detailBtn, modalStyles.deleteBtn]}
                    onPress={() => handleDeleteContact(selectedContact.id)}
                  >
                    <Text style={modalStyles.detailBtnText}>🗑️ Eliminar</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={modalStyles.closeBtn}
                  onPress={() => setDetailModalVisible(false)}
                >
                  <Text style={modalStyles.closeBtnText}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    gap: 15,
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
  contactTextContainer: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    color: '#FF1493',
    fontWeight: '500',
  },
  contactPhone: {
    fontSize: 14,
    color: '#FF69B4',
    marginTop: 4,
  },
  quickCallButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCallIcon: {
    fontSize: 22,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF69B4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  cancel: {
    backgroundColor: '#eee',
  },
  save: {
    backgroundColor: '#FF69B4',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelText: {
    color: '#666',
    fontWeight: '600',
  },
  detailHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  detailName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  detailPhone: {
    fontSize: 18,
    color: '#FF69B4',
    textAlign: 'center',
    marginBottom: 16,
  },
  callButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  detailActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  detailBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: '#2196F3',
  },
  deleteBtn: {
    backgroundColor: '#F44336',
  },
  detailBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  closeBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#999',
    fontSize: 16,
  },
});