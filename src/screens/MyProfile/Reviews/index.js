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

export default observer(Reviews);

function Reviews(props) {
  let maxModalHeight = theme.window.Height - 100;
  const [modalHeight, setmodalHeight] = useState(0);

  let headerTitle = 'Reviews';
  let internet = store.General.isInternet;
  let user = store.User.user;
  let data = store.User.review;
  const totalData = data.length;
  let loader = store.User.reviewLoader;
  let mloader = store.User.mLoader;

  const [modalObj, setmodalObj] = useState(false);
  const [modalChk, setmodalChk] = useState(false);
  const [isModal, setisModal] = useState(false);

  const [isTerms, setisTerms] = useState(false);
  const [EmptyTerms, setEmptyTerms] = useState(false);

  let maxCommentLength = 250;
  const [comment, setcomment] = useState('');

  const [getDataOnce, setgetDataOnce] = useState(false);
  const setGetDataOnce = C => {
    setgetDataOnce(C);
  };

  const [refreshing, setRefreshing] = React.useState(false);
  const setrefeshing = c => {
    setRefreshing(c);
  };

  const callGeneral = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.getUserById1(store.User.user._id, store.User.authToken, '');
        store.User.attemptToGetFollowers(
          store.User.user._id,
          () => {},
          () => {},
        );
        store.User.attemptToGetFollowing(
          store.User.user._id,
          () => {},
          () => {},
        );
      }
    });
  };

  const onRefresh = React.useCallback(() => {
    console.warn('onrefresh cal');
    setRefreshing(true);
    callGeneral();
    getDbData();
  }, []);

  const getDbData = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        // const dt = [
        //   {
        //     _id: 21,
        //     user: {
        //       _id: 2,
        //       first_name: 'mike',
        //       last_name: 'monuse',
        //       // photo:"",
        //       photo: '',
        //       avg_rating: 3.8,
        //       total_reviews: 190,
        //     },
        //     comment:
        //       'John Thompson was a great host! I had an amazing time and killed a great duck.',
        //     created_at: new Date(),
        //   },
        //   {
        //     _id: 22,
        //     user: {
        //       _id: 3,
        //       first_name: 'tom',
        //       last_name: 'jerry',
        //       photo: '',
        //       avg_rating: 4.5,
        //       total_reviews: 45,
        //       isVerified: true,
        //     },
        //     comment: 'John Thompson was a great host! I had an amazing time.',
        //     created_at: new Date(),
        //     reply: {
        //       user: store.User.user,
        //       comment:
        //         'Thank you, Jerry! I had a blast and hope to trade with you again soon. Highly recommend others to trade with you.',
        //       created_at: new Date(),
        //     },
        //   },
        //   {
        //     _id: 23,
        //     user: {
        //       _id: 4,
        //       first_name: 'Mano',
        //       last_name: 'Twis',
        //       // photo:"",
        //       photo:
        //         'https://t3.ftcdn.net/jpg/03/67/46/48/360_F_367464887_f0w1JrL8PddfuH3P2jSPlIGjKU2BI0rn.jpg',
        //       avg_rating: 2.0,
        //       total_reviews: 10,
        //     },
        //     comment:
        //       'John Thompson Thank you so much for your careful planning, attention to detail, and flexible offerings when the tropical system blew through and changed our plans! We had a blast exploring Miami, and eating so much great food.\nDinner reservations the first night we arrived were perfect- after a long day of traveling, we enjoyed a delicious meal overlooking the water',
        //     created_at: new Date(),
        //   },
        // ];
        store.User.attemptToGetReviews(user._id, setGetDataOnce, setrefeshing);
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

  const Reply = obj => {
    openModal(obj, 'reply');
  };
  const Dispute = obj => {
    openModal(obj, 'dispute');
  };
  const EditComment = obj => {
    openModal(obj, 'edit');
  };
  const DeleteComment = obj => {
    openModal(obj, 'delete');
  };

  const postReply = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.attemptToReplyComment(modalObj, comment, closeModal);
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
        store.User.attemptToDisputeComment(modalObj, closeModal);
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
        store.User.attemptToEditComment(modalObj, comment, closeModal);
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
        store.User.attemptToDeleteComment(modalObj, closeModal);
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
      <View style={{marginVertical: 5}}>
        <Text
          style={{
            fontSize: 13,
            color: theme.color.subTitleLight,
            fontFamily: theme.fonts.fontMedium,
          }}>
          Showing {data.length} of {totalData}
        </Text>
      </View>
    );
  };

  const renderShowData = ({item, index}) => {
    let usr = item.guestId;
    //reviewer user
    let photo = usr.image || '';
    let isuVeirfy = usr.identityStatus == 'verified' ? true : false;
    let userName = usr.firstName + ' ' + usr.lastName;
    let avgRating = usr.rating || 0;
    let totalReviews = usr.reviews || 0;
    let userComment = '';
    let postDate = '';
    let msgs = item.messages || [];
    let reply = '';
    if (msgs.length > 0) {
      msgs.map((e, i, a) => {
        if (e.role == 'guest') {
          postDate = e.updatedAt;
          userComment = e.message;
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
      let udcy = false; //is update date  current year
      let udy = parseInt(new Date(date).getFullYear());
      let cdy = parseInt(new Date().getFullYear());
      if (udy == cdy) {
        udcy = true;
      }
      var dd = '';
      if (udcy) {
        dd = moment(date).format('MMM DD');
      } else {
        dd = moment(date).format('MMM DD, YYYY');
      }
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

      const renderShowDsipute = () => {
        return (
          <View style={styles.boxSection3}>
            <utils.vectorIcon.AntDesign
              name="warning"
              color={'#B93B3B'}
              size={14}
            />
            <Text style={styles.disputeTitle}>
              You disputed this review on {formatdisputeDate(disputeDate)}
            </Text>
          </View>
        );
      };

      const renderShowReplyButton = () => {
        const renderReplyButton = () => {
          return (
            <Pressable
              onPress={() => Reply({item: item, i: index})}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                styles.smallButtonContainer,
              ]}>
              <Text style={styles.sb1Text}>Reply</Text>
            </Pressable>
          );
        };

        const renderDisputeButton = () => {
          return (
            <Pressable
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},

                styles.smallButtonContainer,
                {backgroundColor: theme.color.disableSmallButton},
              ]}
              onPress={() => Dispute({item: item, i: index})}>
              <Text style={styles.sb2Text}>dispute</Text>
            </Pressable>
          );
        };

        return (
          <View style={styles.boxSection3}>
            {renderReplyButton()}
            <View style={{width: 12}} />
            {renderDisputeButton()}
          </View>
        );
      };

      const renderShowDipsutebutton = () => {
        const renderDisputeButton = () => {
          return (
            <Pressable
              onPress={() => Dispute({item: item, i: index})}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                styles.smallButtonContainer,
                {backgroundColor: theme.color.disableSmallButton},
              ]}>
              <Text style={styles.sb2Text}>dispute review</Text>
            </Pressable>
          );
        };

        return <View style={styles.boxSection3}>{renderDisputeButton()}</View>;
      };

      return (
        <View style={styles.boxContainer}>
          <View style={styles.boxSection1}>
            {renderProfile()}
            {renderText()}
            {renderDate()}
          </View>
          <View style={styles.boxSection2}>{renderComment()}</View>
          {!dispute && (
            <>
              {reply == '' && renderShowReplyButton()}
              {reply != '' && renderShowDipsutebutton()}
            </>
          )}

          {dispute && renderShowDsipute()}
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
        const renderShowActionButton = () => {
          const renderEditButton = () => {
            return (
              <Pressable
                style={({pressed}) => [
                  {opacity: pressed ? 0.7 : 1.0},
                  styles.smallButtonContainer,
                ]}
                onPress={() => EditComment({item: item, i: index})}>
                <Text style={styles.sb1Text}>edit</Text>
              </Pressable>
            );
          };

          const renderDeleteButton = () => {
            return (
              <Pressable
                style={({pressed}) => [
                  {opacity: pressed ? 0.7 : 1.0},
                  styles.smallButtonContainer,
                  {backgroundColor: theme.color.button2},
                ]}
                onPress={() => DeleteComment({item: item, i: index})}>
                <Text style={[styles.sb2Text, {color: '#B93B3B'}]}>delete</Text>
              </Pressable>
            );
          };

          return (
            <View style={styles.repBoxButtonConainer}>
              {renderEditButton()}
              <View style={{width: 12}} />
              {renderDeleteButton()}
            </View>
          );
        };

        return (
          <View style={styles.repBoxContainer}>
            <Text style={styles.repBoxTitile1}>
              You replied on {formatDate(rpostDate)}:
            </Text>
            <Text style={styles.repBoxTitile2}>{ruserComment}</Text>
            {renderShowActionButton()}
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
          {reply != '' && !dispute && renderShowReplyBox()}
        </View>
      </>
    );
  };

  const renderMessage = c => {
    return (
      <View
        style={{
          marginTop: '45%',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <Text
          style={{
            fontSize: 14,
            color: theme.color.subTitleLight,
            fontFamily: theme.fonts.fontMedium,
          }}>
          {c == 'empty'
            ? 'No reviews received yet.'
            : 'Please connect internet.'}
        </Text>
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

  return (
    <SafeAreaView style={styles.container}>
      {/* {data.length > 0 && renderShowRes()} */}
      <ScrollView
        style={{marginTop: 3}}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {getDataOnce && data.length <= 0 && !loader && renderMessage('empty')}
        {/* {!getDataOnce &&
          !internet &&
          !loader &&
          data.length <= 0 &&
          renderMessage('internet')} */}

        {data.length >= 0 && (
          <FlatList
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
    </SafeAreaView>
  );
}
