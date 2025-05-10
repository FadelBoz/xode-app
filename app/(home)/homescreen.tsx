import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; // Ajoutez cette importation
import { CardComponent } from '@/components/ui/CardComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TextComponent } from '@/components/text/TextComponent';
import ScannerIcon from '@/components/ui/ScannerIcon';

const HomeScreen = () => {
  const [isUrlInputVisible, setIsUrlInputVisible] = useState(false);
  const router = useRouter(); // Ajoutez cette ligne
  const col = useThemeColors();

  const styles = StyleSheet.create({
    appBar: {
      backgroundColor: col.background,
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
      backgroundColor: col.card,
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
    },
    urlInput: {
      backgroundColor: col.border,
      color: col.text,
      padding: 12,
      borderRadius: 6,
      marginBottom: 16,
    },
    connectButton: {
      backgroundColor: col.card,
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
      flexDirection: 'row',
      alignItems: 'center',
    },
    appIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
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
    <SafeAreaView style = {{backgroundColor: col.background , flex: 1}}>
      {/* App Bar */}
      <CardComponent style={styles.appBar}>
          <TextComponent variante='subtitle1'>XD</TextComponent>
      </CardComponent>

      {/* Development Servers Section */}
      <CardComponent style={styles.section}>
        <CardComponent style={styles.sectionHeader}>
          <CardComponent style={styles.serverIcon}>
            <TextComponent>$~</TextComponent>
          </CardComponent>
          <CardComponent style={styles.sectionTitle}>
            <TextComponent >Development</TextComponent>
          </CardComponent>
          <TouchableOpacity>
            <TextComponent >HELP</TextComponent>
          </TouchableOpacity>
        </CardComponent>
        
        {/* Sign In Card */}
        <CardComponent style={styles.signInCard}>
          <TouchableOpacity style={styles.signInPrompt}>
            <TextComponent>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Placeat laboriosam sint 
              unde porro eveniet voluptatem rerum veritatis reprehenderit consequatur suscipit architecto
               ea saepe tenetur atque ullam deleniti repellendus, non magnam!
            </TextComponent>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.urlOption}
            onPress={() => setIsUrlInputVisible(!isUrlInputVisible)}
          >
            <TextComponent >
              {isUrlInputVisible ? '▼' : '▶'} Enter URL manually
            </TextComponent>
          </TouchableOpacity>
          
          {isUrlInputVisible && (
            <CardComponent style={styles.urlInputContainer}>
              <TextInput
                style={styles.urlInput}
                placeholder="exp://"
                placeholderTextColor="#8D8D8D"
                defaultValue="exp://"
              />
              <TouchableOpacity style={styles.connectButton}>
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
            <TextComponent>Scan QR code</TextComponent>
          </TouchableOpacity>
        </CardComponent>
      </CardComponent>
      
      {/* Recently Opened Section */}
      <CardComponent style={styles.recentSection}>
        <CardComponent style={styles.recentHeader}>
          <TextComponent >Recently opened</TextComponent>
          <TouchableOpacity>
            <TextComponent variante='body4' color={col.text2}>CLEAR</TextComponent>
          </TouchableOpacity>
        </CardComponent>
        
        <TouchableOpacity style={styles.recentItem}>
          <CardComponent style={styles.appIconContainer}>
            <Image 
              source={{ uri: 'https://cdn.jsdelivr.net/gh/expo/expo-cli@master/assets/fig/icon.png' }} 
              style={styles.appIcon} 
            />
          </CardComponent>
          <TextComponent>xode-app</TextComponent>
        </TouchableOpacity>
      </CardComponent>
    </SafeAreaView>
  );
};



export default HomeScreen;