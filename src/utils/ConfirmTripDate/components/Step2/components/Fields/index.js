import React from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import {styles} from './styles';
import theme from '../../../../../../theme';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import moment from 'moment';
import utils from '../../../../../../utils';

const guest = require('../../../../../../assets/images/drawer/guest/img.png');
const trnfericon = require('../../../../../../assets/images/transfer/img.png');
const durtnicon = require('../../../../../../assets/images/confirmTrip/duration/img.png');
const avlblicon = require('../../../../../../assets/images/confirmTrip/available/img.png');
const locationicon = require('../../../../../../assets/images/confirmTrip/location/img.png');

export default function Fields({modalObj, selectedDates, goBack}) {
  const {item} = modalObj;

  const user = item.offeredBy;
  const photo = user.image ? {uri: user.image} : guest;
  const ofer = item.hostTrip;

  const user2 = item.offeredTo;
  const photo2 = user2.image ? {uri: user2.image} : guest;
  const trade = item.offeredTrip;

  //offer by (host trip)
  const title = ofer.species + ' ' + ofer.tradeType;
  let dur = ofer.duration.value;
  let t =
    dur <= 1
      ? ofer.duration.title.substring(0, ofer.duration.title.length - 1)
      : ofer.duration.title;
  dur = dur + ' ' + t;
  let preferDate = [];
  let esd = [];
  //for sort and set format
  if (selectedDates) {
    Object.keys(selectedDates).forEach(function (key, index) {
      esd.push(key);
    });
  }
  if (esd.length > 0) {
    esd.sort(function (a, b) {
      return Number(new Date(a)) - Number(new Date(b));
    });
    esd.map(e => {
      preferDate.push(moment(e).format('MMM DD, YYYY'));
    });
  }
  const avlbl = utils.functions.FormatePreferDate(preferDate);
  const loc = ofer.location.city + ', ' + ofer.location.state;

  //ofer to (offer trip)
  let titlet = trade.species + ' ' + trade.tradeType;
  let durt = trade.duration.value;
  let tt =
    durt <= 1
      ? trade.duration.title.substring(0, trade.duration.title.length - 1)
      : trade.duration.title;
  durt = durt + ' ' + tt;
  let preferdates = item.preferredDates;
  let avlblt = utils.functions.FormatePreferDate(preferdates);
  let loct = trade.location.city + ', ' + trade.location.state;

  const titleS = {
    color: theme.color.subTitleLight,
    fontSize: 11.5,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'uppercase',
  };

  const titleM = {
    color: theme.color.title,
    fontSize: 13,
    fontFamily: theme.fonts.fontMedium,
    lineHeight: 19,
    marginTop: 2,
  };

  const iconS = {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  };

  const titleM2 = {
    color: '#101B10',
    fontSize: 13,
    fontFamily: theme.fonts.fontNormal,
    lineHeight: 19,
  };

  return (
    <View style={{width: '97%', marginTop: 20, alignSelf: 'center'}}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{width: '40%'}}>
          <View style={styles.mProfileImgContainerr}>
            <ProgressiveFastImage
              style={styles.mProfileImgr}
              source={photo}
              loadingImageStyle={styles.mimageLoaderr}
              loadingSource={require('../../../../../../assets/images/imgLoad/img.jpeg')}
              blurRadius={5}
            />
          </View>

          <Text style={titleS}>Offering</Text>
          <Text style={titleM}>{title}</Text>

          <View style={{marginTop: 20}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Image style={iconS} source={durtnicon} />
              <View style={{width: '78%'}}>
                <Text style={titleM2}>{dur}</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <Image style={iconS} source={avlblicon} />
              <View style={{width: '78%'}}>
                <Text style={titleM2}>{avlbl}</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <Image style={iconS} source={locationicon} />
              <View style={{width: '78%'}}>
                <Text style={titleM2}>{loc}</Text>
              </View>
            </View>
          </View>
        </View>

        <Image
          style={{
            width: 24,
            height: 24,
            top: 86,
            resizeMode: 'contain',
          }}
          source={trnfericon}
        />

        <View style={{width: '40%'}}>
          <View style={styles.mProfileImgContainerr}>
            <ProgressiveFastImage
              style={styles.mProfileImgr}
              source={photo2}
              loadingImageStyle={styles.mimageLoader}
              loadingSource={require('../../../../../../assets/images/imgLoad/img.jpeg')}
              blurRadius={5}
            />
          </View>

          <Text style={titleS}>for trade</Text>
          <Text style={titleM}>{titlet}</Text>

          <View style={{marginTop: 20}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Image style={iconS} source={durtnicon} />
              <View style={{width: '78%'}}>
                <Text style={titleM2}>{durt}</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <Image style={iconS} source={avlblicon} />
              <View style={{width: '78%'}}>
                <Text style={titleM2}>{avlblt}</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <Image style={iconS} source={locationicon} />
              <View style={{width: '78%'}}>
                <Text style={titleM2}>{loct}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <Pressable
        onPress={goBack}
        style={({pressed}) => [
          {opacity: pressed ? 0.8 : 1.0},
          {
            marginTop: 25,
          },
        ]}>
        <Text
          style={{
            color: '#3C6B49',
            fontSize: 11,
            fontFamily: theme.fonts.fontBold,
            textDecorationLine: 'underline',
          }}>
          Edit Trip Date
        </Text>
      </Pressable>
    </View>
  );
}
