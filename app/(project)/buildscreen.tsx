// app/buildscreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, StyleSheet, View, Text, Dimensions, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { API_URL } from '@/configs/global';
import WebView from 'react-native-webview';

// AJOUT: Importer le nécessaire depuis le storage
import { Project, getLastActiveProject } from '@/utils/projectStorage';
import { getToken } from '@/utils/storage';
import { CardComponent } from '@/components/ui/CardComponent';
import { TextComponent } from '@/components/text/TextComponent';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const BUTTON_SIZE = 60;
const MARGIN = 30;

const BuildScreen = () => {
  const router = useRouter();
  
  // AJOUT: États pour gérer le chargement du projet et de la WebView
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWebViewLoading, setWebViewLoading] = useState(true);
  // NOUVEAU: État pour stocker le contenu HTML récupéré
  const [htmlContent, setHtmlContent] = useState<string>('');
  // NOUVEAU: États pour le menu déroulant
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDebugText, setShowDebugText] = useState(false);

  // AJOUT: useEffect pour charger les données du projet au démarrage
  useEffect(() => {
    const loadProject = async () => {
      try {
        const activeProject = await getLastActiveProject();
        setProject(activeProject);

        // AJOUT: Logique de test pour récupérer le HTML
        if (activeProject) {
          console.log(`Tentative de fetch pour la preview de : ${activeProject.publicUrl}`);
          const token = await getToken(); // Même si la route est publique, c'est une bonne pratique
          const previewUri = `${API_URL}preview/${activeProject.publicUrl}`;
          
          const response = await fetch(previewUri, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          console.log(`Statut de la réponse du serveur: ${response.status}`);

          if (!response.ok) {
            throw new Error(`Le serveur a répondu avec une erreur: ${response.status}`);
          }
          
          const htmlContentFetched = await response.text();
          
          // NOUVEAU: Stocker le contenu HTML dans l'état
          setHtmlContent(htmlContentFetched);
          
          // Affichez les 200 premiers caractères du HTML dans la console pour vérifier
          console.log('Début du contenu HTML reçu :', htmlContentFetched.substring(0, 200) + '...');
        }

      } catch (error) {
        console.error("Erreur lors de la récupération du projet ou de sa preview:", error);
        // En cas d'erreur, définir un message d'erreur dans le contenu HTML
        setHtmlContent(`<p>Erreur lors du chargement: ${error}</p>`);
      } finally {
        setIsLoading(false);
      }
    };
    loadProject();
  }, []);

  const translateX = useSharedValue(screenWidth - BUTTON_SIZE - MARGIN);
  const translateY = useSharedValue(screenHeight - BUTTON_SIZE - MARGIN - 13);
  
  
  const navigateToHomeProject = () => {
    router.replace('/homeprojectscreen');
  };

  // NOUVEAU: Fonction pour basculer entre WebView et affichage du texte
  const toggleDebugView = () => {
    setShowDebugText(!showDebugText);
  };

  // AJOUT: Fonctions pour le menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const showCodeView = () => {
    setShowDebugText(true);
    setIsMenuOpen(false);
  };
  const showWebView = () => {
    setShowDebugText(false);
    setIsMenuOpen(false);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: Record<string, unknown>) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context: Record<string, unknown>) => {
      translateX.value = (context.startX as number) + event.translationX;
      translateY.value = (context.startY as number) + event.translationY;
    },
    onEnd: () => {
      // Limiter les positions pour que le bouton reste dans l'écran
      const maxX = screenWidth - BUTTON_SIZE - 10;
      const maxY = screenHeight - BUTTON_SIZE - 5; // Marge pour la safe area
      
      if (translateX.value < 10) {
        translateX.value = withSpring(10);
      } else if (translateX.value > maxX) {
        translateX.value = withSpring(maxX);
      }
      
      if (translateY.value < 50) { // Marge du haut
        translateY.value = withSpring(50);
      } else if (translateY.value > maxY) {
        translateY.value = withSpring(maxY);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  // AJOUT: Affichage pendant le chargement initial des données du projet
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={{marginTop: 10}}>Chargement du projet...</Text>
      </SafeAreaView>
    );
  }

  // AJOUT: Affichage si aucun projet n'est trouvé
  if (!project) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Aucun projet actif trouvé.</Text>
        <TouchableOpacity onPress={() => router.replace('/(home)/homescreen')} style={{marginTop: 20}}>
            <Text>Retour à l'accueil</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.container}>
        {/* <CardComponent style={{backgroundColor:""}}><TextComponent>Hey</TextComponent></CardComponent> */}

          {showDebugText ? (
            <ScrollView style={styles.debugScrollView} contentContainerStyle={styles.debugScrollContent}>
              <View style={styles.debugHeader}>
                <TouchableOpacity onPress={showWebView} style={styles.backButton}>
                  <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
                  <Text style={styles.backButtonText}>Retour à la WebView</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.debugText}>
                Contenu récupéré ({htmlContent.length} caractères):
              </Text>
              <Text style={styles.htmlContent} selectable={true}>
                {htmlContent || 'Aucun contenu HTML récupéré'}
              </Text>
            </ScrollView>
          ) : (
            <>
              {htmlContent ? (
            //  <CardComponent style={styles.webview}>

            //  </CardComponent>

                <WebView
                  // --- Props existantes ---
                  source={{
                    html: htmlContent,
                    baseUrl: API_URL.replace('/api/', '')
                  }}
                  style={styles.webview}
                  onLoadStart={() => setWebViewLoading(true)}
                  onLoadEnd={() => setWebViewLoading(false)}

                  // --- AJOUTS POUR RÉSOUDRE LE PROBLÈME D'AFFICHAGE ---

                  // 1. Activer JavaScript (essentiel)
                  javaScriptEnabled={true}

                  // 2. Activer le stockage DOM (important)
                  domStorageEnabled={true}

                  // 3. Autoriser toutes les origines pour le débogage
                  originWhitelist={['*']}

                  // 4. Améliorer le logging des erreurs
                  onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('Erreur de WebView: ', nativeEvent);
                    // Vous pouvez aussi stocker l'erreur dans un état pour l'afficher à l'utilisateur
                    // setHtmlContent(`<h1>Erreur WebView</h1><p>${nativeEvent.description}</p>`);
                  }}
                  onHttpError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn(
                      `Erreur HTTP dans la WebView: ${nativeEvent.statusCode} pour ${nativeEvent.url}`
                    );
                  }}
                />
                // <WebView
                //     // TEST: On utilise une URL HTTPS simple et connue
                //     source={{ uri: 'https://reactnative.dev/' }}
                    
                //     style={styles.webview}
                //     onLoadStart={() => setWebViewLoading(true)}
                //     onLoadEnd={() => setWebViewLoading(false)}
                //     javaScriptEnabled={true}
                //     domStorageEnabled={true}
                //     onError={(syntheticEvent) => {
                //         const { nativeEvent } = syntheticEvent;
                //         console.warn('Erreur de WebView: ', nativeEvent);
                //     }}
                // />
              ) : (
                <Text style={styles.noContentText}>Aucun contenu à afficher</Text>
              )}
              
              {isWebViewLoading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="#000000"/>
                  <Text style={styles.loadingText}>Chargement de la WebView...</Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Menu déroulant du bouton flottant */}
        {isMenuOpen && (
          <Animated.View style={[styles.menuContainer, { bottom: screenHeight - translateY.value, right: screenWidth - translateX.value - BUTTON_SIZE / 2 }]}>
            <TouchableOpacity style={styles.menuItem} onPress={navigateToHomeProject}>
              <MaterialIcons name="dashboard" size={20} color="#FFFFFF" />
              <Text style={styles.menuItemText}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={showCodeView}>
              <MaterialIcons name="code" size={20} color="#FFFFFF" />
              <Text style={styles.menuItemText}>Code</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Le bouton flottant */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.floatingButton, animatedStyle]}>
            <TouchableOpacity style={styles.touchable} onPress={toggleMenu}>
              <Text style={styles.floatingButtonText}>XD</Text>
            </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>
      </SafeAreaView>
    </GestureHandlerRootView>

  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    // backgroundColor: '#333',
  },
  gestureContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#fff',
  },
  // NOUVEAUX STYLES pour le menu déroulant
  menuContainer: {
    position: 'absolute',
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 120,
    // Le menu apparaît au-dessus du bouton
    bottom: BUTTON_SIZE + 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  // STYLES pour la vue debug améliorée
  debugHeader: {
    marginBottom: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    marginLeft: 8,
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  debugScrollView: {
    flex: 1,
    width: '100%',
  },
  debugScrollContent: {
    padding: 15,
  },
  debugText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  htmlContent: {
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 5,
    lineHeight: 16,
  },
  noContentText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  floatingButton: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: 'black',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  touchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BUTTON_SIZE / 2,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default BuildScreen;