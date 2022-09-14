import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  StatusBar,
} from 'react-native';
import {styles} from './styles';
import {inject, observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import DynamicTabView from 'react-native-dynamic-tab-view';
import {ActivityIndicator} from 'react-native-paper';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import moment from 'moment';
import Svg, {Path} from 'react-native-svg';
import MaskedView from '@react-native-community/masked-view';
import ImageSlider from 'react-native-image-slider';
import FastImage from 'react-native-fast-image';

export default observer(PromoDetails);
function PromoDetails(props) {
  const windowWidth = theme.window.Width;
  const imageAspectWidth = 375;
  const imageAspectHeight = 332;
  const curveAdjustment = 10;
  const maskHeight = responsiveHeight(28);
  const scaleFactor = imageAspectWidth / imageAspectHeight;
  const scaledHeight = scaleFactor * maskHeight;
  const controlPointX = windowWidth / 2.0;
  const controlPointY = scaledHeight + curveAdjustment;
  const curveCenterPointY = (controlPointY - maskHeight) / 2;

  const d = props.route.params.data;

  let internet = store.General.isInternet;

  const [data, setdata] = useState(d);

  console.log('data : ', data);

  const goBack = () => {
    props.navigation.goBack();
  };

  const formateDateTime = d => {
    let date = new Date(d);
    var tt = moment(date).format('hh:mm a');
    var dd = moment(date).format('D MMM Y');
    return dd + ', ' + tt;
  };

  const sep = () => {
    return (
      <View
        style={{
          width: '100%',
          backgroundColor: 'silver',
          height: 0,
          alignSelf: 'center',
          marginVertical: 8,
        }}
      />
    );
  };

  const renderCoverImage = () => {
    return (
      // <MaskedView
      //   style={[
      //     styles.mask,
      //     {
      //       height: controlPointY - curveCenterPointY,
      //     },
      //   ]}
      //   maskElement={
      //     <Svg height="100%" width="100%">
      //       <Path
      //         d={`M0 0 L${windowWidth} 0 L${windowWidth} ${maskHeight} Q${controlPointX} ${controlPointY} 0 ${maskHeight} Z`}
      //         fill={'#fff'}
      //       />
      //     </Svg>
      //   }>
      //   {/* <Image source={{uri: logoUri}} style={styles.image} /> */}
      // </MaskedView>

      <View style={styles.imageConatiner}>
        <TouchableOpacity activeOpacity={0.5} disabled>
          <FastImage
            style={styles.image}
            source={require('../../assets/images/promo/img.jpeg')}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
      </View>
    );
  };

  let name = data.name;
  let details =
    data.details ||
    `Your points can help you and others get more! Turn your points into big rewards with free rides.`;
  let minP = data.minPurchase || 0;
  let limit = data.limitPerUser || 0;
  let sD = data.startDate || '';
  let eD = data.expiryDate || '';
  let code = data._id;

  return (
    <SafeAreaView style={styles.container}>
      {!internet && <utils.InternetMessage />}

      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={'light-content'}
      />

      <View>{renderCoverImage()}</View>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.icon}
          activeOpacity={0.6}
          onPress={goBack}>
          <utils.vectorIcon.Ionicons
            name="ios-chevron-back-sharp"
            color={theme.color.button1}
            size={25}
          />
        </TouchableOpacity>
      </View>

      {data && (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.mainSec}>
              <View style={{paddingHorizontal: 12, paddingVertical: 8}}>
                <Text style={styles.sectionsTitle}>{name}</Text>
              </View>
              <View style={{paddingHorizontal: 12, paddingVertical: 8}}>
                <Text
                  style={{
                    width: '100%',
                    fontSize: 15,
                    lineHeight: 22,
                    color: theme.color.title,
                    fontFamily: theme.fonts.fontMedium,
                  }}>
                  {details}
                </Text>
              </View>

              {sep()}

              <View style={{paddingHorizontal: 12, paddingVertical: 8}}>
                <Text
                  style={{
                    width: '100%',
                    fontSize: 15,
                    lineHeight: 22,
                    color: theme.color.title,
                    fontFamily: theme.fonts.fontMedium,
                    textTransform: 'capitalize',
                  }}>
                  Add promo: {code}
                </Text>
              </View>

              {sep()}
              <View style={{paddingHorizontal: 12, paddingVertical: 8}}>
                <Text
                  style={{
                    width: '100%',
                    fontSize: 15,
                    lineHeight: 22,
                    color: theme.color.title,
                    fontFamily: theme.fonts.fontMedium,
                  }}>
                  Things to know:
                </Text>
                <View
                  style={{
                    flexDirection: 'row',

                    height: 25,
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      width: '5%',
                      height: '100%',
                      justifyContent: 'center',
                    }}>
                    <utils.vectorIcon.FontAwesome
                      name="circle"
                      color={theme.color.subTitle}
                      size={7}
                    />
                  </View>

                  <View
                    style={{
                      width: '94%',
                      height: '100%',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        lineHeight: 22,
                        color: theme.color.title,
                        fontFamily: theme.fonts.fontMedium,
                      }}>
                      Minimum purchase: PKR {minP}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',

                    height: 25,
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      width: '5%',
                      height: '100%',
                      justifyContent: 'center',
                    }}>
                    <utils.vectorIcon.FontAwesome
                      name="circle"
                      color={theme.color.subTitle}
                      size={7}
                    />
                  </View>

                  <View
                    style={{
                      width: '94%',
                      height: '100%',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        lineHeight: 22,
                        color: theme.color.title,
                        fontFamily: theme.fonts.fontMedium,
                      }}>
                      Valid for: {limit} orders/user
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',

                    height: 25,
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      width: '5%',
                      height: '100%',
                      justifyContent: 'center',
                    }}>
                    <utils.vectorIcon.FontAwesome
                      name="circle"
                      color={theme.color.subTitle}
                      size={7}
                    />
                  </View>

                  <View
                    style={{
                      width: '94%',
                      height: '100%',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        lineHeight: 22,
                        color: theme.color.title,
                        fontFamily: theme.fonts.fontMedium,
                      }}>
                      Valid till: {formateDateTime(eD)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
