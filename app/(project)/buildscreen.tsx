// app/project/buildscreen.tsx

import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View, Text, Dimensions, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import WebView from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import * as Device from 'expo-device';
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes';

import { API_URL } from '@/configs/global';
import { Project, getLastActiveProject } from '@/utils/projectStorage';
import { getToken } from '@/utils/storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const BUTTON_SIZE = 60;
const MARGIN = 30;

const BuildScreen = () => {
  const router = useRouter();
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWebViewLoading, setWebViewLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDebugText, setShowDebugText] = useState(false);
  const [webViewSource, setWebViewSource] = useState<WebViewSource | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const activeProject = await getLastActiveProject();
        setProject(activeProject);

        if (!activeProject) {
          throw new Error("Aucun projet actif trouvé.");
        }

        // On vérifie si le projet a un point d'entrée défini
        if (!activeProject.entryFilePath) {
          throw new Error("Le projet n'a pas de fichier d'entrée (entryFilePath) défini.");
        }

        // Construction du chemin local SANS ambigüité
        const localProjectRoot = `${FileSystem.documentDirectory}projects/${activeProject.publicUrl}`;
        const localEntryPoint = `${localProjectRoot}/${activeProject.entryFilePath}`;
        
        const fileInfo = await FileSystem.getInfoAsync(localEntryPoint);

        if (fileInfo.exists) {
          // --- OPTION 1: Le projet est en local ---
          console.log(`Projet local trouvé. Chargement depuis : ${localEntryPoint}`);
          const localHtml = await FileSystem.readAsStringAsync(localEntryPoint);
          setHtmlContent(localHtml); // Pour le mode debug
          setWebViewSource({ uri: localEntryPoint });

        } else {
          // --- OPTION 2: Le projet n'est pas en local ---
          console.log(`Projet non trouvé en local. Chargement depuis l'API pour : ${activeProject.publicUrl}`);
          const token = await getToken();
          const previewUri = `${API_URL}preview/${activeProject.publicUrl}`;
          
          const response = await fetch(previewUri, { headers: { 'Authorization': `Bearer ${token}` } });
          if (!response.ok) throw new Error(`Erreur serveur: ${response.status}`);
          
          const fetchedHtml = await response.text();
          setHtmlContent(fetchedHtml); // Pour le mode debug
          setWebViewSource({
            html: fetchedHtml,
            baseUrl: API_URL.replace('/api/', '')
          });
        }
      } catch (error: any) {
        console.error("Erreur lors de la préparation de la preview:", error);
        setHtmlContent(`<h1>Erreur de chargement</h1><p>${error.message}</p>`);
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, []);

  const logDeviceLoad = async () => {
    if (!project) return;
    try {
        const token = await getToken();
        const deviceName = Device.deviceName || 'Appareil inconnu';
        await fetch(`${API_URL}mobile/log-preview`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                project_id: project.id,
                device_name: deviceName,
            }),
        });
        console.log(`Log envoyé pour le projet ${project.id} sur l'appareil ${deviceName}`);
    } catch (error) {
        console.error("Erreur lors de l'envoi du log:", error);
    }
  };

  const translateX = useSharedValue(screenWidth - BUTTON_SIZE - MARGIN);
  const translateY = useSharedValue(screenHeight - BUTTON_SIZE - MARGIN - 13);
  const navigateToHomeProject = () => router.replace('/homeprojectscreen');
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const showCodeView = () => { setShowDebugText(true); setIsMenuOpen(false); };
  const showWebView = () => { setShowDebugText(false); setIsMenuOpen(false); };
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => { ctx.startX = translateX.value; ctx.startY = translateY.value; },
    onActive: (e, ctx: any) => { translateX.value = ctx.startX + e.translationX; translateY.value = ctx.startY + e.translationY; },
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
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }, { translateY: translateY.value }] }));

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#000000" /><Text style={{marginTop: 10}}>Chargement du projet...</Text>
      </SafeAreaView>
    );
  }

  if (!project) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Aucun projet actif trouvé.</Text>
        <TouchableOpacity onPress={() => router.replace('/(home)/homescreen')} style={{marginTop: 20}}>
            <Text>Retour à l'accueil</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.container}>
          {showDebugText ? (
            <ScrollView style={styles.debugScrollView} contentContainerStyle={styles.debugScrollContent}>
              <View style={styles.debugHeader}>
                <TouchableOpacity onPress={showWebView} style={styles.backButton}><MaterialIcons name="arrow-back" size={24} color="#007AFF" /><Text style={styles.backButtonText}>Retour au Preview</Text></TouchableOpacity>
              </View>
              <Text style={styles.debugText}>Contenu récupéré ({htmlContent.length} caractères):</Text>
              <Text style={styles.htmlContent} selectable={true}>{htmlContent || 'Aucun contenu reçu.'}</Text>
            </ScrollView>
          ) : (
            <>
              {webViewSource ? (
                <WebView
                  source={webViewSource}
                  style={styles.webview}
                  onLoadStart={() => setWebViewLoading(true)}
                  onLoadEnd={() => { setWebViewLoading(false); logDeviceLoad(); }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  originWhitelist={['*']}
                  allowFileAccess={true}
                  allowFileAccessFromFileURLs={true}
                  allowUniversalAccessFromFileURLs={true}
                  onError={(e) => console.warn('Erreur WebView:', e.nativeEvent)}
                  onHttpError={(e) => console.warn(`Erreur HTTP: ${e.nativeEvent.statusCode}`)}
                />
              ) : (
                <View style={styles.loadingOverlay}><ActivityIndicator size="large" /><Text style={{marginTop: 10}}>Préparation de l'aperçu...</Text></View>
              )}
              {isWebViewLoading && (
                <View style={styles.loadingOverlay}><ActivityIndicator size="large" /><Text style={styles.loadingText}>Chargement de la WebView...</Text></View>
              )}
            </>
          )}
        </View>

        {isMenuOpen && (
          <Animated.View style={[styles.menuContainer, { bottom: screenHeight - translateY.value, right: screenWidth - translateX.value - BUTTON_SIZE / 2 }]}>
            <TouchableOpacity style={styles.menuItem} onPress={navigateToHomeProject}><MaterialIcons name="dashboard" size={20} color="#FFFFFF" /><Text style={styles.menuItemText}>Menu</Text></TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={navigateToHomeProject}><MaterialIcons name="dashboard" size={20} color="#FFFFFF" /><Text style={styles.menuItemText}>Dashboard</Text></TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={showCodeView}><MaterialIcons name="code" size={20} color="#FFFFFF" /><Text style={styles.menuItemText}>Code</Text></TouchableOpacity>
          </Animated.View>
        )}

        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.floatingButton, animatedStyle]}>
            <TouchableOpacity style={styles.touchable} onPress={toggleMenu}><Text style={styles.floatingButtonText}>XD</Text></TouchableOpacity>
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
  }
});

export default BuildScreen;