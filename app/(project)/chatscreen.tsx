// app/project/chatscreen.tsx

import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  View,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons } from '@expo/vector-icons';

// Import des composants et hooks du projet
import { useThemeColors } from '@/hooks/useThemeColors';
import { TextComponent } from '@/components/text/TextComponent';
import { CardComponent } from '@/components/ui/CardComponent';
import { Project, getLastActiveProject } from '@/utils/projectStorage';
import HashtagIcon from '@/components/ui/HashTagIcon';
import ArrowLeftIcon from '@/components/ui/ArrowLeftIcon';
import SendIcon from '@/components/ui/sendIcon';
import { getToken } from '@/utils/storage';
import { API_URL } from '@/configs/global';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  avatar?: string;
  timestamp?: string;
  username?: string;
  isConsecutive?: boolean; // Pour savoir si c'est un message consécutif du même utilisateur
}

const ChatScreen = () => {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const colors = useThemeColors();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Messages avec style Discord - messages consécutifs groupés
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [inputText, setInputText] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);

   // MODIFICATION: useEffect charge maintenant le projet ET les messages
   useEffect(() => {
    const loadData = async () => {
      try {
        const activeProject = await getLastActiveProject();
        setProject(activeProject);

        if (activeProject) {
          // Si on a un projet, on charge ses messages
          const token = await getToken();
          if (!token) throw new Error("Token d'authentification manquant.");

          const response = await fetch(`${API_URL}projects/${activeProject.id}/messages`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            }
          });

          if (!response.ok) throw new Error("Erreur lors de la récupération des messages.");
          
          const data = await response.json();
          const { messages: apiMessages, currentUser } = data;

          // Transformation des messages de l'API au format du frontend
          const formattedMessages = apiMessages.map((msg: any) => ({
            id: String(msg.id),
            text: msg.content,
            sender: msg.senderId === currentUser.id ? 'user' : 'other',
            avatar: msg.avatar,
            timestamp: msg.timestamp,
            username: msg.sender
          }));

          // Traitement pour grouper les messages et mise à jour de l'état
          setMessages(processMessages(formattedMessages.reverse())); // Inverser car l'API les envoie asc, et FlatList est inversée
        }
      } catch (e) {
        console.error("Erreur lors du chargement des données du chat:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);


  // Fonction pour déterminer si un message est consécutif
  const processMessages = (msgs: Message[]) => {
    return msgs.map((msg, index) => {
      const nextMsg = msgs[index + 1];
      const isConsecutive = nextMsg && 
        nextMsg.sender === msg.sender && 
        nextMsg.username === msg.username &&
        // Vérifier si les messages sont proches dans le temps (moins de 5 minutes)
        Math.abs(new Date(msg.timestamp || '').getTime() - new Date(nextMsg.timestamp || '').getTime()) < 5 * 60 * 1000;
      
      return { ...msg, isConsecutive };
    });
  };

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = { 
        id: String(Date.now()), 
        text: inputText.trim(), 
        sender: 'user',
        username: 'Vous',
        timestamp: new Date().toLocaleString(),
        isConsecutive: false
      };
      setMessages(prevMessages => {
        const updatedMessages = [newMessage, ...prevMessages];
        return processMessages(updatedMessages);
      });
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
        "Supprimer le message", "Êtes-vous sûr de vouloir supprimer ce message ?",
        [
          { text: "Annuler", style: "cancel", onPress: closeActionMenu },
          {
            text: "Supprimer", style: "destructive",
            onPress: () => {
              setMessages(prevMessages => 
                processMessages(prevMessages.filter(msg => msg.id !== selectedMessage.id))
              );
              closeActionMenu();
            },
          },
        ]
      );
    }
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const styles = StyleSheet.create({
    appBar: {
      backgroundColor: colors.background2,
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.input,
      flexDirection: 'row'
    },
    safeArea: { 
      flex: 1, 
      backgroundColor: colors.background2 
    },
    loadingContainer: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    keyboardAvoidingView: { 
      flex: 1 
    },
    messageList: { 
      flex: 1, 
      paddingHorizontal: 0 // Supprimé le padding horizontal
    },
    // Style Discord pour les messages
    messageContainer: {
      paddingHorizontal: 16,
      paddingVertical: 2,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    messageContainerFirst: {
      paddingTop: 8,
      marginTop: 8,
    },
    messageContainerConsecutive: {
      paddingTop: 2,
    },
    avatarContainer: {
      width: 40,
      marginRight: 12,
      alignItems: 'center',
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    avatarPlaceholder: {
      width: 32,
      height: 32,
    },
    messageContent: {
      flex: 1,
      paddingRight: 16,
    },
    messageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    username: {
      fontWeight: '600',
      marginRight: 8,
    },
    timestamp: {
      fontSize: 12,
      opacity: 0.6,
    },
    messageText: {
      fontSize: 16,
      lineHeight: 20,
      marginTop: 2,
    },
    messageTextConsecutive: {
      marginTop: 0,
    },
    // Hover effect (pour les long press)
    messageHover: {
      backgroundColor: colors.input,
      marginHorizontal: -4,
      paddingHorizontal: 4,
      borderRadius: 4,
    },
    inputContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingBottom: Platform.OS === 'ios' ? 24 : 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background2,
      alignItems: 'center',
    },
    input: {
      flex: 1,
      minHeight: 40,
      backgroundColor: colors.input,
      color: colors.text,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      marginRight: 12,
      fontSize: 16,
    },
    sendButton: {
      padding: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'flex-end',
    },
    actionMenu: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginBottom: Platform.OS === 'ios' ? 40 : 16,
      borderRadius: 12,
      overflow: 'hidden',
    },
    actionMenuItem: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    destructiveText: {
      color: colors.destructive,
    },
    cancelAction: {
      borderBottomWidth: 0,
      marginTop: 8,
      backgroundColor: colors.card,
    },
    listFooter: {
      alignItems: 'center',
      marginVertical: 24,
      paddingHorizontal: 16,
    },
    projectImage: {
      width: 80,
      height: 80,
      borderRadius: 12,
      marginBottom: 12,
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.primary}/>
      </SafeAreaView>
    );
  }

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isFirstMessage = !item.isConsecutive;
    
    return (
      <TouchableOpacity 
        onLongPress={() => openActionMenu(item)} 
        delayLongPress={300}
        activeOpacity={0.7}
      >
        <View style={[
          styles.messageContainer,
          isFirstMessage ? styles.messageContainerFirst : styles.messageContainerConsecutive
        ]}>
          {/* Avatar ou espace vide pour les messages consécutifs */}
          <View style={styles.avatarContainer}>
            {isFirstMessage && item.avatar ? (
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
          </View>
          
          {/* Contenu du message */}
          <View style={styles.messageContent}>
            {isFirstMessage && (
              <View style={styles.messageHeader}>
                <TextComponent 
                  style={[styles.username, { color: item.sender === 'user' ? colors.primary : colors.validatedGreen }]}
                >
                  {item.username || (item.sender === 'user' ? 'Vous' : 'Utilisateur')}
                </TextComponent>
                <TextComponent 
                  style={[styles.timestamp, { color: colors.muted }]}
                  variante="caption"
                >
                  {formatTime(item.timestamp)}
                </TextComponent>
              </View>
            )}
            
            <TextComponent 
              style={[
                styles.messageText, 
                !isFirstMessage && styles.messageTextConsecutive,
                { color: colors.text }
              ]}
              // variante="body"
            >
              {item.text}
            </TextComponent>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const backToHomeProjectScreen = async() => {
    router.replace({
      pathname: '/homeprojectscreen'
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <CardComponent style={styles.appBar}>
        <TouchableOpacity onPress={backToHomeProjectScreen}>
          <ArrowLeftIcon fillColor={colors.iconNoSelected} width={28} height={28}/>
        </TouchableOpacity>
        <HashtagIcon fillColor={colors.icon} width='16' height='16'/>
        <TextComponent variante='headline2' color={colors.icon}> ☁️ | Team </TextComponent>
        <TextComponent 
          variante="headline"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ flex: 1 }}
        >
          {project?.name}
        </TextComponent>
      </CardComponent>

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
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => (
            <View style={styles.listFooter}>
              <Image 
                source={project?.projectImage ? { uri: project.projectImage } : require('@/assets/images/react-logo.png')} 
                style={styles.projectImage} 
              />
              <TextComponent 
                color={colors.muted} 
                style={{textAlign: 'center', marginTop: 4}}
                variante="caption"
              >
                Ceci est le début de la conversation. Soyez respectueux.
              </TextComponent>
            </View>
          )}
        />

        <CardComponent style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            value={inputText} 
            onChangeText={setInputText} 
            placeholder="Envoyer un message..." 
            placeholderTextColor={colors.muted}
            multiline
            maxLength={2000}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <SendIcon fillColor={colors.icon} width={28} height={28}/>
          </TouchableOpacity>
        </CardComponent>
      </KeyboardAvoidingView>

      <Modal 
        transparent={true} 
        visible={isActionMenuVisible} 
        onRequestClose={closeActionMenu} 
        animationType="fade"
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPressOut={closeActionMenu}
        >
          <CardComponent style={styles.actionMenu}>
            <TouchableOpacity style={styles.actionMenuItem} onPress={handleCopyMessage}>
              <TextComponent color={colors.primary} style={{textAlign: 'center'}}>
                Copier le texte
              </TextComponent>
            </TouchableOpacity>
            {selectedMessage?.sender === 'user' && (
              <TouchableOpacity style={styles.actionMenuItem} onPress={handleDeleteMessage}>
                <TextComponent style={[styles.destructiveText, {textAlign: 'center'}]}>
                  Supprimer le message
                </TextComponent>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.actionMenuItem, styles.cancelAction]} 
              onPress={closeActionMenu}
            >
              <TextComponent color={colors.primary} style={{textAlign: 'center'}}>
                Annuler
              </TextComponent>
            </TouchableOpacity>
          </CardComponent>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default ChatScreen;