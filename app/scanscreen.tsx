import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Alert 
} from 'react-native';
import { CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const getCameraPermission = async () => {
      try {
       const { status } = await requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        
        if (status !== 'granted') {
          Alert.alert(
            "Autorisation refusée",
            "Vous devez autoriser l'accès à la caméra pour scanner un QR code.",
            [{ 
              text: "OK", 
              onPress: () => router.back()
            }]
          );
        }
      } catch (error) {
        console.error("Erreur lors de la demande d'autorisation de caméra:", error);
        Alert.alert(
          "Erreur",
          "Impossible d'accéder à la caméra. Veuillez vérifier les autorisations de votre appareil.",
          [{ 
            text: "OK", 
            onPress: () => router.back()
          }]
        );
      }
    };
    
    // Fonction pour demander les permissions
    const requestCameraPermissionsAsync = async () => {
      try {
        // const { permissions } = await import('expo-camera');
        // return await permissions.requestCameraPermissionsAsync();
      } catch (e) {
        console.error("Erreur lors de la demande d'autorisation:", e);
        return { status: 'denied' };
      }
    };
    
    getCameraPermission();
  }, []);
  
  const closeScanner = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.scannerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={styles.scannerHeader}>
        <Text style={styles.scannerTitle}>Scan XD</Text>
      </View>
      
      <View style={styles.cameraContainer}>
        {hasPermission === true && (
          <CameraView
            style={styles.camera}
            facing="back"
          >
            <View style={styles.scanFrame}>
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />
            </View>
          </CameraView>
        )}
        
        {hasPermission === false && (
          <View style={styles.noPermissionContainer}>
            <Text style={styles.noPermissionText}>
              L'accès à la caméra est nécessaire pour scanner un QR code.
            </Text>
          </View>
        )}
        
        {hasPermission === null && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Chargement de la caméra...</Text>
          </View>
        )}
      </View>
      
      <View style={styles.scannerFooter}>
        <TouchableOpacity style={styles.closeButton} onPress={closeScanner}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Styles pour l'écran principal
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  appBar: {
    backgroundColor: '#1A1D21',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2D31',
  },
  appBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  appBarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
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
    backgroundColor: '#2A2D31',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  serverIconText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 16,
  },
  helpText: {
    color: '#8D8D8D',
    fontSize: 12,
  },
  signInCard: {
    backgroundColor: '#1A1D21',
    borderRadius: 8,
    overflow: 'hidden',
  },
  signInPrompt: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2D31',
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  urlOption: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2D31',
  },
  urlOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 4,
  },
  urlInputContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2D31',
  },
  urlInput: {
    backgroundColor: '#2A2D31',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  connectButton: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
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
  recentTitle: {
    color: '#8D8D8D',
    fontSize: 14,
  },
  clearButton: {
    color: '#8D8D8D',
    fontSize: 14,
  },
  recentItem: {
    backgroundColor: '#1A1D21',
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
  appName: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
  },
  chevron: {
    color: '#8D8D8D',
    fontSize: 24,
  },
  
  // Styles pour l'écran de scanner
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scannerHeader: {
    padding: 16,
    alignItems: 'center',
  },
  scannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: 'white',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: 'white',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: 'white',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: 'white',
  },
  noPermissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noPermissionText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  scannerFooter: {
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#333',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
});

export default ScanScreen;