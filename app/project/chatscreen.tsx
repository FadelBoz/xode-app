// app/chatscreen.tsx
import { Stack, useRouter } from 'expo-router';
import React, { useState, useCallback } from 'react'; // Ajout de useCallback
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal, // Importer Modal
  Alert // Importer Alert pour la confirmation de suppression
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import * as Clipboard from 'expo-clipboard'; // Importer Clipboard

// Define a type for your message objects
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  avatar?: string;
  timestamp?: string;
}

const ChatScreen = () => {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Xode project ", sender: 'other', avatar: 'https://via.placeholder.com/40' },
    { id: '2', text: "Geek", sender: 'user' },
    { id: '3', text: "Le projet ça avance ? ", sender: 'other', avatar: 'https://via.placeholder.com/40' },
    { id: '4', text: "Faisons du dans tâche si possible ", sender: 'other', avatar: 'https://via.placeholder.com/40' },
    { id: '5', text: "Salut chef", sender: 'other', avatar: 'https://via.placeholder.com/40' },
  ]);
  const [inputText, setInputText] = useState('');

  // State pour le menu d'actions
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: String(Date.now()),
        text: inputText.trim(),
        sender: 'user',
      };
      setMessages(prevMessages => [newMessage, ...prevMessages]);
      setInputText('');
    }
  };

  const openActionMenu = (message: Message) => {
    setSelectedMessage(message);
    setIsActionMenuVisible(true);
  };

  const closeActionMenu = () => {
    setIsActionMenuVisible(false);
    setSelectedMessage(null);
  };

  const handleCopyMessage = async () => {
    if (selectedMessage) {
      await Clipboard.setStringAsync(selectedMessage.text);
      Alert.alert("Copié", "Message copié dans le presse-papiers !");
      closeActionMenu();
    }
  };

  const handleDeleteMessage = () => {
    if (selectedMessage) {
      Alert.alert(
        "Supprimer le message",
        "Êtes-vous sûr de vouloir supprimer ce message ?",
        [
          { text: "Annuler", style: "cancel", onPress: closeActionMenu },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: () => {
              setMessages(prevMessages =>
                prevMessages.filter(msg => msg.id !== selectedMessage.id)
              );
              closeActionMenu();
            },
          },
        ]
      );
    }
  };


  const renderMessage = ({ item }: { item: Message }) => (
    <TouchableOpacity onLongPress={() => openActionMenu(item)} delayLongPress={300}>
      <View style={[
        styles.messageRow,
        item.sender === 'user' ? styles.userMessageRow : styles.otherMessageRow
      ]}>
        {item.sender === 'other' && item.avatar && (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        )}
        <View style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userMessageBubble : styles.otherMessageBubble
        ]}>
          <Text style={item.sender === 'user' ? styles.userMessageText : styles.otherMessageText}>
            {item.text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backButtonText}>‹</Text>
              </TouchableOpacity>
              <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.headerAvatar} />
              <View>
                <Text style={styles.headerName}>Team chat</Text>
                <Text style={styles.headerStatus}>Active 11m ago</Text>
              </View>
            </View>
          ),
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerShadowVisible: false,
          headerBackVisible: false,
        }}
      />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={headerHeight}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messageList}
          inverted
          keyboardShouldPersistTaps="handled"
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Message..."
            placeholderTextColor="#8E8E93"
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Modal pour le menu d'actions */}
      <Modal
        transparent={true}
        visible={isActionMenuVisible}
        onRequestClose={closeActionMenu}
        animationType="fade"
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={closeActionMenu}>
          <View style={styles.actionMenu}>
            <TouchableOpacity style={styles.actionMenuItem} onPress={handleCopyMessage}>
              <Text style={styles.actionMenuText}>Copier le texte</Text>
            </TouchableOpacity>
            {selectedMessage?.sender === 'user' && ( // Permettre la suppression uniquement pour les messages de l'utilisateur
              <TouchableOpacity style={styles.actionMenuItem} onPress={handleDeleteMessage}>
                <Text style={[styles.actionMenuText, styles.destructiveText]}>Supprimer le message</Text>
              </TouchableOpacity>
            )}
            {/* Ajoutez d'autres options ici (Modifier, Épingler) */}
            <TouchableOpacity style={[styles.actionMenuItem, styles.cancelAction]} onPress={closeActionMenu}>
              <Text style={styles.actionMenuText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... (tous vos styles existants restent ici)
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -10,
  },
  backButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  headerStatus: {
    fontSize: 12,
    color: 'gray',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'flex-end',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  otherMessageRow: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 5,
  },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    maxWidth: '75%',
  },
  userMessageBubble: {
    backgroundColor: '#000000',
    marginLeft: 'auto',
  },
  otherMessageBubble: {
    backgroundColor: '#E5E5EA',
  },
  userMessageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  otherMessageText: {
    color: '#000000',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 15 : 8,
    borderTopWidth: 1,
    borderTopColor: '#D1D1D6',
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sendButton: {
    padding: 10,
  },
  sendButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Styles pour le Modal et le Menu d'Actions
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Fond semi-transparent
    justifyContent: 'flex-end', // Aligner le menu en bas
  },
  actionMenu: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginBottom: Platform.OS === 'ios' ? 30 : 10, // Marge en bas, plus pour iOS à cause du geste Home
    borderRadius: 10,
    overflow: 'hidden', // Pour que les coins arrondis s'appliquent aux enfants
  },
  actionMenuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DDDDDD',
  },
  actionMenuText: {
    fontSize: 17,
    color: '#007AFF', // Couleur bleue par défaut pour les actions iOS
    textAlign: 'center',
  },
  destructiveText: {
    color: 'red', // Couleur pour les actions destructives
  },
  cancelAction: {
    borderBottomWidth: 0, // Pas de bordure pour le dernier item (Annuler)
    marginTop: 8, // Petit espace avant le bouton Annuler (similaire à ActionSheet iOS)
    backgroundColor: 'white', // Pour que l'espace ne soit pas transparent
  },
});

export default ChatScreen;