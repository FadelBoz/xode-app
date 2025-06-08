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
  Keyboard,
  ActivityIndicator // AJOUT
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CardComponent } from '@/components/ui/CardComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TextComponent } from '@/components/text/TextComponent';
import ScannerIcon from '@/components/ui/ScannerIcon';
import { getUser } from '@/utils/storage';
import TerminalIcon from '@/components/ui/TerminalIcon';
import { API_URL } from '@/configs/global'; // AJOUT

const HomeScreen = () => {
  const [isUrlInputVisible, setIsUrlInputVisible] = useState(false);
  const router = useRouter();
  const col = useThemeColors();
  const [userName, setUserName] = useState<string | null>(null);

  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [error, setError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false); // AJOUT

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
    Animated.sequence([
      Animated.timing(shake, { toValue: 5, duration: 50, useNativeDriver: false }),
      Animated.timing(shake, { toValue: -5, duration: 50, useNativeDriver: false }),
      Animated.timing(shake, { toValue: 5, duration: 50, useNativeDriver: false }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: false }),
    ]).start();
  };
  
  // MODIFICATION : Mise à jour complète de la fonction de connexion
  const validateAndConnect = async () => {
    Keyboard.dismiss();
    const urlRegex = /^xd:\/\/.+/;
    if (!urlRegex.test(url)) {
      setIsValidUrl(false);
      setError('L\'URL doit commencer par "xd://".');
      shakeAnimation();
      animatedBorder.setValue(1);
      return;
    }
  
    setIsValidUrl(true);
    setError('');
    setIsConnecting(true);
  
    const publicUrl = url.replace('xd://', '');
    const checkUrl = `${API_URL}preview/exists/${publicUrl}`;
    const getUrl = `${API_URL}preview/${publicUrl}`;
  
    try {
      const response = await fetch(checkUrl);
  
      if (response.ok) {
        const json = await response.json();
        if (json.exists) {
          router.push({
            pathname: '/project/buildloadscreen',
            params: { qrData: getUrl } 
          });
        } else {
          setError('Projet introuvable.');
          setIsValidUrl(false);
          shakeAnimation();
        }
      } else {
        setError(`Projet introuvable ou erreur serveur (Status: ${response.status})`);
        setIsValidUrl(false);
        shakeAnimation();
      }
    } catch (e) {
      console.error(e);
      setError('Impossible de se connecter au serveur. Vérifiez votre connexion.');
      setIsValidUrl(false);
      shakeAnimation();
    } finally {
      setIsConnecting(false);
    }
  };
  
  const currentBorderColor = animatedBorder.interpolate({
    inputRange: [0, 1],
    outputRange: [col.input, isValidUrl ? col.border : col.destructive],
  });
  
    // ... (styles existants)

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
    },
    connectButton: {
      backgroundColor: col.validated,
      padding: 14,
      borderRadius: 6,
      alignItems: 'center',
      flexDirection: 'row', // Pour l'indicateur de chargement
      justifyContent: 'center'
    },
    connectButtonText: {
      color: col.primaryForeground, // Assurez-vous d'avoir une couleur de texte pour le bouton
      marginRight: 10, // Espace entre le texte et l'indicateur
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
                <Animated.View style={[ styles.animatedInputWrapper, { borderColor: currentBorderColor, transform: [{ translateX: shake }] } ]}>
                    <TextInput
                      style={styles.urlInput}
                      placeholder="xd://mon-projet"
                      placeholderTextColor={col.iconNoSelected}
                      value={url}
                      onChangeText={(text) => {
                        setUrl(text);
                        if (!isValidUrl) setIsValidUrl(true); // Réinitialise l'erreur en tapant
                      }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      autoCapitalize="none"
                      editable={!isConnecting} // Bloque l'input pendant la connexion
                    />
                </Animated.View>
                <TouchableOpacity 
                    style={[styles.connectButton, { opacity: isConnecting ? 0.7 : 1 }]}
                    onPress={validateAndConnect}
                    disabled={isConnecting}
                >
                  <TextComponent style={styles.connectButtonText}>
                    {isConnecting ? 'Connexion...' : 'Connect'}
                  </TextComponent>
                  {isConnecting && <ActivityIndicator size="small" color={col.primaryForeground} />}
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
              <TextComponent variante='body4' color={col.destructive}>CLEAR</TextComponent>
            </TouchableOpacity>
          </CardComponent>
          <TouchableOpacity style={styles.recentItem}>
            <CardComponent style={styles.appIconContainer}>
              <Image source={require('@/assets/images/partial-react-logo.png')} style={styles.appIcon} />
            </CardComponent>
            <TextComponent>xode-app</TextComponent>
          </TouchableOpacity>
          {/* <TextComponent variante='body5' color={col.destructive} style={styles.errorText}>
              {error}
          </TextComponent> */}
        </CardComponent>
      </CardComponent>

    </SafeAreaView>
  );
};

export default HomeScreen;