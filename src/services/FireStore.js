import firestore from '@react-native-firebase/firestore';
import store from '../store';

const {
  setibl,
  setdlc,
  setinbox,
  setunreadInbox,
  setmessagesLoader,
  setHomeModalLoder,
  setSendMessageLoader,
  user,
} = store.User;

const chatroomsRef = firestore().collection('chatrooms');

async function sendMessage(
  sender,
  receiver,
  message,
  messageType,
  messageImage,
  success,
) {
  const userId1 = sender._id;
  const userId2 = receiver._id;
  const user = {[userId1]: true, [userId2]: true};
  const timestamp = firestore.FieldValue.serverTimestamp();
  const createRoomObject = {
    latestMessage: null,
    user,
    userId1: sender,
    userId2: receiver,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const chatMessageObject = {
    user: sender,
    isRead: false,
    message: message,
    type: messageType,
    image: messageImage,
    deletedBy: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  setHomeModalLoder(true);
  const chatRoomArr = await getChatRoom();
  // console.log('chatRoomArr : ', chatRoomArr);
  const room = chatRoomArr.find(
    item =>
      item.user.hasOwnProperty(userId1) && item.user.hasOwnProperty(userId2),
  );
  // console.log('room : ', room);
  if (room) {
    sendChatMessage(room._id, userId2, chatMessageObject, success, 'read', '');
    return;
  }
  createChatRoom(
    createRoomObject,
    userId2,
    chatMessageObject,
    success,
    'first',
  );
}

async function getChatRoom() {
  return new Promise((resolve, reject) => {
    chatroomsRef
      .get()
      .then(querySnapshot => {
        let data = [];
        if (querySnapshot.size > 0) {
          data = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            _id: doc.id, //roomId
          }));
        }
        resolve(data);
      })
      .catch(error => {
        reject('Error getChatRoom: ' + error?.message || error);
        setHomeModalLoder(false);
      });
  });
}

async function createChatRoom(
  createRoomObject,
  receiverId,
  chatMessageObject,
  success,
  chk2,
) {
  const catchFunc = error => {
    setHomeModalLoder(false);
    console.log('Error createChatRoom: ' + error?.message || error);
  };

  try {
    chatroomsRef
      .add(createRoomObject)
      .then(res => {
        // console.log('ChatRoom Created!!');
        sendChatMessage(
          res.id,
          receiverId,
          chatMessageObject,
          success,
          'read',
          chk2,
        );
      })
      .catch(error => {
        catchFunc(error);
      });
  } catch (error) {
    catchFunc(error);
  }
}

async function sendChatMessage(
  roomId,
  receiverId,
  chatMessageObject,
  success,
  check,
  chk2,
) {
  const catchFunc = error => {
    setHomeModalLoder(false);
    setSendMessageLoader(false);
    console.log('Error sendChatMessage: ' + error?.message || error);
  };

  try {
    chatroomsRef
      .doc(roomId)
      .collection('messages')
      .add(chatMessageObject)
      .then(res => {
        // console.log('sendChatMessage Success!!');
        updateLatestMessageinRoom(
          roomId,
          receiverId,
          chatMessageObject,
          success,
          check,
          chk2,
        );
      })
      .catch(error => {
        catchFunc(error);
      });
  } catch (error) {
    catchFunc(error);
  }
}

async function updateLatestMessageinRoom(
  roomId,
  receiverId,
  chatMessageObject,
  success,
  check,
  chk2,
) {
  const catchFunc = error => {
    setHomeModalLoder(false);
    setSendMessageLoader(false);
    console.log('Error updateLatestMessageinRoom: ' + error?.message || error);
  };

  try {
    chatroomsRef
      .doc(roomId)
      .update({
        latestMessage: chatMessageObject,
      })
      .then(() => {
        setHomeModalLoder(false);
        setSendMessageLoader(false);
        // console.log('LatestMessageinRoom updated!!');
        success(chk2);
        if (check == 'read') readAllMessageInRoom(roomId, receiverId);
      })
      .catch(error => {
        catchFunc(error);
      });
  } catch (error) {
    catchFunc(error);
  }
}

function dateConvert(timestamp) {
  const date = new Date(
    timestamp?.seconds * 1000 + timestamp?.nanoseconds / 1000000,
  );

  return new Date(date.getTime());
}

