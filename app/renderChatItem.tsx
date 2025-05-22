import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TextComponent } from '@/components/text/TextComponent';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';

const ChatsScreen = () => {
  const col = useThemeColors();
  const [activeTab, setActiveTab] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Données simulées pour les discussions
  const chats = [
    {
      id: '1',
      title: 'LITEAPKS.COM - Official',
      message: 'zombie-warfare-v1.1.122-mod...',
      avatar: require('@/assets/images/react-logo.png'), // Remplacez par vos propres images
      time: '11:47 AM',
      unread: 0,
      verified: true,
      pinned: true
    },
    {
      id: '2',
      title: 'Crypto Trading Club',
      message: 'He is Going to Announce 1000...',
      avatar: require('@/assets/images/react-logo.png'),
      time: '7:03 PM',
      unread: 22,
      tag: 'SCAM'
    },
    {
      id: '3',
      title: 'O-Zone™ - OTAKU',
      message: '🎮🎬📱 LE JEU Assassin\'s...',
      avatar: require('@/assets/images/react-logo.png'),
      time: '6:40 PM',
      unread: 7278
    },
    {
      id: '4',
      title: 'Ketch',
      message: 'Why are you always online her...',
      avatar: require('@/assets/images/react-logo.png'),
      time: '6:33 PM',
      unread: 1
    },
    {
      id: '5',
      title: '⛩️ ANIME WORLD ⛩️',
      message: '🔊🎬❌NOTE: nobara en c...',
      avatar: require('@/assets/images/react-logo.png'),
      time: '6:21 PM',
      unread: 4631,
      muted: true
    },
    {
      id: '6',
      title: '🃏 Scan Storm 🃏',
      message: 'Kingdom 836.zip',
      avatar: require('@/assets/images/react-logo.png'),
      time: '5:21 PM',
      unread: 19
    },
    {
      id: '7',
      title: 'Anime canal™ Manga😪',
      message: '🎬 Kaiju No 8 SAISON2 EPIS...',
      avatar: require('@/assets/images/react-logo.png'),
      time: '4:25 PM',
      unread: 9
    },
    {
      id: '8',
      title: 'Activity News',
      message: '📝 StickerX released new free...',
      avatar: require('@/assets/images/react-logo.png'),
      time: '4:15 PM',
      unread: 0
    }
  ];

  // Définition des onglets
  const tabs = [
    { name: 'All', count: 96 },
    { name: 'Messenger', count: 3 },
    { name: 'Animes', count: 4 },
    { name: 'Social' }
  ];

  const renderChatItem = (item: any ) => (
    <TouchableOpacity 
      style={[styles.chatItem, item.pinned && styles.pinnedChat]}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image source={item.avatar} style={styles.avatar} />
        {item.verified && (
          <View style={styles.verifiedBadge}>
            <FontAwesome name="check" size={8} color="white" />
          </View>
        )}
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <View style={styles.titleContainer}>
            <TextComponent 
              variante="subtitle2" 
              numberOfLines={1} 
              style={styles.chatTitle}
            >
              {item.title}
            </TextComponent>
            {item.tag && (
              <View style={styles.tagContainer}>
                <TextComponent variante="body5" color="white">{item.tag}</TextComponent>
              </View>
            )}
          </View>
          <TextComponent variante="body3" color={col.muted}>{item.time}</TextComponent>
        </View>
        
        <View style={styles.chatFooter}>
          <TextComponent 
            variante="body3" 
            color={col.muted} 
            numberOfLines={1} 
            style={styles.messagePreview}
          >
            {item.message}
          </TextComponent>
          
          {item.unread > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: col.primary }]}>
              <TextComponent variante="body5" color="white">
                {item.unread > 999 ? '999+' : item.unread}
              </TextComponent>
            </View>
          )}
          
          {item.muted && (
            <View style={styles.mutedIcon}>
              <MaterialIcons name="volume-off" size={16} color={col.muted} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTabBar = () => (
    <View style={styles.tabContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollView}>
        {tabs.map((tab, index) => (
          <TouchableOpacity 
            key={index}
            style={[styles.tab, activeTab === index && styles.activeTab]}
            onPress={() => setActiveTab(index)}
          >
            <TextComponent 
              variante="body2"
              color={activeTab === index ? col.primary : col.muted}
            >
              {tab.name} {tab.count && (
                <View style={[styles.tabBadge, 
                  { backgroundColor: activeTab === index ? col.primary : col.ring }
                ]}>
                  <TextComponent variante="body5" color="white">{tab.count}</TextComponent>
                </View>
              )}
            </TextComponent>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderBirthdayBanner = () => (
    <View style={styles.birthdayBanner}>
      <View style={styles.birthdayContent}>
        <TextComponent variante="subtitle2">Add your birthday! 🎂</TextComponent>
        <TextComponent variante="body3" color={col.muted}>
          Let your contacts know when you're celebrating
        </TextComponent>
      </View>
      <TouchableOpacity style={styles.closeButton}>
        <Ionicons name="close" size={24} color={col.muted} />
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton}>
        <Ionicons name="menu" size={28} color="white" />
      </TouchableOpacity>
      
      <View style={styles.titleSection}>
        <Image 
          source={require('@/assets/images/react-logo.png')} 
          style={styles.logo}
        />
        <TextComponent variante="subtitle1" color="white">1 Story</TextComponent>
      </View>
      
      <TouchableOpacity 
        style={styles.searchButton}
        onPress={() => setShowSearch(!showSearch)}
      >
        <Ionicons name="search" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#121212',
    },
    menuButton: {
      padding: 4,
    },
    titleSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logo: {
      width: 36,
      height: 36,
      borderRadius: 18,
      marginRight: 8,
    },
    searchButton: {
      padding: 4,
    },
    tabContainer: {
      borderBottomWidth: 2,
      borderBottomColor: '#2a2a2a',
    },
    tabScrollView: {
      paddingHorizontal: 16,
    },
    tab: {
      paddingVertical: 12,
      paddingHorizontal: 8,
      marginRight: 16,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: col.primary,
    },
    tabBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 12,
      marginLeft: 4,
    },
    birthdayBanner: {
      backgroundColor: '#1e1e1e',
      flexDirection: 'row',
      padding: 16,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    birthdayContent: {
      flex: 1,
    },
    closeButton: {
      padding: 4,
    },
    chatList: {
      flex: 1,
    },
    chatItem: {
      flexDirection: 'row',
      padding: 16,
      borderBottomWidth: 0.5,
      borderBottomColor: '#2a2a2a',
    },
    pinnedChat: {
      backgroundColor: '#1a1a1a',
    },
    avatarContainer: {
      position: 'relative',
      marginRight: 12,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
    },
    verifiedBadge: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      backgroundColor: '#4caf50',
      width: 16,
      height: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#121212',
    },
    chatContent: {
      flex: 1,
      justifyContent: 'center',
    },
    chatHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    chatTitle: {
      flex: 1,
    },
    tagContainer: {
      backgroundColor: '#e53935',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      marginLeft: 8,
    },
    chatFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    messagePreview: {
      flex: 1,
      marginRight: 8,
    },
    unreadBadge: {
      minWidth: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
    },
    mutedIcon: {
      marginLeft: 4,
    },
    fabButton: {
      position: 'absolute',
      bottom: 16,
      right: 16,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: col.primary2,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
    },
    searchContainer: {
      backgroundColor: '#2a2a2a',
      padding: 8,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      color: 'white',
      fontSize: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      {renderHeader()}
      
      {showSearch && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={col.muted} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor={col.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}
      
      {renderTabBar()}
      
      {renderBirthdayBanner()}
      
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        style={styles.chatList}
      />
      
      <TouchableOpacity style={styles.fabButton}>
        <Ionicons name="camera" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChatsScreen;