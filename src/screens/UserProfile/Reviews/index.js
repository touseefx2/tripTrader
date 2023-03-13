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
  Modal,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Pressable,
  TextInput,
  Keyboard,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../../store';
import NetInfo from '@react-native-community/netinfo';
import theme from '../../../theme';
import utils from '../../../utils/index';
import moment from 'moment';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import StarRating from 'react-native-star-rating';

export default observer(Reviews);

function Reviews(props) {
  let maxReview = 500;
  let maxModalHeight = theme.window.Height - 100;

  const scrollRef = useRef(null);

  const [modalHeight, setmodalHeight] = useState(0);

  let headerTitle = 'Reviews';
  let internet = store.General.isInternet;
  const u = store.Userv.user;
  let userName = '';
  const user = u;
  if (user) {
    userName = user.firstName + ' ' + user.lastName;
  }

  const [data, setdata] = useState([]);
  const [isOneReview, setisOneReview] = useState(false);
  const [isAnyTrade, setisAnyTrade] = useState(false);
  const [loader, setloader] = useState(false);
  const totalData = data.length;

  // let data = store.Userv.review;
  // let loader = store.Userv.reviewLoader;
  // const isAnyTrade = store.Userv.isAnyTrade;
  // const isOneReview = store.Userv.isOneReview;

  let mloader = store.Userv.mLoader;

  const [modalObj, setmodalObj] = useState(false);
  const [modalChk, setmodalChk] = useState(false);
  const [isModal, setisModal] = useState(false);

  const [isTerms, setisTerms] = useState(false);
  const [EmptyTerms, setEmptyTerms] = useState(false);

  let maxCommentLength = 250;
  const [comment, setcomment] = useState('');

  //delete review modal
  const [isdModal, setisdModal] = useState(false);
  const [isdObj, setisdObj] = useState(false);

  const [isrModal, setisrModal] = useState(false);
  const [isrObj, setisrObj] = useState(false);

  //leave review
  const [rate, setrate] = useState(0);
  const [message, setMessage] = useState('');
  const [isSendReview, setisSendReview] = useState(false);

  const [getDataOnce, setgetDataOnce] = useState(false);
  const setGetDataOnce = C => {
    setgetDataOnce(C);
  };

  const [refreshing, setRefreshing] = React.useState(false);
  const setrefeshing = c => {
    setRefreshing(c);
  };
  const onRefresh = React.useCallback(() => {
    console.warn('onrefresh cal');
    setRefreshing(true);
    getDbData();
  }, []);

  const getDbData = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Userv.attemptToGetReviews(
          user._id,
          setGetDataOnce,
          setrefeshing,
          c => setdata(c),
          c => setisOneReview(c),
          c => setloader(c),
        );
        store.Userv.attemptToGetLatestTrip(c => setisAnyTrade(c));
      } else {
        setrefeshing(false);
      }
    });
  };

  useEffect(() => {
    if (!getDataOnce && internet) {
      getDbData();
    }

    return () => {};
  }, [getDataOnce, internet]);

  const postReply = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Userv.attemptToReplyComment(modalObj, comment, closeModal);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };
  const actionDsipute = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Userv.attemptToDisputeComment(modalObj, closeModal);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };
  const actionEdit = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Userv.attemptToEditComment(modalObj, comment, closeModal);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };
  const actionDelete = () => {
    Keyboard.dismiss();

    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Userv.attemptToDeleteComment(modalObj, closeModal);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const openDeleteModal = c => {
    setisdModal(true);
    setisdObj(c);
  };

  const closeDeleteModal = () => {
    if (!mloader) {
      setisdModal(false);
      setisdObj(false);
    }
  };

  const openReviewModal = c => {
    if (c) {
      console.log('ccc : ', c);
      setisrObj(c);
      setrate(c.rate);
      setMessage(c.message);
    }
    setisrModal(true);
  };
  const closeReviewModal = () => {
    if (!mloader) {
      setisrModal(false);
      setmodalHeight(0);
      setMessage('');
      setrate(0);
      setisrObj(false);
    }
  };
  const closeSendReviewModal = c => {
    setmodalHeight(0);
    setisSendReview(false);
    if (c == 'goto') {
      scrollRef?.current?.scrollToOffset({animated: true, offset: 0});
    }
  };

  const postReview = () => {
    Keyboard.dismiss();

    let userName = '';
    const user2 = store.User.user;
    if (user2) {
      userName = user2.firstName + ' ' + user2.lastName;
    }

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        let body = {
          featuredDate: new Date(),
          hostId: user._id,
          guestId: store.User.user._id,
          tripDetails: {
            title: isAnyTrade?.title || '',
          },
          guestRating: rate,
          status: 'active',
          messages: [
            {
              role: 'guest',
              message: message,
            },
          ],
          guestName: userName,
        };
        store.Userv.attemptToPostReview(
          body,
          closeReviewModal,
          () => setisSendReview(true),
          data,
          c => setdata(c),
          c => setisOneReview(c),
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const EditReview = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        isrObj.message = message;
        isrObj.rate = rate;

        store.Userv.attemptToEditReview(
          isrObj,
          data,
          c => setdata(c),
          closeReviewModal,
          () => setisSendReview(true),
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const DeleteReview = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Userv.attemptToDeleteReview(
          isdObj,
          closeDeleteModal,
          data,
          c => setdata(c),
          c => setisOneReview(c),
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const openModal = (obj, c) => {
    if (c == 'edit') {
      let d = obj.item;
      let reply = '';
      let msgs = d.messages || [];
      if (msgs.length > 0) {
        msgs.map((e, i, a) => {
          if (e.role == 'host') {
            reply = e.message;
          }
        });
      }

      setcomment(reply);
    }

    setmodalObj(obj);
    setmodalChk(c);
    setisModal(true);
  };

  const closeModal = () => {
    if (!mloader) {
      setisModal(false);

      setmodalChk(false);
      setmodalObj(false);
      setcomment('');
      setisTerms(false);
      setEmptyTerms(false);
      setmodalHeight(0);
    }
  };

  const renderShowRes = () => {
    return (
      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '97%',
          alignSelf: 'center',
        }}>
        <View style={{width: '63%'}}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 12,
              color: theme.color.subTitle,
              fontFamily: theme.fonts.fontNormal,
            }}>
            Showing {data.length} of {totalData}
          </Text>
        </View>

        {!isOneReview && isAnyTrade != false && getDataOnce && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => openReviewModal(false)}>
            <Text
              style={{
                fontSize: 13,
                color: '#3C6B49',
                fontFamily: theme.fonts.fontBold,
              }}>
              Leave a review
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderShowData = ({item, index}) => {
    let isCurrentUserGuest = false;

    let usr = item.guestId;
    if (store.User.user._id == usr._id) {
      isCurrentUserGuest = true;
    }

    let rate = item.guestRating || 0;

    //reviewer user
    let photo = usr.image || '';
    let isuVeirfy = usr.identityStatus == 'notVerified' ? false : true;
    let userName = usr.firstName + ' ' + usr.lastName;
    let avgRating = usr.rating || 0;
    let totalReviews = usr.reviews || 0;
    let userCommentid = '';
    let userComment = '';
    let postDate = '';
    let msgs = item.messages || [];
    let reply = '';
    if (msgs.length > 0) {
      msgs.map((e, i, a) => {
        if (e.role == 'guest') {
          postDate = e.updatedAt;
          userComment = e.message;
          userCommentid = e._id;
        } else if (e.role == 'host') {
          reply = e;
        }
      });
    }

    let rusr = user;
    //host
    let ruserPhoto = '';
    let ruserName = '';
    let ruserComment = '';
    let rpostDate = '';
    let isrVeirfy = false;
    if (reply != '') {
      ruserPhoto = rusr.image || '';
      isrVeirfy = rusr.dentityStatus || false;
      ruserName = rusr.firstName + ' ' + rusr.lastName;
      ruserComment = reply.message;
      rpostDate = reply.updatedAt;
    }

    let status = item.status;
    let dispute = status == 'dispute' ? true : false;
    let disputeDate = dispute ? item.disputeOpenDate : '';

    const formatdisputeDate = date => {
      var dd = moment(date).format('MMM DD');
      return dd;
    };

    const formatDate = date => {
      var dd = moment(date).format('MMM DD, YYYY');
      return dd;
    };

    const renderShowCommentBox = () => {
      const renderProfile = () => {
        return (
          <View style={styles.ProfileImgContainer}>
            <ProgressiveFastImage
              style={styles.ProfileImg}
              source={
                photo != ''
                  ? {uri: photo}
                  : require('../../../assets/images/drawer/guest/img.png')
              }
              loadingImageStyle={styles.imageLoader}
              loadingSource={require('../../../assets/images/imgLoad/img.jpeg')}
              blurRadius={5}
            />

            {isuVeirfy && (
              <Image
                style={styles.iconVerify}
                source={require('../../../assets/images/verified/img.png')}
              />
            )}
          </View>
        );
      };

      const renderText = () => {
        return (
          <View style={styles.textContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.textContainertitle}>
              {userName}
            </Text>

            <View style={{flexDirection: 'row', marginTop: 1}}>
              <utils.vectorIcon.Entypo
                name="star"
                color={theme.color.rate}
                size={14}
              />
              <Text style={styles.textContainerRatetitle1}>
                {' '}
                {avgRating > 0 ? avgRating.toFixed(1) : avgRating}
                {'  '}
              </Text>
              <Text style={styles.textContainerRatetitle2}>
                {totalReviews > 300 ? '300+' : totalReviews} reviews
              </Text>
            </View>
          </View>
        );
      };

      const renderDate = () => {
        return (
          <View style={styles.dateContainer}>
            <Text style={styles.dateContainerTitle}>
              {formatDate(postDate)}
            </Text>
          </View>
        );
      };

      const renderComment = () => {
        return <Text style={styles.boxSection2title}>{userComment}</Text>;
      };

      const renderShowButton = () => {
        const renderReplyButton = () => {
          return (
            <Pressable
              onPress={() => {
                openReviewModal({
                  _id: item._id,
                  i: index,
                  rate: rate,
                  message: userComment,
                  mid: userCommentid,
                });
              }}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                styles.smallButtonContainer,
              ]}>
              <Text style={styles.sb1Text}>Edit Review</Text>
            </Pressable>
          );
        };

        const renderDeleteButton = () => {
          return (
            <Pressable
              onPress={() => {
                console.log('item : ', item);
                // openDeleteModal({
                //   _id: item._id,
                //   i: index,
                //   mid: userCommentid,
                // })
              }}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                styles.smallButtonContainer,
                {backgroundColor: theme.color.disableSmallButton},
              ]}>
              <Text style={[styles.sb2Text, {color: '#B93B3B'}]}>
                Delete Review
              </Text>
            </Pressable>
          );
        };

        const renderShowDsipute = () => {
          return (
            <View style={styles.boxSection3}>
              <utils.vectorIcon.AntDesign
                name="warning"
                color={'#B93B3B'}
                size={14}
              />
              <Text style={styles.disputeTitle}>
                This review is in dispute {formatdisputeDate(disputeDate)}
              </Text>
            </View>
          );
        };

        return (
          <>
            {!dispute && (
              <View style={styles.boxSection3}>
                {renderReplyButton()}
                <View style={{width: 12}} />
                {renderDeleteButton()}
              </View>
            )}

            {dispute && renderShowDsipute()}
          </>
        );
      };

      return (
        <View style={styles.boxContainer}>
          <View style={styles.boxSection1}>
            {renderProfile()}
            {renderText()}
            {renderDate()}
          </View>
          <View style={styles.boxSection2}>{renderComment()}</View>
          {isCurrentUserGuest && renderShowButton()}
        </View>
      );
    };

    const renderShowReplyBox = () => {
      const renderLine = () => {
        return (
          <View
            style={{
              width: '15%',

              alignItems: 'flex-end',
            }}>
            <View
              style={{
                width: '60%',
                height: 35,
                borderLeftWidth: 2,
                borderBottomWidth: 2,
                borderBottomLeftRadius: 10,
                borderColor: theme.color.subTitleLight,
                opacity: 0.4,
              }}
            />
          </View>
        );
      };

      const renderReplyBox = () => {
        let n = user.firstName + ' ' + user.lastName + ' ';

        return (
          <View style={styles.repBoxContainer}>
            <Text
              style={[
                styles.repBoxTitile1,
                {textTransform: 'capitalize', fontFamily: theme.fonts.fontBold},
              ]}>
              {n}
              <Text
                style={[
                  styles.repBoxTitile1,
                  {textTransform: 'none', fontFamily: theme.fonts.fontNormal},
                ]}>
                replied:{/* on {formatDate(rpostDate)} */}
              </Text>
            </Text>
            <Text style={styles.repBoxTitile2}>{ruserComment}</Text>
          </View>
        );
      };

      return (
        <>
          <View style={styles.rBoxContainer}>
            {renderLine()}
            {renderReplyBox()}
          </View>
        </>
      );
    };

    return (
      <>
        <View style={{marginBottom: 15, marginTop: index == 0 ? 12 : 0}}>
          {renderShowCommentBox()}
          {reply != '' && renderShowReplyBox()}
        </View>
      </>
    );
  };

  const renderMessage = c => {
    return (
      <View
        style={{
          marginTop: '25%',
          width: '100%',
        }}>
        <Text
          style={{
            fontSize: 13,
            color: theme.color.subTitle,
            fontFamily: theme.fonts.fontMedium,
            textAlign: 'center',
          }}>
          {userName} has not received any reviews yet
        </Text>
        {isAnyTrade != false && !isOneReview && getDataOnce && (
          <View style={{width: '100%', marginTop: 10}}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 13,
                color: theme.color.title,
                fontFamily: theme.fonts.fontNormal,
                textAlign: 'center',
                lineHeight: 21,
              }}>
              Looks like you recently traded with {user.firstName}.
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: theme.color.title,
                fontFamily: theme.fonts.fontNormal,
                textAlign: 'center',
                lineHeight: 21,
              }}>
              Would you like to{' '}
              <Text
                onPress={() => openReviewModal(false)}
                style={{
                  fontSize: 13,
                  color: '#3C6B49',
                  fontFamily: theme.fonts.fontBold,
                  textAlign: 'center',
                  lineHeight: 21,
                  textDecorationLine: 'underline',
                }}>
                leave a review?
              </Text>
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderLoader = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: '45%',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <ActivityIndicator size={35} color={theme.color.button1} />
      </View>
    );
  };

  const renderShowFieldError = c => {
    let text = '';
    if (c == 'terms') {
      text = EmptyTerms ? 'Agreeing to Terms and Conditions is required' : '';
    }

    return (
      <View style={styles.errorMessageFieldContainer}>
        <Text style={styles.errorMessageFieldText}>{text}</Text>
      </View>
    );
  };

  const renderModal = () => {
    if (modalChk == 'reply' || modalChk == 'edit') {
      const renderHeader = () => {
        let text = 'Reply to review';

        const renderCross = () => {
          return (
            <Pressable
              disabled={mloader}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                styles.modalCross,
              ]}
              onPress={closeModal}>
              <utils.vectorIcon.Ionicons
                name="ios-close-outline"
                color={theme.color.title}
                size={32}
              />
            </Pressable>
          );
        };

        const renderTitle = () => {
          return <Text style={styles.modalTitle}>{text}</Text>;
        };

        return (
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {renderTitle()}
            {renderCross()}
          </View>
        );
      };

      const renderField = () => {
        const renderTitle = () => {
          return (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.modalFieldTitle}>Message</Text>
              <Text
                style={[
                  styles.modalFieldTitle,
                  {
                    color:
                      comment.length < maxCommentLength
                        ? theme.color.subTitleLight
                        : 'red',
                    fontSize: 12.5,
                  },
                ]}>
                {comment.length} / {maxCommentLength}
              </Text>
            </View>
          );
        };

        const renderInput = () => {
          return (
            <View style={{marginTop: 5}}>
              <TextInput
                autoFocus
                multiline
                value={comment}
                onChangeText={t => setcomment(t)}
                textAlignVertical="top"
                placeholder="What do you want to say?"
                style={styles.modalInput}
                maxLength={maxCommentLength}
              />
            </View>
          );
        };

        return (
          <View style={{marginTop: 15}}>
            {renderTitle()}
            {renderInput()}
          </View>
        );
      };

      const renderBottom = () => {
        const renderButton1 = () => {
          return (
            <Pressable
              disabled={mloader || comment.length <= 0}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : comment.length <= 0 ? 0.5 : 1},
                [styles.ButtonContainer],
              ]}
              onPress={modalChk == 'reply' ? postReply : actionEdit}>
              {mloader && (
                <ActivityIndicator size={20} color={theme.color.buttonText} />
              )}
              {!mloader && <Text style={styles.ButtonText}>post reply</Text>}
            </Pressable>
          );
        };

        const renderButton2 = () => {
          return (
            <Pressable
              disabled={mloader}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                styles.ButtonContainer,
                {backgroundColor: theme.color.button2, marginLeft: 15},
              ]}
              onPress={closeModal}>
              <Text style={[styles.ButtonText, {color: theme.color.subTitle}]}>
                cancel
              </Text>
            </Pressable>
          );
        };

        return (
          <View style={styles.modalBottomContainer}>
            {renderButton1()}
            {renderButton2()}
          </View>
        );
      };

      return (
        <Modal visible={isModal} transparent onRequestClose={closeModal}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContainer2}>
              <View style={styles.modal}>
                {renderHeader()}
                {renderField()}
                {renderBottom()}
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      );
    }

    if (modalChk == 'dispute') {
      let c = modalHeight >= maxModalHeight ? true : false;
      let style = c ? [styles.modal2, {height: maxModalHeight}] : styles.modal;

      const renderHeader = () => {
        let text = 'Dispute Review';

        const renderCross = () => {
          return (
            <Pressable
              style={({pressed}) => [{opacity: pressed ? 0.7 : 1.0}]}
              onPress={closeModal}>
              <utils.vectorIcon.Ionicons
                name="ios-close-outline"
                color={theme.color.title}
                size={32}
              />
            </Pressable>
          );
        };

        const renderTitle = () => {
          return <Text style={styles.modalTitle}>{text}</Text>;
        };

        return (
          <View
            style={
              c
                ? {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 15,
                    paddingTop: 15,
                    paddingBottom: 7,
                    shadowColor: '#000000',
                    shadowOffset: {width: 0, height: 1}, // change this for more shadow
                    shadowOpacity: 0.1,
                    elevation: 1,
                    backgroundColor: theme.color.background,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }
                : {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }
            }>
            <View style={{width: '80%'}}>{renderTitle()}</View>
            {renderCross()}
          </View>
        );
      };

      const renderSec1 = () => {
        return (
          <View style={{marginTop: 7, width: '100%'}}>
            <Text style={styles.modalSec1Title}>
              You are about to open a dispute on the member review below.{' '}
              <Text
                style={[
                  styles.modalSec1Title,
                  {fontFamily: theme.fonts.fontNormal},
                ]}>
                {`Once a dispute is opened, you will not be able to reply to the review or interact with this member until the dispute is settled.\n\nIf we find that this member violated any terms of our User Agreement or Privacy Policy, we will take appropriate action. We also may contact you if we need more information.`}
              </Text>
            </Text>
          </View>
        );
      };

      const renderSec2 = () => {
        let d = modalObj.item;
        let userName = d.guestId.firstName + ' ' + d.guestId.lastName;
        let userComment = '';

        let msgs = d.messages || [];

        if (msgs.length > 0) {
          msgs.map((e, i, a) => {
            if (e.role == 'guest') {
              userComment = e.message;
            }
          });
        }

        return (
          <View style={styles.modalSec2Container}>
            <Text style={styles.modalSec2Title}>
              {userName}
              <Text style={[styles.modalSec2Title, {textTransform: 'none'}]}>
                {' '}
                wrote:
              </Text>
            </Text>
            <ScrollView showsVerticalScrollIndicator>
              <Text style={styles.modalSec2Title2}>{userComment}</Text>
            </ScrollView>
          </View>
        );
      };

      const renderSec3 = () => {
        return (
          <View style={{marginTop: 15}}>
            <View style={{flexDirection: 'row', width: '100%'}}>
              <Pressable
                disabled={mloader}
                style={({pressed}) => [
                  {opacity: pressed ? 0.5 : 1.0},
                  {
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    backgroundColor: !isTerms ? 'white' : theme.color.button1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: theme.color.fieldBorder,
                  },
                ]}
                activeOpacity={0.5}
                onPress={() => {
                  setisTerms(!isTerms);
                  setEmptyTerms(false);
                }}>
                {isTerms && (
                  <utils.vectorIcon.FontAwesome5
                    name={'check'}
                    color={theme.color.buttonText}
                    size={11}
                  />
                )}
              </Pressable>

              <View style={{marginLeft: 7, width: '92%'}}>
                <Text style={styles.modalSec1Title}>
                  This review may contain personally identifiable information.{' '}
                  <Text
                    style={[
                      styles.modalSec1Title,
                      {fontFamily: theme.fonts.fontNormal},
                    ]}>
                    {`I hereby declare that by checking this box, the information provided here is true and correct. I also understand that any willful dishonesty may result in permanent suspension of my account across all Trip Trader services.`}
                  </Text>
                </Text>
              </View>
            </View>
            {EmptyTerms && renderShowFieldError('terms')}
          </View>
        );
      };

      const renderBottom = () => {
        const renderButton1 = () => {
          return (
            <Pressable
              disabled={mloader || !isTerms}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : !isTerms ? 0.5 : 1},
                [styles.ButtonContainer],
              ]}
              onPress={actionDsipute}>
              {mloader && (
                <ActivityIndicator size={20} color={theme.color.buttonText} />
              )}
              {!mloader && (
                <Text style={styles.ButtonText}>submit dispute</Text>
              )}
            </Pressable>
          );
        };

        const renderButton2 = () => {
          return (
            <Pressable
              disabled={mloader}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                styles.ButtonContainer,
                {backgroundColor: theme.color.button2, marginLeft: 15},
              ]}
              onPress={closeModal}>
              <Text style={[styles.ButtonText, {color: theme.color.subTitle}]}>
                cancel
              </Text>
            </Pressable>
          );
        };

        let sty = c
          ? [
              styles.modalBottomContainer,
              {
                borderBottomLeftRadius: 15,
                borderBottomRightRadius: 15,
                marginTop: 5,
                paddingTop: 10,
                paddingBottom: 15,
                paddingHorizontal: 15,
                backgroundColor: theme.color.background,
                shadowColor: '#000000',
                shadowOffset: {width: 0, height: -1}, // change this for more shadow
                shadowOpacity: 0.1,
                elevation: 22,
              },
            ]
          : [styles.modalBottomContainer];

        return (
          <View style={sty}>
            {renderButton1()}
            {renderButton2()}
          </View>
        );
      };

      return (
        <Modal visible={isModal} transparent onRequestClose={closeModal}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContainer2}>
              <View
                onLayout={event => {
                  if (!c) {
                    let {height} = event.nativeEvent.layout;
                    setmodalHeight(height);
                  }
                }}
                style={style}>
                {c && (
                  <>
                    {renderHeader()}
                    <ScrollView
                      contentContainerStyle={{paddingHorizontal: 15}}
                      showsVerticalScrollIndicator={false}
                      style={{flex: 1}}>
                      {renderSec1()}
                      {renderSec2()}
                      {renderSec3()}
                    </ScrollView>
                    {renderBottom()}
                  </>
                )}

                {!c && (
                  <>
                    {renderHeader()}
                    {renderSec1()}
                    {renderSec2()}
                    {renderSec3()}
                    {renderBottom()}
                  </>
                )}
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      );
    }

    if (modalChk == 'delete') {
      const renderHeader = () => {
        let text = 'Delete Comment';

        const renderCross = () => {
          return (
            <Pressable
              disabled={mloader}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                styles.modalCross,
              ]}
              onPress={closeModal}>
              <utils.vectorIcon.Ionicons
                name="ios-close-outline"
                color={theme.color.title}
                size={32}
              />
            </Pressable>
          );
        };

        const renderTitle = () => {
          return <Text style={styles.modalTitle}>{text}</Text>;
        };

        return (
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {renderTitle()}
            {renderCross()}
          </View>
        );
      };

      const renderTitle = () => {
        let d = modalObj.item;
        let userName = d.guestId.firstName + ' ' + d.guestId.lastName;

        return (
          <View
            style={{
              marginTop: 15,
            }}>
            <Text style={styles.modalDeleteTitle}>
              Are you sure you want to delete your comment to{' '}
              <Text
                style={[
                  styles.modalDeleteTitle,
                  {
                    fontFamily: theme.fonts.fontBold,
                    textTransform: 'capitalize',
                  },
                ]}>
                {userName}?
              </Text>
            </Text>
          </View>
        );
      };

      const renderBottom = () => {
        const renderButton1 = () => {
          return (
            <Pressable
              disabled={mloader}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1},
                [styles.ButtonContainer, {backgroundColor: '#B93B3B'}],
              ]}
              onPress={actionDelete}>
              {mloader && (
                <ActivityIndicator size={20} color={theme.color.buttonText} />
              )}
              {!mloader && (
                <Text style={styles.ButtonText}>Yes, delete it</Text>
              )}
            </Pressable>
          );
        };

        const renderButton2 = () => {
          return (
            <Pressable
              disabled={mloader}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                styles.ButtonContainer,
                {backgroundColor: theme.color.button2, marginLeft: 15},
              ]}
              onPress={closeModal}>
              <Text style={[styles.ButtonText, {color: theme.color.subTitle}]}>
                No, keep it
              </Text>
            </Pressable>
          );
        };

        return (
          <View style={styles.modalBottomContainer}>
            {renderButton1()}
            {renderButton2()}
          </View>
        );
      };

      return (
        <Modal visible={isModal} transparent onRequestClose={closeModal}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContainer2}>
              <View style={styles.modal}>
                {renderHeader()}
                {renderTitle()}
                {renderBottom()}
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      );
    }
  };

  const renderLeaveReviewModal = () => {
    let c = modalHeight >= maxModalHeight ? true : false;
    let style = c ? [styles.modal2, {height: maxModalHeight}] : styles.modal;

    const renderHeader = () => {
      let text = 'Leave a review';

      const renderCross = () => {
        return (
          <Pressable
            disabled={mloader}
            style={({pressed}) => [{opacity: pressed ? 0.7 : 1.0}]}
            onPress={closeReviewModal}>
            <utils.vectorIcon.Ionicons
              name="ios-close-outline"
              color={theme.color.title}
              size={32}
            />
          </Pressable>
        );
      };

      const renderTitle = () => {
        return <Text style={styles.modalTitle}>{text}</Text>;
      };

      return (
        <View
          style={
            c
              ? {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                  paddingTop: 15,
                  paddingBottom: 7,
                  shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 1}, // change this for more shadow
                  shadowOpacity: 0.1,
                  elevation: 1,
                  backgroundColor: theme.color.background,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }
              : {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }
          }>
          <View style={{width: '80%'}}>{renderTitle()}</View>
          {renderCross()}
        </View>
      );
    };

    const renderSec1 = () => {
      let tt = ''; // review trip title
      let cuid = store.User.user._id; //curetn user id

      if (cuid != isAnyTrade.offeredBy._id) {
        tt = isAnyTrade.hostTrip.title;
      } else {
        tt = isAnyTrade.offeredTrip.title;
      }

      return (
        <>
          <View>
            <View
              style={[
                styles.modalFieldConatiner,
                {flexDirection: 'row', alignItems: 'center'},
              ]}>
              <Text style={styles.mfT1trp}>Trip Description</Text>
              <Image
                style={{
                  width: 17,
                  height: 17,
                  resizeMode: 'contain',
                  marginLeft: 4,
                  top: -2,
                }}
                source={require('../../../assets/images/info/img.png')}
              />
            </View>
            <Text style={styles.mfT1trptitle}>{tt}</Text>
          </View>

          <View style={styles.modalFieldConatiner}>
            <Text style={[styles.mfT1, {textTransform: 'none'}]}>
              Rate your overall experience
            </Text>
            <View
              style={{
                width: '43%',
                marginTop: 5,
              }}>
              <StarRating
                starSize={23}
                disabled={false}
                maxStars={5}
                rating={rate}
                selectedStar={rating => setrate(rating)}
                emptyStarColor={'#CCCCCC'}
                fullStarColor={'#FCBC17'}
                emptyStar={'star'}
                fullStar={'star'}
                iconSet={'FontAwesome'}
              />
            </View>
          </View>

          <View style={styles.modalFieldConatiner}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.mfT1}>Message</Text>
              <Text style={styles.mfT1msg}>
                {message.length} / {maxReview}
              </Text>
            </View>

            <View style={styles.textArea}>
              <TextInput
                maxLength={maxReview}
                value={message}
                onChangeText={c => {
                  setMessage(c);
                }}
                style={styles.mTextInpt}
                placeholder="Tell others about your trip..."
                multiline={true}
                numberOfLines={10}
              />
            </View>
          </View>
        </>
      );
    };

    const renderBottom = () => {
      const renderButton1 = () => {
        return (
          <Pressable
            onPress={!isrObj ? postReview : EditReview}
            disabled={mloader == true ? true : message == '' ? true : false}
            style={({pressed}) => [
              {opacity: pressed ? 0.9 : message == '' ? 0.5 : 1},
              [styles.ButtonContainer],
            ]}>
            {mloader && (
              <ActivityIndicator size={20} color={theme.color.buttonText} />
            )}
            {!mloader && <Text style={[styles.ButtonText]}>Submit Review</Text>}
          </Pressable>
        );
      };

      const renderButton2 = () => {
        return (
          <Pressable
            disabled={mloader}
            style={({pressed}) => [
              {opacity: pressed ? 0.7 : 1.0},
              styles.ButtonContainer,
              {backgroundColor: theme.color.button2, marginLeft: 15},
            ]}
            onPress={closeReviewModal}>
            <Text style={[styles.ButtonText, {color: '#30563A'}]}>cancel</Text>
          </Pressable>
        );
      };

      let sty = c
        ? [
            styles.modalBottomContainer,
            {
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
              marginTop: 5,
              paddingTop: 10,
              paddingBottom: 15,
              paddingHorizontal: 15,
              backgroundColor: theme.color.background,
              shadowColor: '#000000',
              shadowOffset: {width: 0, height: -1}, // change this for more shadow
              shadowOpacity: 0.1,
              elevation: 22,
            },
          ]
        : [styles.modalBottomContainer];

      return (
        <View style={sty}>
          {renderButton1()}
          {renderButton2()}
        </View>
      );
    };

    return (
      <Modal visible={isrModal} transparent onRequestClose={closeReviewModal}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContainer2}>
            <View
              onLayout={event => {
                if (!c) {
                  let {height} = event.nativeEvent.layout;
                  setmodalHeight(height);
                }
              }}
              style={style}>
              {c && (
                <>
                  {renderHeader()}
                  <ScrollView
                    contentContainerStyle={{paddingHorizontal: 15}}
                    showsVerticalScrollIndicator={false}
                    style={{flex: 1}}>
                    {renderSec1()}
                  </ScrollView>
                  {renderBottom()}
                </>
              )}

              {!c && (
                <>
                  {renderHeader()}
                  {renderSec1()}

                  {renderBottom()}
                </>
              )}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderSendReviewModal = () => {
    let c = modalHeight >= maxModalHeight ? true : false;
    let style = c ? [styles.modal2, {height: maxModalHeight}] : styles.modal;

    const renderHeader = () => {
      let text = 'Review submitted!';

      const renderCross = () => {
        return (
          <Pressable
            style={({pressed}) => [{opacity: pressed ? 0.7 : 1.0}]}
            onPress={() => closeSendReviewModal('')}>
            <utils.vectorIcon.Ionicons
              name="ios-close-outline"
              color={theme.color.title}
              size={32}
            />
          </Pressable>
        );
      };

      const renderTitle = () => {
        return <Text style={styles.modalTitle}>{text}</Text>;
      };

      return (
        <View
          style={
            c
              ? {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                  paddingTop: 15,
                  paddingBottom: 7,
                  shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 1}, // change this for more shadow
                  shadowOpacity: 0.1,
                  elevation: 1,
                  backgroundColor: theme.color.background,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }
              : {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }
          }>
          <View style={{width: '80%'}}>{renderTitle()}</View>
          {/* {renderCross()} */}
        </View>
      );
    };

    const renderSec1 = () => {
      let t =
        'Thanks for your feedback!  We appreciate you taking time to share your experiences with the Trip Trader community.';
      return (
        <>
          <View style={[styles.modalFieldConatiner, {marginTop: 20}]}>
            <Text style={styles.mfT1trptitleee}>{t}</Text>
          </View>
        </>
      );
    };

    const renderBottom = () => {
      const renderButton1 = () => {
        return (
          <Pressable
            onPress={() => closeSendReviewModal('')}
            style={({pressed}) => [
              {opacity: pressed ? 0.8 : 1},
              [styles.ButtonContainer],
            ]}>
            <Text style={[styles.ButtonText]}>Done</Text>
          </Pressable>
        );
      };

      const renderButton2 = () => {
        return (
          <Pressable
            style={({pressed}) => [
              {opacity: pressed ? 0.8 : 1.0},
              styles.ButtonContainer,
              {backgroundColor: theme.color.button2, marginLeft: 15},
            ]}
            onPress={() => closeSendReviewModal('goto')}>
            <Text style={[styles.ButtonText, {color: '#30563A'}]}>
              Go to my review
            </Text>
          </Pressable>
        );
      };

      let sty = c
        ? [
            styles.modalBottomContainer,
            {
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
              marginTop: 5,
              paddingTop: 10,
              paddingBottom: 15,
              paddingHorizontal: 15,
              backgroundColor: theme.color.background,
              shadowColor: '#000000',
              shadowOffset: {width: 0, height: -1}, // change this for more shadow
              shadowOpacity: 0.1,
              elevation: 22,
            },
          ]
        : [styles.modalBottomContainer];

      return (
        <View style={sty}>
          {renderButton1()}
          {renderButton2()}
        </View>
      );
    };

    return (
      <Modal
        visible={isSendReview}
        transparent
        onRequestClose={() => closeSendReviewModal('')}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContainer2}>
            <View
              onLayout={event => {
                if (!c) {
                  let {height} = event.nativeEvent.layout;
                  setmodalHeight(height);
                }
              }}
              style={style}>
              {c && (
                <>
                  {renderHeader()}
                  <ScrollView
                    contentContainerStyle={{paddingHorizontal: 15}}
                    showsVerticalScrollIndicator={false}
                    style={{flex: 1}}>
                    {renderSec1()}
                  </ScrollView>
                  {renderBottom()}
                </>
              )}

              {!c && (
                <>
                  {renderHeader()}
                  {renderSec1()}

                  {renderBottom()}
                </>
              )}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderDeleteReviewModal = () => {
    let c = modalHeight >= maxModalHeight ? true : false;
    let style = c ? [styles.modal2, {height: maxModalHeight}] : styles.modal;

    const renderHeader = () => {
      let text = 'Delete Review';

      const renderCross = () => {
        return (
          <Pressable
            disabled={mloader}
            style={({pressed}) => [{opacity: pressed ? 0.7 : 1.0}]}
            onPress={closeDeleteModal}>
            <utils.vectorIcon.Ionicons
              name="ios-close-outline"
              color={theme.color.title}
              size={32}
            />
          </Pressable>
        );
      };

      const renderTitle = () => {
        return <Text style={styles.modalTitle}>{text}</Text>;
      };

      return (
        <View
          style={
            c
              ? {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                  paddingTop: 15,
                  paddingBottom: 7,
                  shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 1}, // change this for more shadow
                  shadowOpacity: 0.1,
                  elevation: 1,
                  backgroundColor: theme.color.background,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }
              : {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }
          }>
          <View style={{width: '80%'}}>{renderTitle()}</View>
          {renderCross()}
        </View>
      );
    };

    const renderSec1 = () => {
      let t = 'Are you sure you want to delete your review for ';
      let name = user.firstName + ' ' + user.lastName;
      return (
        <>
          <View style={[styles.modalFieldConatiner, {marginTop: 20}]}>
            <Text style={styles.mfT1trptitleee}>
              {t}
              <Text
                style={[
                  styles.mfT1trptitleee,
                  {fontFamily: theme.fonts.fontBold},
                ]}>
                {name}
              </Text>
              ?
            </Text>
          </View>
        </>
      );
    };

    const renderBottom = () => {
      const renderButton1 = () => {
        return (
          <Pressable
            disabled={mloader}
            onPress={DeleteReview}
            style={({pressed}) => [
              {opacity: pressed ? 0.8 : 1},
              [styles.ButtonContainer, {backgroundColor: '#B93B3B'}],
            ]}>
            {mloader && (
              <ActivityIndicator size={20} color={theme.color.buttonText} />
            )}
            {!mloader && (
              <Text style={[styles.ButtonText, {textTransform: 'none'}]}>
                Yes, delete it
              </Text>
            )}
          </Pressable>
        );
      };

      const renderButton2 = () => {
        return (
          <Pressable
            disabled={mloader}
            style={({pressed}) => [
              {opacity: pressed ? 0.8 : 1.0},
              styles.ButtonContainer,
              {backgroundColor: theme.color.button2, marginLeft: 15},
            ]}
            onPress={closeDeleteModal}>
            <Text
              style={[
                styles.ButtonText,
                {color: '#30563A', textTransform: 'none'},
              ]}>
              No, keep it
            </Text>
          </Pressable>
        );
      };

      let sty = c
        ? [
            styles.modalBottomContainer,
            {
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
              marginTop: 5,
              paddingTop: 10,
              paddingBottom: 15,
              paddingHorizontal: 15,
              backgroundColor: theme.color.background,
              shadowColor: '#000000',
              shadowOffset: {width: 0, height: -1}, // change this for more shadow
              shadowOpacity: 0.1,
              elevation: 22,
            },
          ]
        : [styles.modalBottomContainer];

      return (
        <View style={sty}>
          {renderButton1()}
          {renderButton2()}
        </View>
      );
    };

    return (
      <Modal visible={isdModal} transparent onRequestClose={closeDeleteModal}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContainer2}>
            <View
              onLayout={event => {
                if (!c) {
                  let {height} = event.nativeEvent.layout;
                  setmodalHeight(height);
                }
              }}
              style={style}>
              {c && (
                <>
                  {renderHeader()}
                  <ScrollView
                    contentContainerStyle={{paddingHorizontal: 15}}
                    showsVerticalScrollIndicator={false}
                    style={{flex: 1}}>
                    {renderSec1()}
                  </ScrollView>
                  {renderBottom()}
                </>
              )}

              {!c && (
                <>
                  {renderHeader()}
                  {renderSec1()}

                  {renderBottom()}
                </>
              )}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {data.length > 0 && renderShowRes()}
      <ScrollView
        style={{marginTop: 3}}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {getDataOnce && data.length <= 0 && !loader && renderMessage('empty')}

        {data.length >= 0 && (
          <FlatList
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            initialNumToRender={18}
            maxToRenderPerBatch={6}
            data={data}
            extraData={data}
            renderItem={renderShowData}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </ScrollView>
      {!getDataOnce && loader && renderLoader()}
      {isModal && renderModal()}
      {isrModal && renderLeaveReviewModal()}
      {isSendReview && renderSendReviewModal()}
      {isdModal && renderDeleteReviewModal()}
    </SafeAreaView>
  );
}
