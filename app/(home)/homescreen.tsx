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
  ActivityIndicator, // AJOUT
  Alert
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
// AJOUT: Importer les fonctions et types de projectStorage
import { getAllCachedProjects, saveProjectData, getProjectData, ProjectSummary, Project } from '@/utils/projectStorage';
import { useFocusEffect } from 'expo-router';
import { deleteLocalProject, getLocalProjects } from '../(services)/ProjectDownloader';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
// AJOUT: Définir un type pour les projets récents affichés
type RecentProject = {
  id: number;
  name: string;
  publicUrl: string;
};


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
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  // L'état attend maintenant un tableau de ProjectSummary, ce qui correspond à ce que la fonction retourne
  
  const [localProjects, setLocalProjects] = useState<ProjectSummary[]>([]);
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUserName(user?.name ?? null);
    };
    fetchUser();
  }, []);
   // MODIFICATION: Utilisation de useFocusEffect pour recharger les données chaque fois que l'écran est affiché
   useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        const user = await getUser();
        setUserName(user?.name ?? null);

        const cachedProjects = await getAllCachedProjects();
        setRecentProjects(cachedProjects);

        // AJOUT: Charger aussi les projets locaux
        const downloadedProjects = await getLocalProjects();
        setLocalProjects(downloadedProjects);
      };
      loadData();
    }, [])
  );
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
  // AJOUT: Fonction pour gérer la suppression d'un projet local
  const handleDeleteProject = (projectToDelete: ProjectSummary) => {
    Alert.alert(
      "Confirmer la suppression",
      `Êtes-vous sûr de vouloir supprimer les fichiers locaux du projet "${projectToDelete.name}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteLocalProject(projectToDelete.publicUrl);
              setLocalProjects(currentProjects => 
                currentProjects.filter(p => p.id !== projectToDelete.id)
              );
              Alert.alert("Succès", "Le projet a été supprimé de votre appareil.");
            } catch (error: any) {
              Alert.alert("Erreur", error.message);
            }
          }
        }
      ]
    );
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
          router.replace({
            pathname: '/buildloadscreen',
            params: { qrData: url } 
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
  
  // AJOUT: Fonction pour gérer le clic sur un projet récent
  const handleRecentProjectPress = async (projectToLoad: RecentProject) => {
    console.log(`Chargement du projet récent : ${projectToLoad.name}`);
    // On récupère les données complètes du projet depuis le cache
    const fullProjectData = await getProjectData(projectToLoad.id);
    if (fullProjectData) {
      // On le ré-enregistre pour mettre à jour son `lastAccessed` et le définir comme projet actif
      await saveProjectData(fullProjectData);
      // On navigue directement vers l'écran de build
      router.replace('/buildscreen');
    } else {
      Alert.alert("Erreur", "Impossible de charger les données de ce projet.");
    }
  };

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
      <ScrollView style={{backgroundColor: col.background, flex:1}}>
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
              onPress={() => router.replace('/scanscreen')}
            >
              <CardComponent style={styles.qrIconContainer}>
                <ScannerIcon/>
              </CardComponent>
              <TextComponent >Scanner QR</TextComponent>
            </TouchableOpacity>
          </CardComponent>
        </CardComponent>
        
        {/* MODIFICATION: La section des projets récents est maintenant dynamique */}
        <CardComponent style={styles.recentSection}>
          <CardComponent style={styles.recentHeader}>
            <TextComponent color={col.iconNoSelected} >Ouverts récemment</TextComponent>
            {recentProjects.length > 0 && (
              <TouchableOpacity>
                <TextComponent variante='body4' color={col.destructive}>EFFACER</TextComponent>
              </TouchableOpacity>
            )}
          </CardComponent>
          
          {recentProjects.length > 0 ? (
            recentProjects.map(p => (
              <TouchableOpacity 
                key={p.id} 
                style={styles.recentItem}
                onPress={() => handleRecentProjectPress(p)}
              >
                <CardComponent style={styles.appIconContainer}>
                  {/* Idéalement, l'icône viendrait des données du projet */}
                  <Image source={require('@/assets/images/partial-react-logo.png')} style={styles.appIcon} />
                </CardComponent>
                <TextComponent>{p.name}</TextComponent>
              </TouchableOpacity>
            ))
          ) : (
            <TextComponent color={col.muted} style={{textAlign: 'center', paddingVertical: 20}}>
              Aucun projet ouvert récemment.
            </TextComponent>
          )}

        </CardComponent>
         {/* --- AJOUT: Nouvelle section "Sur cet appareil" --- */}
        <CardComponent style={styles.recentSection}>
          <CardComponent style={styles.recentHeader}>
            <TextComponent color={col.iconNoSelected}>Sur cet appareil</TextComponent>
          </CardComponent>
          {localProjects.length > 0 ? (
            localProjects.map(p => (
              <View key={p.id} style={styles.recentItem}>
                <Image source={require('@/assets/images/partial-react-logo.png')} style={styles.appIcon} />
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <TextComponent>{p.name}</TextComponent>
                  <TextComponent variante="body5" color={col.muted}>{p.publicUrl}</TextComponent>
                </View>
                <TouchableOpacity onPress={() => handleDeleteProject(p)}>
                  <MaterialIcons name="delete-outline" size={24} color={col.destructive} />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <TextComponent color={col.muted} style={{textAlign: 'center', paddingVertical: 20}}>
              Aucun projet n'est téléchargé en local.
            </TextComponent>
          )}
        </CardComponent>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;