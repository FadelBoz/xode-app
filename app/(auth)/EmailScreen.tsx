import React, { useState, useRef } from 'react';
import { View, Keyboard, StyleSheet, TouchableOpacity, TextInput, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CardComponent } from '@/components/ui/CardComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TextComponent } from '@/components/text/TextComponent';
import { BlurView } from 'expo-blur';
import { ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { API_ENDPOINTS, API_URL } from '@/configs/global';


const EmailScreen = () => {
  const col = useThemeColors();
  const [isFocused, setIsFocused] = useState(false);
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isSendingEmail , setSendingEmail] = useState(false);
  const [isError, setError] = useState(false);
  const [ error , setIsError]= useState('Veuillez saisir un email correct');

  const animatedBorder = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const handleFocus = () => {
    setIsFocused(true);

    Animated.sequence([
      Animated.timing(shake, { toValue: 5, duration: 30, useNativeDriver: false }),
      Animated.timing(shake, { toValue: -5, duration: 30, useNativeDriver: false }),
      Animated.timing(shake, { toValue: 2, duration: 30, useNativeDriver: false }),
      Animated.timing(shake, { toValue: -2, duration: 30, useNativeDriver: false }),
      Animated.timing(shake, { toValue: 0, duration: 30, useNativeDriver: false }),
    ]).start();

    Animated.timing(animatedBorder, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(animatedBorder, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const validateEmail = (email:any) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.toLowerCase());
  };

  const handlePress = async () => {
    const isValid = validateEmail(email);
    setIsValidEmail(isValid);
    if (!isValid) {
      handleFocus(); // shake input
      setError(true);
      return;
    }
  
    setError(false);
    setSendingEmail(true);
    Keyboard.dismiss();
  
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.verifyUser}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
        router.replace('/PinCodeScreen'); // Succès : on passe à l'étape suivante
      } else {
        setError(true); // Échec : afficher un message
      }
    } catch (err) {
      setError(true);
    } finally {
      setSendingEmail(false);
    }
  };
  

  const borderColor = animatedBorder.interpolate({
    inputRange: [0, 1],
    outputRange: [col.border, isValidEmail ? col.primary3 :  col.destructive],
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    form: {
      maxWidth: '100%',
      overflow: 'hidden',
      borderRadius: 8,
      justifyContent: 'center',
    },
    formParent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 25,
    },
    urlInput: {
      color: col.text,
      padding: 15,
      minWidth: '88%',
      borderRadius: 10,
    },
    connectButton: {
      backgroundColor: col.submit,
      padding: 14,
      borderRadius: 5,
      minWidth: '88%',
      alignItems: 'center',
    },
    blurContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, // assure la priorité visuelle
      },
      
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ backgroundColor: col.background, flex: 1 }}>
        <CardComponent style={styles.container}>
          <CardComponent style={styles.formParent}>
            <TextComponent variante="subtitle0">Vérifiez votre Email</TextComponent>
            { !isError ? ( <CardComponent style={{ maxWidth: '85%' }}>
              <TextComponent color={col.ring}>
                Veuillez remplir votre email de connexion. Un code de vérification à 5 chiffres vous sera envoyé pour confirmer votre identité.
              </TextComponent>
            </CardComponent>):(
                <CardComponent>
                    <TextComponent variante='body4' color={col.destructive}>{error}</TextComponent>
                </CardComponent>
            )}
            <CardComponent style={styles.form}>
              <Animated.View
                style={{
                  borderWidth: 2,
                  borderRadius: 5,
                  borderColor: borderColor,
                  transform: [{ translateX: shake }],
                  marginBottom: 16,
                  backgroundColor: col.input,

                }}
              >
                <TextInput
                  style={styles.urlInput}
                  placeholder="MonEmail@gmail.com"
                  placeholderTextColor={col.ring}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setIsValidEmail(true);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Animated.View>

              <TouchableOpacity style={styles.connectButton} onPress={handlePress}>
                <TextComponent>Vérifier</TextComponent>
              </TouchableOpacity>
            </CardComponent>
          </CardComponent>
        </CardComponent>
        {isSendingEmail && (
            <BlurView
                intensity={10}
                tint="default"
                style={{
                ...StyleSheet.absoluteFillObject,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.2)',
                zIndex: 99, // au-dessus
                }}
            >
            <ActivityIndicator size="large" color={col.primary} />

            </BlurView>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default EmailScreen;