async function getAllCurrentUserRooms(userId, setGetdata, check) {
  const catchFunc = error => {
    setibl(false);
    console.log('Error getAllCurrentUserRooms: ' + error?.message || error);
  };

  // console.log('GET Inboxes : ', userId);
  if (check !== 'n') setibl(true);
  try {
    chatroomsRef
      .where(`user.${userId}`, '==', true)
      .get()
      .then(querySnapshot => {
        let data = [];
        let finalData = [];
        let count = 0;
        if (querySnapshot.size > 0) {
          data = querySnapshot.docs.map(doc => ({...doc.data(), _id: doc.id}));
        }
        // console.log('getAllCurrentUserRooms resp: ', data.length);

        data.forEach(item => {
          let c = false;
          const arr = item.latestMessage?.deletedBy || [];
          arr.forEach(element => {
            if (element == userId) c = true;
          });

          if (!c) finalData.push(item);
        });

        finalData.forEach(item => {
          if (
            item.latestMessage &&
            userId != (item.latestMessage.user?._id || null) &&
            item.latestMessage.isRead == false
          ) {
            count++;
          }
        });

        setibl(false);
        setinbox(
          finalData.sort((a, b) => {
            const d1 = dateConvert(b.latestMessage.updatedAt);
            const d2 = dateConvert(a.latestMessage.updatedAt);
            return d1 - d2;
          }),
        );
        setGetdata(true);
        setunreadInbox(count);
      })
      .catch(error => {
        catchFunc(error);
      });
  } catch (error) {
    catchFunc(error);
  }
}

async function updateLatestMessageObjectinRoom(
  roomId,
  currentUserId,
  deleteSuccess,
  type,
) {
  const catchFunc = error => {
    setdlc(false);
    console.log(
      'Error updateLatestMessageObjectinRoom:' + error?.message || error,
    );
  };

  const obj =
    type == 'deletedBy'
      ? {
          'latestMessage.deletedBy':
            firestore.FieldValue.arrayUnion(currentUserId),
        }
      : {
          'latestMessage.isRead': true,
        };

  try {
    chatroomsRef
      .doc(roomId)
      .update(obj)
      .then(() => {
        // console.log(`updateLatestMessageObjectinRoom ${type} updated!!`);
        deleteSuccess();
      })
      .catch(error => {
        catchFunc(error);
      });
  } catch (error) {
    catchFunc(error);
  }
}

async function deleteChatRoom(roomId, deleteSuccess) {
  const catchFunc = error => {
    console.log('Error deleteChatRoom: ' + error?.message || error);
    setdlc(false);
  };

  try {
    const messagesRef = chatroomsRef.doc(roomId).collection('messages');

    chatroomsRef
      .doc(roomId)
      .delete()
      .then(() => {
        messagesRef.get().then(querySnapshot => {
          Promise.all(querySnapshot.docs.map(d => d.ref.delete()));
        });

        // console.log('deleteChatRoom Success!!');
        deleteSuccess();
      })
      .catch(error => {
        catchFunc(error);
      });
  } catch (error) {
    catchFunc(error);
  }
}

async function deleteChat(
  inbox,
  roomId,
  currentUserId,
  search,
  searrchData,
  setSearchData,
  closeSwipe,
) {
  const catchFunc = error => {
    console.log('Error deleteChat: ' + error?.message || error);
    setdlc(false);
  };

  const deleteSuccess = () => {
    let i = 0;
    let ii = 0;
    const dd = [...inbox];
    if (dd.length > 0) {
      const ind = dd.findIndex(x => x._id === roomId);
      if (ind > -1) {
        i = ind;
      }
    }
    let ddd = [...searrchData];
    if (ddd.length > 0) {
      const ind = ddd.findIndex(x => x._id === roomId);
      if (ind > -1) {
        ii = ind;
      }
    }

    setdlc(false);
    closeSwipe();
    dd.splice(i, 1);
    setinbox(dd);
    if (search != '') {
      ddd.splice(ii, 1);
      setSearchData(ddd);
    }
  };

  // console.log('deleteChat  : ', roomId);
  const messagesRef = chatroomsRef
    .doc(roomId)
    .collection('messages')
    .orderBy('createdAt', 'asc');

  setdlc(true);

  try {
    messagesRef
      .get()
      .then(querySnapshot => {
        const sortArr = querySnapshot.docs;

        sortArr.forEach((data, index, arr) => {
          const obj = {
            deletedBy: firestore.FieldValue.arrayUnion(currentUserId),
          };
          data.ref.update(obj);
          if (index == arr.length - 1) {
            if (data.data().deletedBy.length < 1)
              updateLatestMessageObjectinRoom(
                roomId,
                currentUserId,
                deleteSuccess,
                'deletedBy',
              );
            else deleteChatRoom(roomId, deleteSuccess);
          }
        });
      })
      .catch(error => {
        catchFunc(error);
      });
  } catch (error) {
    catchFunc(error);
  }
}

