// app/scanscreen.tsx
import { Camera, CameraView, BarcodeScanningResult } from 'expo-camera';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const requestCameraPermissionsAsync = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        return { status };
      } catch {
        Alert.alert(
          "Erreur de Permission",
          "Une erreur est survenue lors de la demande d&apos;autorisation de la caméra."
        );
        return { status: 'denied' };
      }
    };

    const getCameraPermission = async () => {
      try {
        const result = await requestCameraPermissionsAsync();
        if (!result || typeof result.status === 'undefined') {
          setHasPermission(false);
          Alert.alert(
            "Erreur Inattendue",
            "Impossible d&apos;obtenir le statut de la permission caméra.",
            [{ text: "OK", onPress: () => router.back() }]
          );
          return;
        }
        const { status } = result;
        setHasPermission(status === 'granted');
        if (status !== 'granted') {
          Alert.alert(
            "Autorisation refusée",
            "Vous devez autoriser l&apos;accès à la caméra pour scanner un QR code.",
            [{ text: "OK", onPress: () => router.back() }]
          );
        }
      } catch {
        setHasPermission(false);
        Alert.alert(
          "Erreur",
          "Impossible d&apos;accéder à la caméra. Veuillez vérifier les autorisations de votre appareil ou une erreur s&apos;est produite.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      }
    };

    getCameraPermission();
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      setScanned(false);
      return () => {};
    }, [])
  );

  const handleBarCodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);

    if (
      scanningResult &&
      scanningResult.type && // Assurez-vous que 'type' est pertinent ou retirez-le si seules les données importent
      typeof scanningResult.data === 'string'
    ) {
      console.log(`QR Code Data to pass: ${scanningResult.data}`); // Pour débogage
      // Naviguer vers buildloadscreen en passant les données du QR code
      router.replace({
        pathname: '/buildloadscreen',
        params: { qrData: scanningResult.data }, // Passer les données ici
      });
    } else {
      Alert.alert(
        "Scan Invalide",
        "Le QR code scanné ne contient pas les données attendues. Veuillez réessayer."
      );
      setScanned(false);
    }
  };

  const closeScanner = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.scannerHeader}>
        <Text style={styles.scannerTitle}>Scan QR Code</Text>
      </View>

      {hasPermission === true && (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          >
            <View style={styles.scanFrame}>
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />
            </View>
          </CameraView>
        </View>
      )}

      {hasPermission === false && (
        <View style={styles.noPermissionContainer}>
          <Text style={styles.noPermissionText}>
            L&apos;accès à la caméra est nécessaire pour scanner un QR code.{"\n"}
            Veuillez vérifier les autorisations de l&apos;application.
          </Text>
        </View>
      )}

      {hasPermission === null && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Demande d&apos;accès à la caméra...</Text>
        </View>
      )}

      <View style={styles.scannerFooter}>
        <TouchableOpacity style={styles.closeButton} onPress={closeScanner}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styles (identiques à votre version précédente)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scannerHeader: { padding: 16, alignItems: 'center', backgroundColor: '#1A1D21' },
  scannerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  cameraContainer: { flex: 1, justifyContent: 'center' },
  camera: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'absolute',
    top: '35%',
    left: '50%',
    marginLeft: -125,
    marginTop: -125,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
  },
  cornerTopLeft: {
    position: 'absolute', top: -2, left: -2, width: 50, height: 50,
    borderTopWidth: 4, borderLeftWidth: 4, borderColor: 'white',
  },
  cornerTopRight: {
    position: 'absolute', top: -2, right: -2, width: 50, height: 50,
    borderTopWidth: 4, borderRightWidth: 4, borderColor: 'white',
  },
  cornerBottomLeft: {
    position: 'absolute', bottom: -2, left: -2, width: 50, height: 50,
    borderBottomWidth: 4, borderLeftWidth: 4, borderColor: 'white',
  },
  cornerBottomRight: {
    position: 'absolute', bottom: -2, right: -2, width: 50, height: 50,
    borderBottomWidth: 4, borderRightWidth: 4, borderColor: 'white',
  },
  noPermissionContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  noPermissionText: {
    color: '#FFFFFF', textAlign: 'center', fontSize: 16, lineHeight: 24,
  },
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  loadingText: { color: '#FFFFFF', fontSize: 16 },
  scannerFooter: {
    padding: 20, alignItems: 'center', backgroundColor: '#1A1D21',
  },
  closeButton: {
    backgroundColor: '#333', width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
  },
  closeButtonText: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
});

export default ScanScreen;