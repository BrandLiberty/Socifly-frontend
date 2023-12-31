import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  SafeAreaView,
  Image,
} from 'react-native';
import global from '../styles/global';
import TextinputA from '../atoms/TextinputA';
import ButtonA from '../atoms/ButtonA';
import { BLACK, LINKS, PRIMARY } from '../styles/colors';
import { getResponsiveValue } from '../styles/responsive';
import OTPInputView from '@twotalltotems/react-native-otp-input';
// import { useOtpVerify, getHash, startOtpListener } from 'react-native-otp-verify';
import stringsoflanguages from '../utils/ScreenStrings';
import { useLocal } from '../context/ProfileContext';
import { FETCH } from '../services/fetch';
import CustomModal from '../atoms/CustomModal';
import Icon from 'react-native-vector-icons/AntDesign';
const OtpScreen = (props) => {
  const { localState, localDispatch } = useLocal()
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showModal, setShowModal] = useState(false)
  const { navigation } = props;
  const [modal, setModal] = useState({
    visible: false,
    message: '',
    navigationPage: '',
    onClose: null
  })
  const [timer, setTimer] = useState(120); // Initial value of 120 seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const handleOtpChange = (text) => {
    console.log('OTP', otp, 'TEXT', text)
    setOtp(text);
    localDispatch({
      type: 'OTP',
      payload: text
    })
    setOtpError('');
  };

  const startTimer = () => {
    setTimer(90); // Reset the timer to 90 seconds
    setIsTimerRunning(true);

    const intervalId = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 0) {
          setIsTimerRunning(false);
          clearInterval(intervalId);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000); // Decrease the timer every second (1000 milliseconds)
  };

  useEffect(() => {
    startTimer();
  }, []);

  const handleResend = async() => {
    if (!isTimerRunning) {
      startTimer();
      if (otp.length === 6) {
        const { data, status } = await FETCH(
          'POST',
          '/auth/reset-password',
          localState.userId,
          { otp }
        )
        if (status === 200) {
          // console.log('Move TO New Password Enter Screen')
          props.navigation.navigate('NewPassword');
        } else {
          let a = setModal({
            visible: true,
            message: data.message,
            navigationPage: 'OtpScreen',
            onClose: () => { setShowModal(false) }
          })

          setShowModal(true)
        }
      } else {
        setOtpError(stringsoflanguages.otpError);
      }
    }
  };

  const handleNextPage = async () => {
    if (otp.length === 6) {
      const { data, status } = await FETCH(
        'POST',
        '/auth/verify-reset-password-otp',
        localState.userId,
        { otp }
      )
      if (status === 200) {
        // console.log('Move TO New Password Enter Screen')
        props.navigation.navigate('NewPassword');
      } else {
        let a = setModal({
          visible: true,
          message: data.message,
          navigationPage: 'OtpScreen',
          onClose: () => { setShowModal(false) }
        })

        setShowModal(true)
      }
    } else {
      setOtpError(stringsoflanguages.otpError);
    }
    // props.navigation.navigate('LoginScreen');
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.rect1}>
      <Pressable onPress={() => navigation.goBack()}>
      <Text style={styles.headertop}>
      <Icon name="arrowleft" style={styles.header1}/> {/* Adjust size and color as needed */}
      </Text>
      </Pressable>
        <View>
          <Image
            source={require('../assets/images/OTP.png')}
            resizeMode="contain"
            style={styles.image}
          />
        </View>
        <View>
          <Text style={styles.text1}>{stringsoflanguages.verification}</Text>
        </View>
        <View>
          <Text style={styles.text2}>{stringsoflanguages.enterOtpReceived}</Text>
        </View>
      </View>

      <View style={styles.horizontal}></View>

      <View style={styles.rect2}>
        <OTPInputView
          style={styles.otp}
          pinCount={6}
          // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
          // onCodeChanged = {code => { this.setState({code})}}
          autoFocusOnLoad
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          editable={true}
          // value={otp}
          onCodeChanged={handleOtpChange}
        />
        {otpError ? <Text style={global.error}>{otpError}</Text> : null}

        {showModal ? <CustomModal visible={modal.visible} message={modal.message} navigationPage={modal.navigationPage} onClose={modal.onClose} /> : ''}

        <View style={styles.buttonV}>
          <ButtonA onPress={handleNextPage} name={stringsoflanguages.verify} />
        </View>
      </View>
      <View style={styles.rect3}>
        <Text style={styles.text3}>
          {isTimerRunning ? `${stringsoflanguages.enterOtpReceived} ${timer} seconds.` : stringsoflanguages.didntReceivedOtp}
        </Text>
        <Pressable onPress={handleResend}>
          <Text style={styles.text4}>
            {isTimerRunning ? '' : stringsoflanguages.resendAgain}
          </Text>
        </Pressable>
      </View>
      {showModal ? <CustomModal visible={modal.visible} message={modal.message} navigationPage={modal.navigationPage} onClose={modal.onClose} /> : ''}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    color: BLACK,
  },
  // icon: {
  //   color: PRIMARY,
  //   fontSize: getResponsiveValue(100, 50),
  // },

  rect1: {
    top: getResponsiveValue('7%', '6%'),
    alignItems: 'center',
  },

  rect2: {
    top: getResponsiveValue('10%', 0),
    alignItems: 'center',
  },
  image: {
    width: getResponsiveValue(200, 100),
    height: getResponsiveValue(200, 100),
    left: getResponsiveValue("4%", "4%"),
  },
  text1: {
    color: PRIMARY,
    fontSize: getResponsiveValue(55, 35),
  },
  text2: {
    color: BLACK,
    fontSize: getResponsiveValue(18, 12),
  },
  text3: {
    color: 'grey',
    fontSize: getResponsiveValue(14, 12),
  },
  text4: {
    color: LINKS,
    fontSize: getResponsiveValue(14, 12),
    left: getResponsiveValue('8%', '5%'),
  },
  rect3: {
    top: getResponsiveValue('25%', '10%'),
    alignItems: 'center',
    flexDirection: 'row',

  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: 'black',
  },

  underlineStyleBase: {
    width: getResponsiveValue(50, 30),
    height: getResponsiveValue(60, 45),
    borderWidth: 0,
    borderBottomWidth: getResponsiveValue(2, 1),
    borderColor: 'grey',
    color: BLACK,
  },

  underlineStyleHighLighted: {
    borderColor: BLACK,
    color: BLACK,
  },
  otp: {
    width: '80%',
    height: 200,
    left: getResponsiveValue(30, 10),
  },
  buttonV: {
    top: getResponsiveValue("10%", 0),
  },
  headertop:{
    right:"40%",
  },
  header1: {
    color: PRIMARY,
    fontSize:25,
    fontWeight: "bold",
  },
});

export default OtpScreen;

