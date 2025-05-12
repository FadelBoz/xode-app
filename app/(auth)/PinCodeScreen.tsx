import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Animated, 
  Easing, 
  TouchableWithoutFeedback, 
  Keyboard,
  Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CardComponent } from '@/components/ui/CardComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TextComponent } from '@/components/text/TextComponent';
import { BlurView } from 'expo-blur';
import { ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

const PinCodeScreen = () => {
  const col = useThemeColors();
  const [code, setCode] = useState(['', '', '', '', '']);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isError, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null, null]);
  const shake = useRef(new Animated.Value(0)).current;
  const animatedBorders = useRef(code.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Focus the first input when component mounts
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);

  useEffect(() => {
    // Start countdown timer
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, canResend]);

  const handleInputChange = (text: string, index: number) => {
    // Only accept a single digit
    if (text.length > 1) {
      text = text.charAt(text.length - 1);
    }
    
    // Only accept numbers
    if (!/^[0-9]*$/.test(text)) {
      return;
    }
    
    // Update the code array
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    
    // Auto-focus next input if a digit was entered
    if (text.length === 1 && index < 4) {
      inputRefs.current[index + 1]?.focus();
      setCurrentIndex(index + 1);
    }
    
    // Check if all digits are filled to validate
    if (newCode.every(digit => digit.length === 1)) {
      validateCode(newCode);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace key
    if (e.nativeEvent.key === 'Backspace') {
      if (code[index] === '' && index > 0) {
        // Move to previous input if current is empty
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
        setCurrentIndex(index - 1);
      }
    }
  };

  const handleInputFocus = (index: number) => {
    setCurrentIndex(index);
    
    // Animate border
    Animated.timing(animatedBorders[index], {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  const handleInputBlur = (index: number) => {
    // Only reset border if not in error or success state
    Animated.timing(animatedBorders[index], {
    toValue: 0,
    duration: 200,
    useNativeDriver: false,
    }).start();
  };

  const validateCode = (codeToValidate: string[]) => {
    // Here you would typically call your API to validate the code
    // For demo purposes, let's assume code "12345" is valid
    const isValid = codeToValidate.join('') === '12345';
    
    if (!isValid) {
      setError(true);
      shakeAnimation();
      animateBordersToError();
    } else {
      setError(false);
      animateBordersToSuccess();
      setIsVerifying(true);
      
      // Simulate verification process
      setTimeout(() => {
        setIsVerifying(false);
        // Navigate to next screen on success
        router.replace('/homescreen');
      }, 1500);
    }
  };

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: false }),
      Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: false }),
      Animated.timing(shake, { toValue: 8, duration: 50, useNativeDriver: false }),
      Animated.timing(shake, { toValue: -8, duration: 50, useNativeDriver: false }),
      Animated.timing(shake, { toValue: 4, duration: 50, useNativeDriver: false }),
      Animated.timing(shake, { toValue: -4, duration: 50, useNativeDriver: false }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: false })
    ]).start();
  };

  const animateBordersToError = () => {
    animatedBorders.forEach(anim => {
      Animated.timing(anim, {
        toValue: 2,
        duration: 200,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }).start();
    });
  };

  const animateBordersToSuccess = () => {
    animatedBorders.forEach(anim => {
      Animated.timing(anim, {
        toValue: 3,
        duration: 200,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }).start();
    });
  };

  const handleResendCode = () => {
    if (canResend) {
      // Reset the code fields
      setCode(['', '', '', '', '']);
      setCurrentIndex(0);
      setError(false);
      setTimer(60);
      setCanResend(false);
      
      // Reset all animations
      animatedBorders.forEach(anim => {
        anim.setValue(0);
      });
      
      // Focus the first input
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  };

  const renderDigitInputs = () => {
    return code.map((digit, index) => {
      const borderColor = animatedBorders[index].interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [
          col.border, // Default
          col.primary2, // Focused
          col.destructive, // Error
          col.primaryForeground || 'green', // Success
        ],
      });
      const setRef = useCallback((el: TextInput | null, i: number) => {
        inputRefs.current[i] = el;
      }, []);
      return (
        <Pressable
          key={index}
          onPress={() => inputRefs.current[index]?.focus()}
          style={{ width: 50, height: 60 }}
        >
          <Animated.View
            style={[
              styles.digitBox,
              {
                borderColor: borderColor,
                backgroundColor: col.input,
                borderWidth: 2,
                transform: [{ translateX: shake }]
              }
            ]}
          >
            <TextInput
              ref={el => setRef(el, index)}
              style={styles.input}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleInputChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => handleInputFocus(index)}
              onBlur={() => handleInputBlur(index)}
              selectTextOnFocus
            />
          </Animated.View>
        </Pressable>
      );
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    formParent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 25,
    },
    digitBoxContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
      marginBottom: 20,
    },
    digitBox: {
      width: 50,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    input: {
      width: '100%',
      height: '100%',
      textAlign: 'center',
      fontSize: 24,
      color: col.text,
    },
    resendButton: {
      padding: 12,
      borderRadius: 5,
      marginTop: 20,
      alignItems: 'center',
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ backgroundColor: col.background, flex: 1 }}>
        <CardComponent style={styles.container}>
          <CardComponent style={styles.formParent}>
            <TextComponent variante="subtitle0">Vérification en 2 étapes</TextComponent>
            
            <CardComponent style={{ maxWidth: '85%' }}>
              <TextComponent color={col.ring} style={{ textAlign: 'center' }}>
                Nous avons envoyé un code à 5 chiffres à votre adresse email. Veuillez le saisir ci-dessous.
              </TextComponent>
            </CardComponent>
            
            {isError && (
              <CardComponent>
                <TextComponent variante='body4' color={col.destructive}>
                  Code incorrect. Veuillez réessayer.
                </TextComponent>
              </CardComponent>
            )}
            
            <View style={styles.digitBoxContainer}>
              {renderDigitInputs()}
            </View>
            
            <TouchableOpacity 
              style={[
                styles.resendButton, 
                { backgroundColor: canResend ? col.submit : 'transparent' }
              ]} 
              onPress={handleResendCode}
              disabled={!canResend}
            >
              <TextComponent color={canResend ? undefined : col.ring}>
                {canResend ? 'Renvoyer le code' : `Renvoyer dans ${timer}s`}
              </TextComponent>
            </TouchableOpacity>
          </CardComponent>
        </CardComponent>
        
        {isVerifying && (
          <BlurView
            intensity={10}
            tint="default"
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.2)',
              zIndex: 99,
            }}
          >
            <ActivityIndicator size="large" color={col.primary} />
          </BlurView>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default PinCodeScreen;