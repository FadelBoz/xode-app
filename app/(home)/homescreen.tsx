// xode-app/app/(home)/homescreen.tsx

import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  StatusBar, 
  Animated,
  Easing,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CardComponent } from '@/components/ui/CardComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TextComponent } from '@/components/text/TextComponent';
import ScannerIcon from '@/components/ui/ScannerIcon';
import { getUser } from '@/utils/storage';
import TerminalIcon from '@/components/ui/TerminalIcon';

const HomeScreen = () => {
  const [isUrlInputVisible, setIsUrlInputVisible] = useState(false);
  const router = useRouter();
  const col = useThemeColors();
  const [userName, setUserName] = useState<string | null>(null);

  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [error, setError] = useState('');

  const animatedBorder = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUserName(user?.name ?? null);
    };
    fetchUser();
  }, []);
  
  const handleFocus = () => {
    setIsValidUrl(true);
    setError('');
    Animated.timing(animatedBorder, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    Animated.timing(animatedBorder, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const shakeAnimation = () => {
    // CORRECTION : useNativeDriver mis à false pour correspondre à l'animation de bordure
    Animated.sequence([
      Animated.timing(shake, { toValue: 5, duration: 50, useNativeDriver: false }),
      Animated.timing(shake, { toValue: -5, duration: 50, useNativeDriver: false }),
      Animated.timing(shake, { toValue: 5, duration: 50, useNativeDriver: false }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: false }),
    ]).start();
  };
  
  const validateAndConnect = () => {
    Keyboard.dismiss();
    const urlRegex = /^xd:\/\/.+/;
    if (!urlRegex.test(url)) {
      setIsValidUrl(false);
      setError('L\'URL doit commencer par "xd://"');
      shakeAnimation();
      animatedBorder.setValue(1);
      return;
    }
    
    setIsValidUrl(true);
    setError('');
    console.log('Connexion au projet avec l\'URL:', url);
    router.push('/renderChatItem');
  };

  const currentBorderColor = animatedBorder.interpolate({
    inputRange: [0, 1],
    outputRange: [col.input, isValidUrl ? col.border : col.destructiveForeground],
  });
  
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
      // marginBottom: 8,
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
    animatedInputWrapper: {
      borderWidth: 2,
      borderRadius: 8,
      marginBottom: 8,
    },
    errorText: {
        marginBottom: 8,
        textAlign: 'center'
    }
  });

  return ( 
    <SafeAreaView style = {{backgroundColor: col.card, flex: 1}}>
      <CardComponent style={styles.appBar}>
          <TextComponent variante='subtitle1' color={col.icon}>XD</TextComponent>
      </CardComponent>
      <CardComponent style={{backgroundColor: col.background, flex:1}}>
        <CardComponent style={styles.section}>
          <CardComponent style={styles.sectionHeader}>
            <CardComponent style={styles.serverIcon}>
              <TerminalIcon width='28' height='30' fillColor={col.icon}></TerminalIcon>
            </CardComponent>
            <CardComponent style={styles.sectionTitle}>
              <TextComponent color={col.text2}>Server de Développement</TextComponent>
            </CardComponent>
            <TouchableOpacity>
              <TextComponent  color={col.iconNoSelected} >HELP</TextComponent>
            </TouchableOpacity>
          </CardComponent>
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
                <Animated.View style={[
                    styles.animatedInputWrapper,
                    { 
                        borderColor: currentBorderColor,
                        transform: [{ translateX: shake }]
                    }
                ]}>
                    <TextInput
                      style={styles.urlInput}
                      placeholder="xd://mon-projet"
                      placeholderTextColor={col.iconNoSelected}
                      value={url}
                      onChangeText={setUrl}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      autoCapitalize="none"
                    />
                </Animated.View>
                {/* {!isValidUrl && (
                    <TextComponent variante='body5' color={col.destructiveForeground} style={styles.errorText}>
                        {error}
                    </TextComponent>
                )} */}
                <TouchableOpacity 
                    style={styles.connectButton}
                    onPress={validateAndConnect}
                >
                  <TextComponent>Connect</TextComponent>
                </TouchableOpacity>
              </CardComponent>
            )}
            <TouchableOpacity 
              style={styles.qrOption}
              onPress={() => router.push('/scanscreen')}
            >
              <CardComponent style={styles.qrIconContainer}>
                <ScannerIcon/>
              </CardComponent>
              <TextComponent >Scanner QR</TextComponent>
            </TouchableOpacity>
          </CardComponent>
        </CardComponent>
        
        <CardComponent style={styles.recentSection}>
          <CardComponent style={styles.recentHeader}>
            <TextComponent color={col.iconNoSelected} >Recently opened</TextComponent>
            <TouchableOpacity>
              <TextComponent variante='body4' color={col.destructiveForeground}>CLEAR</TextComponent>
            </TouchableOpacity>
          </CardComponent>
          
          <TouchableOpacity style={styles.recentItem}>
            <CardComponent style={styles.appIconContainer}>
              <Image 
                source={require('@/assets/images/partial-react-logo.png')} 
                style={styles.appIcon} 
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