import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  ScrollView,
  Text,
  Alert,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {styles} from './styles';
import theme from '../../theme';
import store from '../../store';
import Header from './components/Header';
import Bottom from './components/Bottom';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import NetInfo from '@react-native-community/netinfo';

export default function reportUserModal({
  isModal,
  setIsModal,
  modalObj,
  setModalObj,
  loader,
  user,
  goBackMain,
  setIsSuccessModal,
  setSuccessModalObj,
  setSuccessCheck,
}) {
  const maxModalHeight = theme.window.Height - 70;

  const [isMaxHeight, setIssMaxHeight] = useState(false);
  const [modalHeight, setmodalHeight] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setIssMaxHeight(modalHeight >= maxModalHeight ? true : false);
  }, [modalHeight]);

  const onViewLayout = event => {
    if (!isMaxHeight) {
      const {height} = event.nativeEvent.layout;
      setmodalHeight(height);
    }
  };

  const closeModal = () => {
    if (!loader) {
      setIsModal(false);
      setModalObj(null);
    }
  };

  const renderCenter = () => {
    let email = '';
    let userName = '';
    let photo = '';
    if (user) {
      email = user.email;
      userName = user.firstName + ' ' + user.lastName;
      photo = user.image ? user.image : '';
    }
    return (
      <View style={styles.main1}>
        <View style={styles.mProfileImgContainerss}>
          <ProgressiveFastImage
            style={styles.mProfileImgss}
            source={
              photo != ''
                ? {uri: photo}
                : require('../../assets/images/drawer/guest/img.png')
            }
            loadingImageStyle={styles.mimageLoader}
            loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
            blurRadius={5}
          />
        </View>

        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title1}>
          {userName}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title2}>
          {email}
        </Text>

        <View style={{width: '93%', alignSelf: 'center'}}>
          <Text style={styles.title3}>
            Tell us about the issues you are having or seeing with this user.
          </Text>
        </View>

        <View style={styles.textArea}>
          <TextInput
            value={message}
            onChangeText={c => {
              setMessage(c);
            }}
            style={styles.mTextInpt}
            placeholder="Describe your concerns"
            multiline={true}
            numberOfLines={10}
          />
        </View>
      </View>
    );
  };

  const reportSendSuccessfully = bool => {
    closeModal();
    setSuccessModalObj(modalObj);
    setSuccessCheck('ReportSend');
    setIsSuccessModal(bool);
  };

  const sendReoprt = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        const body = {
          reason: message,
          reportby: store.User.user._id,
          userId: user?._id || '',
        };
        store.Userv.SendReportUser(body, reportSendSuccessfully, goBackMain);
      } else {
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  return (
    <Modal visible={isModal} transparent onRequestClose={closeModal}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'height' : undefined}
        style={styles.modalContainer}>
        <View
          onLayout={onViewLayout}
          style={[
            styles.modal,
            isMaxHeight
              ? {height: maxModalHeight, paddingTop: 0}
              : {padding: 15},
          ]}>
          <Header
            title={'Report User'}
            loader={loader}
            closeModal={closeModal}
            isMaxHeight={isMaxHeight}
          />

          {isMaxHeight ? (
            <ScrollView
              contentContainerStyle={{paddingHorizontal: 15}}
              showsVerticalScrollIndicator={false}
              style={{flex: 1}}>
              {renderCenter()}
            </ScrollView>
          ) : (
            <>{renderCenter()}</>
          )}

          <Bottom
            isMaxHeight={isMaxHeight}
            loader={loader}
            closeModal={closeModal}
            sendReoprt={sendReoprt}
            message={message}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
