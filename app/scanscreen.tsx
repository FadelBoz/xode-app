import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera'; // ✅ Ajouté Camera ici
import { useRouter } from 'expo-router';

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync(); // ✅ Utilisation correcte
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
