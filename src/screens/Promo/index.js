import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  FlatList,
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

export default observer(Promo);
function Promo(props) {
  // const data = props.route.params.food;

  let internet = store.General.isInternet;
  let promos = store.Promos.promos;
  let loader = store.Promos.loader;
  const [data, setdata] = useState(false);
  const [isEmpty, setisEmpty] = useState(false);

  useEffect(() => {
    if (internet) {
      store.Promos.getPromoById();
    }
  }, [internet]);

  function filterByValue(array) {
    return array.filter(o => o.stat == 'active' || o.stat == 'expire');
  }

  useEffect(() => {
    if (promos.length > 0) {
      let ar = [];

      promos.map((e, i, a) => {
        let sD = e.startDate || '';
        let eD = e.expiryDate || '';

        let status = '';
        if (sD != '' && eD != '') {
          let sd1 = new Date(sD);
          let sd2 = new Date(eD);

          let cd = new Date();

          if (cd < sd1) {
            status = 'pending';
          } else if (cd > sd1 && cd > sd2) {
            status = 'expire';
          } else if (cd >= sd1 && cd <= sd2) {
            status = 'active';
          }
        }
        const d = {...e};
        d.stat = status;
        ar.push(d);
      });

      if (ar.length > 0) {
        const arrra = filterByValue(ar);

        if (arrra.length > 0) {
          const sortedArray = [
            ...arrra.filter(({stat}) => stat == 'active'),
            ...arrra.filter(({stat}) => stat == 'pending'),
            ...arrra.filter(({stat}) => stat == 'expire'),
          ];

          setdata(sortedArray);
        } else {
          setdata([]);
        }
      }
    } else {
      setdata([]);
    }
  }, [promos]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (data.length > 0) {
        const dt = data.slice();

        dt.map((e, i, a) => {
          let sD = e.startDate || '';
          let eD = e.expiryDate || '';

          let status = '';
          if (sD != '' && eD != '') {
            let sd1 = new Date(sD);
            let sd2 = new Date(eD);

            let cd = new Date();
            if (cd < sd1) {
              status = 'pending';
            } else if (cd > sd1 && cd > sd2) {
              status = 'expire';
            } else if (cd >= sd1 && cd <= sd2) {
              status = 'active';
            }
          }

          e.stat = status;
        });

        if (dt.length > 0) {
          const arrra = filterByValue(dt);

          if (arrra.length > 0) {
            const sortedArray = [
              ...arrra.filter(({stat}) => stat == 'active'),
              ...arrra.filter(({stat}) => stat == 'pending'),
              ...arrra.filter(({stat}) => stat == 'expire'),
            ];

            setdata(sortedArray);
          } else {
            setdata([]);
          }
        }
      }
    }, 55000);
    // 55000
    return () => clearInterval(intervalId);
  }, [data]);

  const goBack = () => {
    props.navigation.goBack();
  };

  const formateDateTime = d => {
    let date = new Date(d);
    var tt = moment(date).format('hh:mm a');
    var dd = moment(date).format('D MMM Y');
    return dd;
  };

  const renderShowOrder = ({item, index}) => {
    const e = item;
    const i = index;
    const a = data.length;

    let name = e.name || '';
    let code = e._id;
    let discount = e.percentage || 0;

    let sD = e.startDate || '';
    let eD = e.expiryDate || '';

    let status = e.stat;

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        disabled={status == 'expire' ? true : false}
        onPress={() => props.navigation.navigate('PromoDetails', {data: e})}
        style={{
          width: '100%',
          backgroundColor: theme.color.background,
          elevation: 3,
          marginTop: i <= 0 ? 0 : 10,

          padding: 10,
          borderRadius: 7,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{width: '88%'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '20%'}}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                Name:
              </Text>
            </View>
            <View style={{width: '79%'}}>
              <Text
                style={[styles.title2, {textTransform: 'uppercase'}]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {name}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '20%'}}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                Code:
              </Text>
            </View>
            <View style={{width: '79%'}}>
              <Text
                style={[styles.title2, {textTransform: 'capitalize'}]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {code}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '20%'}}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                Discount:
              </Text>
            </View>
            <View style={{width: '79%'}}>
              <Text
                style={styles.title2}
                numberOfLines={1}
                ellipsizeMode="tail">
                {discount}%
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '20%'}}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                Status:
              </Text>
            </View>
            <View style={{width: '79%'}}>
              <Text
                style={[
                  styles.title2,
                  {
                    color:
                      status == 'active'
                        ? 'green'
                        : status == 'pending'
                        ? theme.color.button1
                        : 'red',
                    fontWeight: theme.fonts.fontBold,
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {status == 'expire' ? 'expired' : status}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '70%'}}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {formateDateTime(sD)}
              </Text>
            </View>
            <View style={{width: '20%'}}></View>
          </View>
        </View>
        <View style={{width: '10%', alignItems: 'flex-end'}}>
          <utils.vectorIcon.AntDesign
            name="right"
            color={theme.color.subTitle}
            size={22}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!internet && <utils.InternetMessage />}
      <View style={styles.header}>
        <View style={styles.back}>
          <TouchableOpacity activeOpacity={0.6} onPress={goBack}>
            <utils.vectorIcon.Ionicons
              name="chevron-back"
              color={theme.color.title}
              size={26}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.htitle}>Promos</Text>
      </View>

      {loader && (
        <ActivityIndicator
          size={40}
          color={theme.color.button1}
          style={{position: 'absolute', top: '45%', alignSelf: 'center'}}
        />
      )}

      {!loader && data.length <= 0 && (
        <View style={styles.emptySECTION}>
          <Image
            style={styles.emptyImg}
            source={require('../../assets/images/empty/img.png')}
          />
          <Text style={styles.emptyText}>Sorry!</Text>
          <Text style={[styles.emptyText, {marginTop: -5}]}>
            Currently no promo are available here
          </Text>
        </View>
      )}

      {!loader && data.length > 0 && (
        <FlatList
          contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 10}}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={renderShowOrder}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          removeClippedSubviews={true}
        />
      )}
    </SafeAreaView>
  );
}
