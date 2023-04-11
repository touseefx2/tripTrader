import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  SafeAreaView,
  ScrollView,
  TextInput,
  Text,
  Keyboard,
  Alert,
} from 'react-native';
import {styles} from './styles';
import theme from '../../theme';
import store from '../../store';
import Header from './components/Header';
import Bottom from './components/Bottom';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import {FireStore} from '../../services/FireStore';
import NetInfo from '@react-native-community/netinfo';
import {Notification} from '../../services/Notification';
import utils from '..';

export default function MessageModal({
  isModal,
  setIsModal,
  modalObj,
  setModalObj,
  loader,
  setIsSuccessModal,
  setSuccessModalObj,
  setSuccessCheck,
}) {
  const maxModalHeight = theme.window.Height - 70;
  const {item} = modalObj;
  const {firstName, lastName, image} = item.hostId || item.offeredBy;
  const {user} = store.User;

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

  const onChangeText = text => {
    setMessage(text);
  };

  const renderFields = () => {
    const userName = firstName + ' ' + lastName;
    const photoSrc = image
      ? {uri: image}
      : require('../../assets/images/drawer/guest/img.png');

    const renderProfile = () => {
      return (
        <View style={styles.mProfileImgContainerm}>
          <ProgressiveFastImage
            style={styles.mProfileImgm}
            source={photoSrc}
            loadingImageStyle={styles.mimageLoaderm}
            loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
            blurRadius={5}
          />
          {/* {isVeirfy && (
            <Image
              style={styles.miconVerifym}
              source={require('../../assets/images/verified/img.png')}
            />
          )} */}
        </View>
      );
    };

    return (
      <View style={styles.modalFieldConatiner}>
        <View style={styles.modalFieldWrapper1}>
          <Text style={styles.mT1}>To:</Text>
          <View style={styles.profileConatiner}>
            {renderProfile()}
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.mT2}>
              {userName}
            </Text>
          </View>
        </View>

        <View style={styles.textArea}>
          <TextInput
            value={message}
            onChangeText={onChangeText}
            style={styles.mTextInpt}
            placeholder="Type your message here"
            multiline={true}
          />
        </View>
      </View>
    );
  };

  const messageSendSuccessfully = check => {
    closeModal();
    setSuccessModalObj(modalObj);
    setSuccessCheck('MessageSend');
    setIsSuccessModal(true);

    const senderName =
      utils.functions.capitalizeTheFirstLetterOfEachWord(
        user.firstName.trim(),
      ) +
      ' ' +
      utils.functions.capitalizeTheFirstLetterOfEachWord(user.lastName.trim());

    const notificationBody = {
      title: `New message from ${senderName}`,
      senderId: user._id,
      userId: item.hostId._id || item.offeredBy._id,
      message: message,
      icon: user?.image || '',
      data: {topic: check == 'first' ? 'newMessage' : 'newMessagePush'},
    };
    if (check == 'first') {
      Notification.sendMessageNotification(notificationBody);
    } else {
      Notification.sendMessageNotificationPush(notificationBody);
    }
  };

  const sendMessage = () => {
    Keyboard.dismiss();
    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        FireStore.sendMessage(
          user, //senderUserObject
          item.hostId || item.offeredBy, //reciverUserObject
          message, //messageValue
          'text', //messageType
          [], //messageImage
          messageSendSuccessfully, //messageSendSuccessfully
        );
      } else {
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  return (
    <Modal visible={isModal} transparent onRequestClose={closeModal}>
      <SafeAreaView style={styles.modalContainer}>
        <View
          onLayout={onViewLayout}
          style={[
            styles.modal,
            isMaxHeight
              ? {height: maxModalHeight, paddingTop: 0}
              : {padding: 15},
          ]}>
          <Header
            title={'Message User'}
            loader={loader}
            closeModal={closeModal}
            isMaxHeight={isMaxHeight}
          />

          {isMaxHeight ? (
            <ScrollView
              contentContainerStyle={{paddingHorizontal: 15}}
              showsVerticalScrollIndicator={false}
              style={{flex: 1}}>
              {renderFields()}
            </ScrollView>
          ) : (
            <>{renderFields()}</>
          )}

          <Bottom
            isMaxHeight={isMaxHeight}
            loader={loader}
            message={message}
            sendMessage={sendMessage}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
