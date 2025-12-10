import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  avatar: string;
}

const ChatScreen: React.FC = () => {
  const router = useRouter();
  
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Soporte de Emergencia',
      lastMessage: 'Estamos aquí para ayudarte 24/7',
      time: '10:30',
      unread: 2,
      avatar: '👮',
    },
    {
      id: '2',
      name: 'Línea de Crisis',
      lastMessage: 'No dudes en contactarnos',
      time: '09:15',
      avatar: '🆘',
    },
    {
      id: '3',
      name: 'Asistencia Legal',
      lastMessage: 'Asesoría legal disponible',
      time: 'Ayer',
      avatar: '⚖️',
    },
    {
      id: '4',
      name: 'Apoyo Psicológico',
      lastMessage: 'Estamos para escucharte',
      time: 'Ayer',
      avatar: '💚',
    },
    {
      id: '5',
      name: 'Centro de Atención',
      lastMessage: 'Tu seguridad es nuestra prioridad',
      time: 'Lunes',
      avatar: '🏥',
    },
  ];

  const handleContactPress = (contact: Contact) => {
    console.log('Abriendo chat con:', contact.name);
    // Aquí puedes navegar a una pantalla de chat individual
    // router.push(`/chat/${contact.id}`);
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleContactPress(item)}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{item.avatar}</Text>
      </View>
      
      <View style={styles.contactInfo}>
        <View style={styles.contactHeader}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactTime}>{item.time}</Text>
        </View>
        
        <View style={styles.messageRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
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
            <Text style={styles.chatIcon}>💬</Text>
          </View>
          <Text style={styles.headerTitle}>Chat de Ayuda</Text>
        </View>
      </View>

      {/* Search bar placeholder */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>Buscar contacto...</Text>
      </View>

      {/* Contacts List */}
      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={item => item.id}
        style={styles.contactsList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFB3E6',
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 10,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchPlaceholder: {
    color: '#FF69B4',
    fontSize: 15,
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
  avatarContainer: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#FFB3E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatar: {
    fontSize: 28,
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  contactTime: {
    fontSize: 12,
    color: '#999',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#FF69B4',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 85,
  },
});