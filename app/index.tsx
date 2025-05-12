import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { getUser } from '@/utils/storage';

const LoadScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const timer = setTimeout(() => {
    //   router.replace('/homescreen'); // Redirection après 3s
    // }, 3000);

    (async () => {
      const user = await getUser();
      if (user) {
        router.replace('/homescreen'); // utilisateur connu
      } else {
        router.replace('/EmailScreen'); // utilisateur inconnu
      }
      setLoading(false);
    })();
    // return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/XODE.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text>Preview</Text>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  logo: {
    width: width * 0.5,
    height: width * 0.5,
  },
});

export default LoadScreen;