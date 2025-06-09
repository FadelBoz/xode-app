// app/buildscreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, StyleSheet, View, Text, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const BUTTON_SIZE = 60;
const MARGIN = 30;

const BuildScreen = () => {
  const router = useRouter();
  
  // AJOUT: États pour gérer le chargement du projet et de la WebView
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWebViewLoading, setWebViewLoading] = useState(true);

  // AJOUT: useEffect pour charger les données du projet au démarrage
  useEffect(() => {
    const loadProject = async () => {
      try {
        const activeProject = await getLastActiveProject();
        setProject(activeProject);
      } catch (error) {
        console.error("Erreur lors de la récupération du projet pour la preview:", error);
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

  // MODIFICATION: L'URI est maintenant construite à partir de l'état `project`
  const previewUri = project ? `${API_URL}preview/${project.publicUrl}` : '';

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
            <WebView 
              source={{ uri: previewUri }}
              style={styles.webview}
              onLoadStart={() => setWebViewLoading(true)}
              onLoadEnd={() => setWebViewLoading(false)}
            />
          {isWebViewLoading && (
            <ActivityIndicator style={StyleSheet.absoluteFill} size="large" color="#000000"/>
          )}
        </View>

        {/* Le bouton flottant reste au-dessus */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.floatingButton, animatedStyle]}>
            <TouchableOpacity 
              style={styles.touchable}
              onPress={navigateToHomeProject}
            >
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
    backgroundColor: '#FFFFFF',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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