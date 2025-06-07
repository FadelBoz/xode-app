// app/buildloadscreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

const BuildLoadScreen = () => {
  const params = useLocalSearchParams<{ qrData?: string }>();
  const router = useRouter(); // Importer et utiliser useRouter pour la navigation
  const [progress, setProgress] = useState(5);
  const [loadingMessage, setLoadingMessage] = useState('Building...');

  useEffect(() => {
    if (params.qrData) {
      console.log("Données QR reçues dans buildloadscreen:", params.qrData);
      // setLoadingMessage(`Processing data: ${params.qrData.substring(0, 20)}...`);
    } else {
      console.log("Aucune donnée QR reçue dans buildloadscreen.");
    }

    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setLoadingMessage('Build Complete!');
          console.log("Chargement terminé. Données QR traitées (si applicable):", params.qrData);

          // Redirection vers buildscreen.tsx
          // Utiliser setTimeout pour laisser le message "Build Complete!" visible un court instant
          setTimeout(() => {
            router.replace('/buildscreen'); // Rediriger vers buildscreen
          }, 1000); // Délai de 1 seconde avant la redirection

          return 100;
        }
        return prevProgress + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [params.qrData, router]); // Assurez-vous que router est dans les dépendances

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{loadingMessage}</Text>
          <Text style={styles.progressText}>{String(progress).padStart(3, '0')}%</Text>
        </View>
        <View style={styles.content}>
          {progress < 100 ? (
            <ActivityIndicator size="large" color="#000000" />
          ) : (
            <Text style={styles.xdText}>XD</Text>
          )}
           {params.qrData && progress === 100 && (
            <Text style={styles.qrDataText}>QR Data: {params.qrData}</Text>
           )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
  },
  progressText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  xdText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 20,
  },
  qrDataText: {
    marginTop: 15,
    fontSize: 14,
    color: 'gray',
    paddingHorizontal: 20,
    textAlign: 'center',
  }
});

export default BuildLoadScreen;