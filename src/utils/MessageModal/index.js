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
import NetInfo from '@react-native-community/netinfo';
// import firestore from '@react-native-firebase/firestore';

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
  const {_id, firstName, lastName, image} = item.hostId;

  // const {user} = store.User;
  // const userId1 = user._id;
  // const userId2 = item.hostId._id;
  // const senderName = user.firstName + ' ' + user.lastName;
  // const senderImage = user.image || '';

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

  const messageSuccefullySend = () => {
    closeModal();
    setSuccessModalObj(modalObj);
    setSuccessCheck('MessageSend');
    setIsSuccessModal(true);
  };
  const sendMessage = () => {
    Keyboard.dismiss();
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        const {user} = store.User;
        const senderId = user._id;
        const senderName = user.firstName + ' ' + user.lastName;
        const senderImage = user.image || '';

        const obj = {
          userId1: senderId,
          userId2: _id,
          sendBy: senderId,
          sendTo: _id,
          senderName: senderName,
          isRead: false,
          message: message,
          type: 'text',
          senderImage: senderImage,
        };

        store.User.attemptToCheckFirstMessage(
          senderId,
          _id,
          obj,
          message,
          messageSuccefullySend,
        );
      } else {
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  // const chatroomsRef = firestore().collection('chatrooms');
  // const sendMessage = () => {
  //   Keyboard.dismiss();
  //   NetInfo.fetch().then(async state => {
  //     if (state.isConnected) {
  //       const obj = {
  //         latestMessage: null,
  //         userId1: user,
  //         userId2: item.hostId,
  //         createdAt: Date.now(),
  //         updatedAt: Date.now(),
  //       };
  //       const chatRoom = await getChatRoom();
  //       console.log('chatRoom : ', chatRoom);
  //       if (typeof chatRoom == 'string') {
  //         Alert.alert('Error', chatRoom);
  //         return;
  //       }
  //       const messageData = chatRoom.find(
  //         item =>
  //           (item.userId1._id == userId1 && item.userId2._id == userId2) ||
  //           (item.userId1._id == userId2 && item.userId2._id == userId1),
  //       );
  //       console.log('messageData : ', messageData);
  //       if (messageData) {
  //         sendChatMessage(messageData._id);
  //         return;
  //       }
  //       createChatRoom(obj);
  //     } else {
  //       Alert.alert('', 'Please connect internet');
  //     }
  //   });
  // };

  // function getChatRoom() {
  //   return new Promise((resolve, reject) => {
  //     chatroomsRef
  //       .get()
  //       .then(querySnapshot => {
  //         let data = [];
  //         if (querySnapshot.size > 0) {
  //           data = querySnapshot.docs.map(doc => ({
  //             ...doc.data(),
  //             _id: doc.id,
  //           }));
  //         }
  //         resolve(data);
  //       })
  //       .catch(error => {
  //         resolve(error);
  //       });
  //   });
  // }

  // function createChatRoom(obj) {
  //   chatroomsRef
  //     .add(obj)
  //     .then(res => {
  //       console.log('ChatRoom Created: ');
  //       sendChatMessage(res.id);
  //     })
  //     .catch(error => {
  //       console.log('Error createChatRoom:', error);
  //       Alert.alert('Error', error);
  //     });
  // }

  // function sendChatMessage(roomId) {
  //   const obj = {
  //     sendBy: userId1,
  //     sendTo: userId2,
  //     senderName: senderName,
  //     isRead: false,
  //     message: message,
  //     type: 'text',
  //     senderImage: senderImage,
  //     deletedBy: [],
  //     createdAt: Date.now(),
  //     updatedAt: Date.now(),
  //   };
  //   chatroomsRef
  //     .doc(roomId)
  //     .collection('messages')
  //     .add(obj)
  //     .then(res => {
  //       console.log('sendChatMessage Success: ');
  //       updateLatestMessageinRoom(roomId, obj);
  //     })
  //     .catch(error => {
  //       console.log('Error createChatRoom:', error);
  //       Alert.alert('Error', error);
  //     });
  // }

  // function updateLatestMessageinRoom(roomId, obj) {
  //   chatroomsRef
  //     .doc(roomId)
  //     .update({
  //       latestMessage: obj,
  //     })
  //     .then(() => {
  //       console.log('LatestMessageinRoom updated!');
  //     })
  //     .catch(error => {
  //       console.log('Error updateLatestMessageinRoom:', error);
  //     });
  // }

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
