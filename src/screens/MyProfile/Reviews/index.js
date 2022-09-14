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
                'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?cs=srgb&dl=pexels-suliman-sallehi-1704488.jpg&fm=jpg',
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
    let ruserName = '';
    let ruserPhoto = '';
    let ruserComment = '';
    let rpostDate = '';
    if (reply) {
      ruserPhoto = reply.user.photo;
      ruserName = reply.user.first_name + ' ' + reply.user.last_name;
      ruserComment = reply.comment;
      rpostDate = reply.created_at;
    }

    const formatDate = date => {
      var dd = moment(date).format('DD MMM YYYY');
      return dd;
    };

    const renderProfile = () => {
      return (
        <View style={styles.ProfileImgContainer}>
          <Image
            style={styles.ProfileImg}
            source={
              photo != ''
                ? {uri: photo}
                : require('../../../assets/images/drawer/guest/img.png')
            }
          />
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
              {avgRating}
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
          <Text style={styles.dateContainerTitle}>{formatDate(postDate)}</Text>
        </View>
      );
    };

    const renderComment = () => {
      return <Text style={styles.boxSection2title}>{userComment}</Text>;
    };

    const renderReplyButton = () => {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            borderRadius: 5,
            paddingVertical: 4,
            paddingHorizontal: 10,
            backgroundColor: theme.color.button1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: theme.color.buttonText,
              fontFamily: theme.fonts.fontBold,
              fontSize: 12,
              textTransform: 'capitalize',
            }}>
            Reply
          </Text>
        </TouchableOpacity>
      );
    };

    const renderDisputeButton = () => {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            borderRadius: 5,
            paddingVertical: 4,
            paddingHorizontal: 10,
            backgroundColor: theme.color.disableField,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: theme.color.subTitle,
              fontFamily: theme.fonts.fontBold,
              fontSize: 12,
              textTransform: 'capitalize',
            }}>
            dispute
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <>
        <View
          style={[[styles.boxContainer, {marginBottom: reply == '' ? 15 : 0}]]}>
          <View style={styles.boxSection1}>
            {renderProfile()}
            {renderText()}
            {renderDate()}
          </View>
          <View style={styles.boxSection2}>{renderComment()}</View>
          {reply == '' && (
            <View style={styles.boxSection3}>
              {renderReplyButton()}
              <View style={{width: 12}} />
              {renderDisputeButton()}
            </View>
          )}
        </View>

        {/* {reply != '' && <View style={styles.repBoxContainerLine} />}
        {reply !== '' && (
          <View style={styles.rboxContainer}>
            <Text>as</Text>
          </View>
        )} */}
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
          marginTop: '30%',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <ActivityIndicator size={30} color={theme.color.button1} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {data.length > 0 && renderShowRes()}
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {getDataOnce && data.length <= 0 && renderMessage('empty')}
        {!getDataOnce &&
          !internet &&
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
        {!getDataOnce && loader && renderLoader()}
      </ScrollView>
    </SafeAreaView>
  );
}
