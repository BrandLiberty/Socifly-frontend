import React, {useRef,useEffect} from 'react';
import {StyleSheet, Image, TouchableOpacity, Animated} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {getResponsiveValue} from '../styles/responsive';

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const handleNextPage = () => {
    navigation.navigate('LoginScreen');
  };

  useFocusEffect(() => {
    const fadeIn = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    });
    
    const growingAnim = Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    });

    const glowingAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    fadeIn.start();
    growingAnim.start();
    glowingAnim.start();

    const timer = setTimeout(handleNextPage, 3000);

    return () => {
      clearTimeout(timer);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0); // Reset the scale animation value
      opacityAnim.setValue(0); // Reset the opacity animation value
    };
  });



  return (
    <LinearGradient colors={['#8b0e68', '#020024']} style={styles.container}>
      <TouchableOpacity onPress={handleNextPage} activeScale={0.95}>
        <Animated.Image
          source={require('../assets/images/Sociflylogo.png')}
          resizeMode="contain"
          style={[
            styles.image,
            {
              opacity: fadeAnim,
              transform: [{scale: scaleAnim}],
            },
          ]}
        />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: getResponsiveValue(472, 236),
    height: getResponsiveValue(472, 236),
    alignSelf: 'center',
  },
});

export default SplashScreen;
