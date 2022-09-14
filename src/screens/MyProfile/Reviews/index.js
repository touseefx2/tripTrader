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
  Modal as MModal,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
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
  let headerTitle = 'Reviews';
  let internet = store.General.isInternet;
  let user = store.User.user;
  let data = store.User.review;
  const totalData = data.length;
  let loader = store.User.reviewLoader;

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

  const getDbData = c => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        const dt = [
          {
            _id: 21,
            user: {
              _id: 2,
              first_name: 'mike',
              last_name: 'monuse',
              photo:
                'https://coolhdwall.com/storage/2201/umji-viviz-profile-4k-phone-wallpaper-2160x3840-12.jpg',
              avg_rating: 3.8,
              total_reviews: 190,
            },
            comment:
              'John Thompson was a great host! I had an amazing time and killed a great duck.',
            created_at: new Date(),
          },
          {
            _id: 22,
            user: {
              _id: 3,
              first_name: 'tom',
              last_name: 'jerry',
              photo: '',
              avg_rating: 4.5,
              total_reviews: 45,
            },
            comment: 'John Thompson was a great host! I had an amazing time.',
            created_at: new Date(),
            reply: {
              user: store.User.user,
              comment:
                'Thank you, Jerry! I had a blast and hope to trade with you again soon. Highly recommend others to trade with you.',
              created_at: new Date(),
            },
          },
          {
            _id: 23,
            user: {
              _id: 4,
              first_name: 'Mano',
              last_name: 'Twis',
              photo:
                'https://t3.ftcdn.net/jpg/03/67/46/48/360_F_367464887_f0w1JrL8PddfuH3P2jSPlIGjKU2BI0rn.jpg',
              avg_rating: 2.0,
              total_reviews: 10,
            },
            comment:
              'John Thompson was a great host! I had an amazing time and enjoy.',
            created_at: new Date(),
          },
        ];
        store.User.attemptToGetReviews(
          user._id,
          setGetDataOnce,
          setrefeshing,
          dt,
        );
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

  const Reply = () => {};

  const Dispute = () => {};

  const EditComment = () => {};

  const DeleteComment = () => {};

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
    let photo = item.user.photo;
    let userName = item.user.first_name + ' ' + item.user.last_name;
    let avgRating = item.user.avg_rating;
    let totalReviews = item.user.total_reviews;
    let postDate = item.created_at;
    let userComment = item.comment;
    let reply = item.reply ? item.reply : '';

    let ruserPhoto = '';
    let ruserName = '';
    let ruserComment = '';
    let rpostDate = '';
    if (reply) {
      ruserPhoto = reply.user.photo;
      ruserName = reply.user.first_name + ' ' + reply.user.last_name;
      ruserComment = reply.comment;
      rpostDate = reply.created_at;
    }

    const formatDate = date => {
      var dd = moment(date).format('MMM DD, YYYY');
      return dd;
    };

    const renderShowCommentBox = () => {
      const renderProfile = () => {
        return (
          <View style={styles.ProfileImgContainer}>
            <ProgressiveFastImage
              useNativeDriver
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

            {/* <Image
              style={styles.ProfileImg}
              source={
                photo != ''
                  ? {uri: photo}
                  : require('../../../assets/images/drawer/guest/img.png')
              }
            /> */}
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
                {avgRating.toFixed(1)}
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

      const renderShowReplyButton = () => {
        const renderReplyButton = () => {
          return (
            <TouchableOpacity
              onPress={Reply}
              activeOpacity={0.7}
              style={styles.smallButtonContainer}>
              <Text style={styles.sb1Text}>Reply</Text>
            </TouchableOpacity>
          );
        };

        const renderDisputeButton = () => {
          return (
            <TouchableOpacity
              onPress={Dispute}
              activeOpacity={0.7}
              style={[
                styles.smallButtonContainer,
                {backgroundColor: theme.color.disableSmallButton},
              ]}>
              <Text style={styles.sb2Text}>dispute</Text>
            </TouchableOpacity>
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
            <TouchableOpacity
              onPress={Dispute}
              activeOpacity={0.7}
              style={[
                styles.smallButtonContainer,
                {backgroundColor: theme.color.disableSmallButton},
              ]}>
              <Text style={styles.sb2Text}>dispute review</Text>
            </TouchableOpacity>
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
          {reply == '' && renderShowReplyButton()}
          {reply != '' && renderShowDipsutebutton()}
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
              <TouchableOpacity
                onPress={EditComment}
                activeOpacity={0.7}
                style={styles.smallButtonContainer}>
                <Text style={styles.sb1Text}>edit</Text>
              </TouchableOpacity>
            );
          };

          const renderDeleteButton = () => {
            return (
              <TouchableOpacity
                onPress={DeleteComment}
                activeOpacity={0.7}
                style={[
                  styles.smallButtonContainer,
                  {backgroundColor: 'transparent'},
                ]}>
                <Text style={[styles.sb2Text, {color: '#B93B3B'}]}>delete</Text>
              </TouchableOpacity>
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
              You replied on {formatDate(postDate)}
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
        <View style={{marginBottom: 15}}>
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
            ? ' No trip reviews received yet.'
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

  return (
    <SafeAreaView style={styles.container}>
      {/* {data.length > 0 && renderShowRes()} */}
      <ScrollView
        style={{marginTop: 10}}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {getDataOnce && data.length <= 0 && !loader && renderMessage('empty')}
        {!getDataOnce &&
          !internet &&
          !loader &&
          data.length <= 0 &&
          renderMessage('internet')}

        {data.length >= 0 && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={renderShowData}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </ScrollView>
      {!getDataOnce && loader && renderLoader()}
    </SafeAreaView>
  );
}
