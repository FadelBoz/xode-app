import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; // Ajoutez cette importation
import { CardComponent } from '@/components/ui/CardComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TextComponent } from '@/components/text/TextComponent';
import ScannerIcon from '@/components/ui/ScannerIcon';
import EmojiIcon from '@/components/ui/EmojiIcon';
import { getUser } from '@/utils/storage';
import TerminalIcon from '@/components/ui/TerminalIcon';
const HomeScreen = () => {
  const [isUrlInputVisible, setIsUrlInputVisible] = useState(false);
  const router = useRouter(); // Ajoutez cette ligne
  const col = useThemeColors();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUserName(user?.name ?? null); // ou user?.email selon ce que tu veux afficher
    };
    fetchUser();
  }, []);
  const styles = StyleSheet.create({
    appBar: {
      backgroundColor: col.card,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: col.border,
    },
    section: {
      padding: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    serverIcon: {
      width: 20,
      height: 20,
      // backgroundColor: col.card,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8
    },
    sectionTitle: {
      flex: 1,
      fontSize: 16,
    },
    signInCard: {
      backgroundColor: col.card,
      borderRadius: 8,
      overflow: 'hidden',
      borderWidth:1, 
      borderColor:col.border
    },
    signInPrompt: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: col.border,
    },
    urlOption: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: col.border,
    },
    urlOptionText: {
      fontSize: 16,
      marginLeft: 4,
    },
    urlInputContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: col.border,
      backgroundColor: col.card
    },
    urlInput: {
      backgroundColor: col.input,
      color: col.text,
      padding: 12,
      borderRadius: 6,
      marginBottom: 16,
    },
    connectButton: {
      backgroundColor: col.validated,
      padding: 14,
      borderRadius: 6,
      alignItems: 'center',
    },

    qrOption: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    qrIconContainer: {
      marginRight: 8,
      backgroundColor:col.card
    },
    qrIcon: {
      color: '#FFFFFF',
      fontSize: 20,
    },
    qrOptionText: {
      color: '#FFFFFF',
      fontSize: 16,
    },
    recentSection: {
      padding: 16,
    },
    recentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },

    recentItem: {
      backgroundColor: col.card,
      borderRadius: 8,
      padding: 16,
      borderWidth:1, 
      borderColor:col.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    appIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 8,
      borderWidth:1, 
      borderColor:col.border,
      backgroundColor: col.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    appIcon: {
      width: 24,
      height: 24,
    },
    chevron: {
      color: '#8D8D8D',
      fontSize: 24,
    },
  });

  return ( 
    <SafeAreaView style = {{backgroundColor: col.card, flex: 1}}>
      {/* App Bar */}
      <CardComponent style={styles.appBar}>
          <TextComponent variante='subtitle1' color={col.icon}>XD</TextComponent>
      </CardComponent>
      <CardComponent style={{backgroundColor: col.background, flex:1}}>
        
        {/* Development Servers Section */}
        <CardComponent style={styles.section}>
          <CardComponent style={styles.sectionHeader}>
            <CardComponent style={styles.serverIcon}>
              {/* <TextComponent style={styles.terminalIcon}>$~</TextComponent> */}
              <TerminalIcon width='28' height='30' fillColor={col.icon}></TerminalIcon>
            </CardComponent>
            <CardComponent style={styles.sectionTitle}>
              {/* <TextComponent >{userName ? userName : 'Guest'}</TextComponent> */}
              <TextComponent color={col.text2}>Server de Développement</TextComponent>
            </CardComponent>
            <TouchableOpacity>
              <TextComponent  color={col.iconNoSelected} >HELP</TextComponent>
            </TouchableOpacity>
          </CardComponent>
          
          {/* Sign In Card */}
          <CardComponent style={styles.signInCard}>
            <TouchableOpacity style={styles.signInPrompt}>
              <TextComponent color={col.text}>
                Appuyez ici pour vous connectez à votre projet ou Scanner directement le code Qr afficher sur votre écran.
              </TextComponent>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.urlOption}
              onPress={() => setIsUrlInputVisible(!isUrlInputVisible)}
            >
              <TextComponent >
                {isUrlInputVisible ? '▼' : '▶'} Entrer manuellement
              </TextComponent>
            </TouchableOpacity>
            
            {isUrlInputVisible && (
              <CardComponent style={styles.urlInputContainer}>
                <TextInput
                  style={styles.urlInput}
                  placeholder="https://"
                  placeholderTextColor= {col.iconNoSelected}
                />
                <TouchableOpacity style={styles.connectButton}
                onPress={()=>router.push('/renderChatItem') }>
                  <TextComponent>Connect</TextComponent>
                </TouchableOpacity>
              </CardComponent>
            )}
            <TouchableOpacity 
              style={styles.qrOption}
              onPress={() => router.push('/scanscreen')} // Modifiez cette ligne
            >
              <CardComponent style={styles.qrIconContainer}>
                <ScannerIcon/>
              </CardComponent>
              <TextComponent >Scanner QR</TextComponent>
            </TouchableOpacity>
          </CardComponent>
        </CardComponent>
        
        {/* Recently Opened Section */}
        <CardComponent style={styles.recentSection}>
          <CardComponent style={styles.recentHeader}>
            <TextComponent color={col.iconNoSelected} >Recently opened</TextComponent>
            <TouchableOpacity>
              <TextComponent variante='body4' color="#ee2a15">CLEAR</TextComponent>
            </TouchableOpacity>
          </CardComponent>
          
          <TouchableOpacity style={styles.recentItem}>
            <CardComponent style={styles.appIconContainer}>
              <Image 
                source={require('@/assets/images/partial-react-logo.png')} 
                style={styles.appIcon} 
                // blurRadius={18}
              />
            </CardComponent>
            <TextComponent>xode-app</TextComponent>
          </TouchableOpacity>
        </CardComponent>
      </CardComponent>

    </SafeAreaView>
  );
};



export default HomeScreen;