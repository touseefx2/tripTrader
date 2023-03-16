import React, {useState, memo} from 'react';
import {View, Text, Pressable} from 'react-native';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import {styles} from './styles';
import store from '../../../store/index';
import utils from '../../../utils/index';
import theme from '../../../theme';
import {ImageSlider} from 'react-native-image-slider-banner';
import moment from 'moment/moment';
import * as Animatable from 'react-native-animatable';

export default memo(ExpandAllMainInfo);

function ExpandAllMainInfo({
  item,
  index,
  user,
  props,
  isActive,
  showpic,
  animtntime,
  openModal,
}) {
  const [pvm, setpvm] = useState(false);
  const [pd, setpd] = useState([]);
  const [pdc, setpdc] = useState('');

  let usr = item.hostId;

  if (usr) {
    //trip

    let tripPhotos = item.photos ? item.photos : [];
    let titlee = item.title || '';
    let locName = item.location.city + ', ' + item.location.state;
    let trade = item.returnActivity || '';
    let sd = item.availableFrom;
    let sdy = parseInt(new Date(sd).getFullYear());
    let ed = item.availableTo;
    let edy = parseInt(new Date(ed).getFullYear());

    let favlbl = '';

    if (sdy == edy) {
      favlbl =
        moment(sd).format('MMM DD') + ' - ' + moment(ed).format('MMM DD, YYYY');
    } else {
      favlbl =
        moment(sd).format('MMM DD, YYYY') +
        ' - ' +
        moment(ed).format('MMM DD, YYYY');
    }

    const renderSec2 = () => {
      const renderTripImages = () => {
        let chk =
          tripPhotos.length <= 0
            ? '0'
            : tripPhotos.length == 1
            ? '1'
            : tripPhotos.length > 1
            ? '2'
            : '0';

        return (
          <>
            {chk == '2' && (
              <>
                <View style={styles.tripImageConatiner}>
                  <ImageSlider
                    showHeader={false}
                    preview={true}
                    data={tripPhotos}
                    autoPlay={false}
                  />
                </View>
              </>
            )}

            {(chk == '0' || chk == '1') && (
              <>
                <Pressable
                  style={({pressed}) => [
                    {opacity: pressed ? 0.95 : 1.0},
                    [styles.tripImageConatiner],
                  ]}
                  onPress={() => {
                    setpvm(true);
                    setpd(chk == '1' ? tripPhotos[0] : '');
                    setpdc(chk == '1' ? 'tp' : 'ph');
                  }}>
                  <ProgressiveFastImage
                    style={styles.tripImg}
                    source={
                      chk == '1'
                        ? {uri: tripPhotos[0]}
                        : require('../../../assets/images/trip/img.jpeg')
                    }
                    loadingImageStyle={styles.imageLoader2}
                    loadingSource={require('../../../assets/images/imgLoad/img.jpeg')}
                    blurRadius={5}
                  />
                </Pressable>
              </>
            )}
          </>
        );
      };

      return <View style={styles.boxSection2}>{renderTripImages()}</View>;
    };

    const renderSec2c = () => {
      return (
        <View style={styles.boxSection2}>
          <Animatable.Image
            style={[styles.tripImageConatiner]}
            // style={styles.tripImg}
            duration={animtntime}
            easing="ease-out"
            animation={isActive ? 'zoomIn' : false}
            source={require('../../../assets/gif/stl.gif')}
          />
        </View>
      );
    };

    const renderSec3 = () => {
      return (
        <View style={styles.boxSection3}>
          <Animatable.Text
            style={styles.sec3T1}
            duration={animtntime}
            easing="ease-out"
            animation={isActive ? 'zoomIn' : false}>
            {titlee}
          </Animatable.Text>

          <View style={styles.sec3T2Container}>
            <Animatable.Image
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
              }}
              duration={animtntime}
              easing="ease-out"
              animation={isActive ? 'zoomIn' : false}
              source={require('../../../assets/images/location/img.png')}
            />

            <View style={{width: '95%'}}>
              <Animatable.Text
                style={styles.sec3T2}
                duration={animtntime}
                easing="ease-out"
                animation={isActive ? 'zoomIn' : false}>
                {locName}
              </Animatable.Text>
            </View>
          </View>

          <View style={{marginTop: 10}}>
            <Animatable.Text
              style={styles.sec3T31}
              duration={animtntime}
              easing="ease-out"
              animation={isActive ? 'zoomIn' : false}>
              In Return For
            </Animatable.Text>
            <Animatable.Text
              style={styles.sec3T32}
              duration={animtntime}
              easing="ease-out"
              animation={isActive ? 'zoomIn' : false}>
              {trade}
            </Animatable.Text>
          </View>
          <View style={{marginTop: 10}}>
            <Animatable.Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.sec3T31}
              duration={animtntime}
              easing="ease-out"
              animation={isActive ? 'zoomIn' : false}>
              Availability
            </Animatable.Text>
            <Animatable.Text
              style={styles.sec3T32}
              duration={animtntime}
              easing="ease-out"
              animation={isActive ? 'zoomIn' : false}>
              {favlbl}
            </Animatable.Text>
          </View>
        </View>
      );
    };

    const renderSec4 = () => {
      return (
        <View style={styles.boxSection4}>
          <Pressable
            onPress={() => {
              if (store.User.user.subscriptionStatus == 'freemium') {
                props.navigation.navigate('Plan');
              } else openModal({item: item, selIndex: index}, 'offer');
            }}
            style={({pressed}) => [
              {opacity: pressed ? 0.9 : 1.0},
              styles.sec4B,
            ]}>
            <Text style={styles.sec4T}>make offer</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              if (store.User.user.subscriptionStatus == 'freemium') {
                props.navigation.navigate('Plan');
              } else openModal({item: item, selIndex: index}, 'message');
            }}
            style={({pressed}) => [
              {opacity: pressed ? 0.9 : 1.0},
              [styles.sec4B, {backgroundColor: theme.color.button2}],
            ]}>
            <Text style={[styles.sec4T, {color: theme.color.subTitle}]}>
              message
            </Text>
          </Pressable>
        </View>
      );
    };

    return (
      <>
        {pvm && (
          <utils.FullimageModal
            data={[]}
            si={0}
            show={pvm}
            pd={pd}
            pdc={pdc}
            closModal={() => {
              setpvm(!pvm);
              setpd('');
              setpdc('');
            }}
          />
        )}
        <Animatable.View
          duration={300}
          transition="backgroundColor"
          style={{
            backgroundColor: isActive
              ? 'rgba(255,255,255,1)'
              : 'rgba(245,252,255,1)',
          }}>
          {isActive && (
            <>
              {!showpic ? renderSec2() : renderSec2c()}
              {renderSec3()}
              {renderSec4()}
            </>
          )}
        </Animatable.View>
      </>
    );
  } else {
    return null;
  }
}