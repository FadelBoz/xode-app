// app/buildscreen.tsx
import React from 'react';
import { StatusBar, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const BuildScreen = () => {
  const router = useRouter();

  const navigateToHomeProject = () => {
    router.replace('/homeprojectscreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        {/* This screen is currently blank as per the image. */}
        {/* Add content here if needed, or it can serve as a simple placeholder. */}
        {/* <Text>Build Complete!</Text> */}
      </View>

      {/* Bouton flottant */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={navigateToHomeProject}
      >
        {/* Les commentaires JSX comme celui-ci sont corrects et ne devraient pas causer l'erreur */}
        {/* Vous pouvez utiliser une icône ici si vous le souhaitez */}
        {/* Par exemple, avec @expo/vector-icons : */}
        {/* <Ionicons name="home-outline" size={24} color="white" /> */}

        {/* Assurez-vous qu'il n'y a AUCUN texte ou espace ici, en dehors du composant <Text> ci-dessous */}
        <Text style={styles.floatingButtonText}>XD</Text>
      </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  floatingButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    right: 30,
    bottom: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default BuildScreen;