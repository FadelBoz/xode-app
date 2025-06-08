// app/project/buildloadscreen.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProjectLoader } from '@/hooks/useProjectLoader'; // AJOUT: Importer notre nouveau hook
import { useThemeColors } from '@/hooks/useThemeColors'; // AJOUT: Pour les couleurs
import { TextComponent } from '@/components/text/TextComponent'; // AJOUT: Pour un affichage cohérent

const BuildLoadScreen = () => {
  const params = useLocalSearchParams<{ qrData?: string }>();
  const router = useRouter();
  const colors = useThemeColors();

  // UTILISATION DU HOOK: Toute la logique complexe est maintenant ici.
  const { isLoading, error, progress, loadingMessage } = useProjectLoader(params.qrData);

  // Ce `useEffect` gère la redirection une fois le chargement terminé.
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (error) {
          // En cas d'erreur, on pourrait retourner à l'accueil avec un message
          // Pour l'instant, on retourne simplemement.
          console.error("Redirection annulée à cause d'une erreur:", error);
          router.back();
        } else {
          // Si tout s'est bien passé, on redirige vers l'écran du projet.
          // Note : La redirection vers buildscreen n'est peut-être plus nécessaire, 
          // on pourrait aller directement à homeprojectscreen.
          router.replace('/homeprojectscreen');
        }
      }, 1200); // On laisse un peu de temps pour afficher le message final.

      return () => clearTimeout(timer);
    }
  }, [isLoading, error, router]);


  // Le reste du composant est juste pour l'affichage.
  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1 },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 15,
      alignItems: 'center',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 20,
      padding: 20,
    },
    xdText: {
      fontSize: 80,
      fontWeight: 'bold',
      color: colors.text,
    },
    errorText: {
      color: colors.destructive,
      textAlign: 'center',
    }
  });


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={colors.text === '#FFFFFF' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TextComponent variante='subtitle2'>{loadingMessage}</TextComponent>
          <TextComponent variante='subtitle2'>{String(progress).padStart(3, '0')}%</TextComponent>
        </View>
        <View style={styles.content}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : error ? (
            <>
              <TextComponent variante='subtitle0' color={colors.destructive}>Erreur</TextComponent>
              <TextComponent style={styles.errorText}>{error}</TextComponent>
            </>
          ) : (
            <Text style={styles.xdText}>XD</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BuildLoadScreen;