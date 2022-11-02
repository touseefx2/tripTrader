import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  StatusBar,
  BackHandler,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
} from 'react-native';
// import Geolocation from 'react-native-geolocation-service';
// import Geocoder from 'react-native-geocoding';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';

import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';

import {ScrollView} from 'react-native-gesture-handler';
import {ActivityIndicator} from 'react-native-paper';

export default observer(Support);

function Support(props) {
  const topicData = [
    {
      _id: 0,

      title: 'Account & Profile',
    },
    {
      _id: 1,

      title: 'ID Verification',
    },
    {
      _id: 2,

      title: 'Messaging',
    },
    {
      _id: 3,

      title: 'Privacy & Security',
    },
    {
      _id: 4,

      title: 'Trips & Trades',
    },
  ];

  const toast = useRef(null);
  const toastduration = 700;
  let headerTitle = 'Support';

  let internet = store.General.isInternet;
  let user = store.User.user;

  const loader = store.User.regLoader;

  const [subject, setsubject] = useState('');
  const [Emptysubject, setEmptysubject] = useState(false);

  const [desc, setdesc] = useState('');
  const [Emptydesc, setEmptydesc] = useState(false);

  const [topic, settopic] = useState(topicData[0]);
  const [isDropDownTopic, setisDropDownTopic] = useState(false);
  const closeAllDropDown = () => {
    setisDropDownTopic(false);
  };

  const [isSubmit, setisSubmit] = useState(false);

  const [errorMessage, seterrorMessage] = useState('');
  const setErrMessage = c => {
    seterrorMessage(c);
  };

  const Suc = () => {
    setisSubmit(true);
  };

  const submit = () => {
    Keyboard.dismiss();
    if (subject == '') {
      setEmptysubject(true);
      return;
    }

    if (desc == '') {
      setEmptydesc(true);
      return;
    }

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        let body = {
          subject: subject,
          description: desc,
          topic: topic.title,
        };
        store.User.submitSupport(body, Suc);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const goBack = () => {
    props.navigation.goBack();
  };

  const renderMain = () => {
    const enterSub = t => {
      setEmptysubject(false);

      setsubject(t);
    };

    const enterDesc = t => {
      setEmptydesc(false);

      setdesc(t);
    };

    const renderButton = () => {
      const renderB1 = () => {
        return (
          <TouchableOpacity
            disabled={loader}
            onPress={submit}
            activeOpacity={0.7}
            style={styles.BottomButton}>
            {!loader && <Text style={styles.buttonTextBottom}>Submit</Text>}
            {loader && (
              <ActivityIndicator size={18} color={theme.color.buttonText} />
            )}
          </TouchableOpacity>
        );
      };

      const renderB2 = () => {
        return (
          <TouchableOpacity
            disabled={loader}
            onPress={goBack}
            activeOpacity={0.7}
            style={styles.BottomButton2}>
            <Text style={styles.buttonTextBottom2}>Cancel</Text>
          </TouchableOpacity>
        );
      };

      return (
        <>
          <View
            style={{
              marginTop: 25,
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}>
            {renderB1()}
            {renderB2()}
          </View>
        </>
      );
    };

    const renderShowError = () => {
      return (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessageText}>{errorMessage}</Text>
        </View>
      );
    };

    const renderShowFieldError = c => {
      let text = '';

      if (c == 'desc') {
        text = 'Please enter description';
      }
      if (c == 'sub') {
        text = 'Please enter subject';
      }

      return (
        <View style={styles.errorMessageFieldContainer}>
          <Text style={styles.errorMessageFieldText}>{text}</Text>
        </View>
      );
    };

    const renderDropDown = c => {
      let data = [];

      if (c == 'topic') {
        data = topicData;
      }

      const onclickSelect = d => {
        if (c == 'topic') {
          settopic(d);
        }
      };

      // console.log('drop down data : ', data);
      let abs = Platform.OS == 'ios' ? false : true;
      return (
        <utils.DropDown
          data={data}
          onSelectItem={d => {
            onclickSelect(d);
          }}
          setVisible={d => {
            closeAllDropDown();
          }}
          c={c}
          absolute={abs}
          style={{textTransform: 'none'}}
        />
      );
    };

    return (
      <View style={styles.section2}>
        <View>
          <Text
            style={{
              fontSize: 18,
              color: '#1E3625',
              fontFamily: theme.fonts.fontBold,
            }}>
            Member Support
          </Text>
        </View>

        <View style={{marginTop: 10}}>
          <Text
            style={{
              fontSize: 14,
              color: theme.color.title,
              fontFamily: theme.fonts.fontNormal,
            }}>
            Please describe the details of your request below. We will respond
            as soon as possible (usually 1-3 business days).
          </Text>
        </View>

        <View style={[styles.Field, {marginTop: 20}]}>
          <Text style={[styles.FieldTitle1, {textTransform: 'none'}]}>
            Select a Topic
          </Text>
          <View style={{width: '100%'}}>
            <TouchableOpacity
              onPress={() => {
                closeAllDropDown();
                setisDropDownTopic(!isDropDownTopic);
              }}
              activeOpacity={0.6}
              style={[
                styles.dropDownConatiner,
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 15,
                },
              ]}>
              <View style={{width: '82%'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[styles.dropDownText]}>
                  {topic.title ? topic.title : ''}
                </Text>
              </View>
              <View
                style={{
                  width: '15%',

                  alignItems: 'flex-end',
                }}>
                <utils.vectorIcon.Fontisto
                  name="angle-down"
                  color={theme.color.subTitle}
                  size={13}
                />
              </View>
            </TouchableOpacity>

            {isDropDownTopic && renderDropDown('topic')}
          </View>
        </View>

        <View style={[styles.Field, {marginTop: 20}]}>
          <Text style={styles.FieldTitle1}>
            Subject <Text style={{color: 'red'}}>*</Text>
          </Text>
          <View
            style={[
              styles.FieldInput,
              {
                borderColor: Emptysubject
                  ? theme.color.fieldBordeError
                  : theme.color.fieldBorder,
              },
            ]}>
            <TextInput
              placeholder=""
              value={subject}
              onChangeText={enterSub}
              style={{
                height: '100%',
              }}
            />
          </View>
          {Emptysubject && renderShowFieldError('sub')}
        </View>

        <View style={[styles.Field, {marginTop: 20}]}>
          <Text style={styles.FieldTitle1}>
            Description <Text style={{color: 'red'}}>*</Text>
          </Text>
          <View
            style={[
              styles.FieldInput,
              {
                borderColor: Emptydesc
                  ? theme.color.fieldBordeError
                  : theme.color.fieldBorder,
                height: 150,
              },
            ]}>
            <TextInput
              placeholder="How can we help?"
              value={desc}
              onChangeText={enterDesc}
              style={{
                height: '100%',

                textAlignVertical: 'top',
              }}
              multiline={true}
            />
          </View>
          {Emptydesc && renderShowFieldError('desc')}
          <View style={{marginTop: 10}}>
            <Text
              style={{
                fontSize: 11,
                color: theme.color.subTitle,
                fontFamily: theme.fonts.fontNormal,
              }}>
              Please do not include sensitive personal information.
            </Text>
          </View>
        </View>

        {renderButton()}
      </View>
    );
  };

  const renderMain2 = () => {
    const renderButton = () => {
      const renderB1 = () => {
        return (
          <TouchableOpacity
            onPress={goBack}
            activeOpacity={0.7}
            style={styles.BottomButton}>
            <Text style={styles.buttonTextBottom}>Find Trips</Text>
          </TouchableOpacity>
        );
      };

      const renderB2 = () => {
        return (
          <TouchableOpacity
            onPress={() => props.navigation.navigate('MyProfile')}
            activeOpacity={0.7}
            style={styles.BottomButton2}>
            <Text style={styles.buttonTextBottom2}>Go to My Profile</Text>
          </TouchableOpacity>
        );
      };

      return (
        <>
          <View
            style={{
              marginTop: 40,
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}>
            {renderB1()}
            {renderB2()}
          </View>
        </>
      );
    };

    return (
      <View style={styles.section2}>
        <View>
          <Text
            style={{
              fontSize: 18,
              color: '#1E3625',
              fontFamily: theme.fonts.fontBold,
            }}>
            Got it! We’re on it.
          </Text>
        </View>

        <View style={{marginTop: 10}}>
          <Text
            style={{
              fontSize: 14,
              color: theme.color.title,
              fontFamily: theme.fonts.fontNormal,
            }}>
            Your support request has been received and we’ll respond as soon as
            possible (usually 1-3 business days).
          </Text>
        </View>

        <View style={{marginTop: 10}}>
          <Text
            style={{
              fontSize: 14,
              color: theme.color.title,
              fontFamily: theme.fonts.fontNormal,
            }}>
            If you do not see a response after 3 days, please check your Spam or
            Junk Mail folder.
          </Text>
        </View>

        {renderButton()}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {/* {tagLine != '' && <utils.TagLine tagLine={tagLine} />} */}
      <utils.DrawerHeader props={props} headerTitle={headerTitle} />
      {!internet && <utils.InternetMessage />}
      <SafeAreaView style={styles.container2}>
        <View style={styles.container3}>
          <KeyboardAvoidingView style={{flex: 1}} enabled>
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 15,
                paddingVertical: 15,
              }}>
              {!isSubmit && renderMain()}
              {isSubmit && renderMain2()}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
        <utils.Footer
          nav={props.navigation}
          screen={headerTitle}
          focusScreen={store.General.focusScreen}
        />
      </SafeAreaView>

      <Toast ref={toast} position="bottom" />
    </View>
  );
}