async function getAllMessageInRoom(roomId, receiverId, setGetdata, setData) {
  const catchFunc = error => {
    setmessagesLoader(false);
    console.log('Error getAllMessageInRoom: ' + error?.message || error);
  };

  const curentUserId = user._id;
  // console.log('getAllMessageInRoom', curentUserId);
  const messagesRef = chatroomsRef
    .doc(roomId)
    .collection('messages')
    .orderBy('createdAt', 'asc');

  try {
    setmessagesLoader(true);
    messagesRef
      .get()
      .then(querySnapshot => {
        let messagesArr = [];
        if (querySnapshot.size > 0) {
          messagesArr = querySnapshot.docs
            .map(data => ({
              ...data.data(),
              _id: data.id,
            }))

            .filter(item => {
              let isShow = true;
              item.deletedBy.forEach(element => {
                if (element == curentUserId) {
                  isShow = false;
                }
              });
              if (isShow) return item;
            });
        }

        setmessagesLoader(false);
        setGetdata(true);
        setData(messagesArr);
        readAllMessageInRoom(roomId, receiverId);
      })
      .catch(error => {
        catchFunc(error);
      });
  } catch (error) {
    catchFunc(error);
  }
}

async function readAllMessageInRoom(roomId, receiverId) {
  const catchFunc = error => {
    console.log('Error readAllMessageInRoom: ' + error?.message || error);
  };

  // console.log('readAllMessageInRoom ', roomId);
  const messagesRef = chatroomsRef
    .doc(roomId)
    .collection('messages')
    .where(`user._id`, '==', receiverId)
    .where('isRead', '==', false);

  const lastMessagesRef = chatroomsRef
    .doc(roomId)
    .collection('messages')
    .orderBy('createdAt', 'desc')
    .limit(1);

  try {
    messagesRef
      .get()
      .then(async querySnapshot => {
        if (querySnapshot.size > 0) {
          querySnapshot.docs.forEach(data => {
            const obj = {
              isRead: true,
            };
            data.ref.update(obj);
          });
          // console.log('readAllMessageInRoom true');

          const lastMessage = await lastMessagesRef.get();
          if (lastMessage.docs.length > 0) {
            const msg = lastMessage.docs[0].data();

            if (msg.user._id == receiverId)
              updateLatestMessageObjectinRoom(roomId, '', () => {}, 'isRead');
          }
        }
      })
      .catch(error => {
        catchFunc(error);
      });
  } catch (error) {
    catchFunc(error);
  }
}

async function updateUserinFirestore(currentUserId, userObj) {
  const catchFunc = error => {
    console.log('Error updateUserinFirestore: ' + error?.message || error);
  };

  const ref1 = chatroomsRef.where(`user.${currentUserId}`, '==', true);
  try {
    ref1
      .get()
      .then(querySnapshot => {
        if (querySnapshot.size > 0) {
          querySnapshot.docs.forEach(doc => {
            const roomId = doc.id;
            const data = doc.data();
            let obj = null;
            if (data.latestMessage.user._id == currentUserId) {
              obj = {
                'latestMessage.user': userObj,
              };
            }

            if (obj == null) {
              obj = {};
            }
            if (data.userId1._id == currentUserId) {
              obj.userId1 = userObj;
            } else {
              obj.userId2 = userObj;
            }

            doc.ref.update(obj);

            const ref2 = chatroomsRef
              .doc(roomId)
              .collection('messages')
              .where('user._id', '==', currentUserId);
            ref2.get().then(querySnapshot2 => {
              if (querySnapshot2.size > 0) {
                querySnapshot2.docs.forEach(doc2 => {
                  const obj = {user: userObj};
                  doc2.ref.update(obj);
                });
              }
            });
          });
        }
      })
      .catch(error => {
        catchFunc(error);
      });
  } catch (error) {
    catchFunc(error);
  }
}

async function updateUserinFirestoreOnlyRoom(currentUserId, userObj) {
  const catchFunc = error => {
    console.log(
      'Error updateUserinFirestoreOnlyRoom: ' + error?.message || error,
    );
  };

  const ref1 = chatroomsRef.where(`user.${currentUserId}`, '==', true);
  try {
    ref1
      .get()
      .then(querySnapshot => {
        if (querySnapshot.size > 0) {
          querySnapshot.docs.forEach(doc => {
            const data = doc.data();

            let obj = null;

            if (data.userId1._id == currentUserId) {
              obj = {userId1: userObj};
            } else {
              obj = {userId2: userObj};
            }

            doc.ref.update(obj);
          });
        }
      })
      .catch(error => {
        catchFunc(error);
      });
  } catch (error) {
    catchFunc(error);
  }
}

export const FireStore = {
  sendMessage,
  sendChatMessage,
  readAllMessageInRoom,
  getAllCurrentUserRooms,
  deleteChat,
  getAllMessageInRoom,
  updateUserinFirestore,
  updateUserinFirestoreOnlyRoom,
};
