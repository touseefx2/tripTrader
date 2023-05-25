import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  ScrollView,
  TextInput,
  Text,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
import db from '../../database/index';

export default function MessageModal({
  isModal,
  setIsModal,
  modalObj,
  setModalObj,
  loader,
  setIsSuccessModal,
  setSuccessModalObj,
  setSuccessCheck,
  goBackMain,
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
      data:
        check == 'first'
          ? {topic: 'newMessage'}
          : {topic: 'newMessagePush', senderId: user._id},
    };
    if (check == 'first') {
      Notification.sendMessageNotification(notificationBody);
    } else {
      Notification.sendMessageNotificationPush(notificationBody);
    }
  };

  const sendMessage = () => {
    const reciever = item?.hostId || item?.offeredBy;
    Keyboard.dismiss();

    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        store.User.setHomeModalLoder(true);
        db.hitApi(
          db.apis.GET_USER_BY_ID + reciever._id,
          'get',
          {},
          store.User.authToken,
        )
          ?.then(resp => {
            const followerArr = resp?.data?.data[0]?.followers || [];
            const uid = store.User.user._id; //current login user id
            if (followerArr.length > 0) {
              const arr1 = followerArr.find(
                item => item.block == true && item?.userId == uid,
              );
              if (arr1) {
                store.User.setHomeModalLoder(false);
                closeModal();
                goBackMain();
                store.General.refreshAlert('This user has blocked you.');
                return;
              }
            }
            FireStore.sendMessage(
              user, //senderUserObject
              reciever, //reciverUserObject
              message, //messageValue
              'text', //messageType
              [], //messageImage
              messageSendSuccessfully, //messageSendSuccessfully
            );
          })
          .catch(err => {
            store.User.setHomeModalLoder(false);
            const msg = err.response.data.message || err.response.status || err;
            console.log(
              `Error in get user  in sendMessage ${
                db.apis.GET_USER_BY_ID + uid
              } : `,
              msg,
            );
          });
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
      </KeyboardAvoidingView>
    </Modal>
  );
}
