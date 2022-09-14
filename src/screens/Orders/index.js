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

export default observer(Orders);
function Orders(props) {
  // const data = props.route.params.food;

  let internet = store.General.isInternet;
  let orders = store.Orders.orders;
  let loader = store.Orders.loader;
  const [data, setdata] = useState(false);

  useEffect(() => {
    if (internet) {
      store.Orders.getOrderById();
    }
  }, [internet]);

  useEffect(() => {
    if (orders.length > 0) {
      let o = [];
      orders.map((e, i, a) => {
        const d = {...e};

        let pp = [];
        let p = e.products;
        if (p.length > 0) {
          p.map((d, i, a) => {
            let avblbl = d.notAvailable || false;
            if (!avblbl) {
              pp.push(d);
            }
          });
        }

        delete d.products;
        d.products = pp;
        o.push(d);
      });

      setdata(o);
    } else {
      setdata([]);
    }
  }, [orders]);

  const goBack = () => {
    props.navigation.goBack();
  };

  const formateDateTime = d => {
    var tt = moment(d).format('hh:mm a');
    var dd = moment(d).format('DD-MM-Y');
    return dd + ', ' + tt;
  };

  // const renderShowOrder = () => {
  //   const dd = data.map((e, i, a) => {
  //     let oid = e.orderId || '';
  //     let item = '';
  //     let createdAt = e.createdAt;

  //     if (e.products?.length > 0) {
  //       e.products.map((ee, i, a) => {
  //         item = item + ee.productName + ', ';
  //       });
  //       item = item.replace(/,\s*$/, '');
  //     }

  //     let dType = e.deliveryType || '';

  //     let totalll = parseFloat(e.finalBill) || 0;

  //     return (
  //       <TouchableOpacity
  //         activeOpacity={0.6}
  //         onPress={() => props.navigation.navigate('OrdersDetails', {data: e})}
  //         style={{
  //           width: '100%',
  //           backgroundColor: theme.color.background,
  //           elevation: 5,
  //           marginTop: 10,
  //           marginBottom: i == a.length - 1 ? 10 : 0,
  //           padding: 10,
  //           borderRadius: 7,
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //           justifyContent: 'space-between',
  //         }}>
  //         <View style={{width: '88%'}}>
  //           <View
  //             style={{
  //               flexDirection: 'row',
  //               alignItems: 'center',
  //               justifyContent: 'space-between',
  //             }}>
  //             <View style={{width: '20%'}}>
  //               <Text
  //                 style={styles.title}
  //                 numberOfLines={1}
  //                 ellipsizeMode="tail">
  //                 Order #{' '}
  //               </Text>
  //             </View>
  //             <View style={{width: '79%'}}>
  //               <Text
  //                 style={[styles.title2, {textTransform: 'uppercase'}]}
  //                 numberOfLines={1}
  //                 ellipsizeMode="tail">
  //                 {oid}
  //               </Text>
  //             </View>
  //           </View>

  //           <View
  //             style={{
  //               flexDirection: 'row',
  //               alignItems: 'center',
  //               justifyContent: 'space-between',
  //             }}>
  //             <View style={{width: '20%'}}>
  //               <Text
  //                 style={styles.title}
  //                 numberOfLines={1}
  //                 ellipsizeMode="tail">
  //                 Items:
  //               </Text>
  //             </View>
  //             <View style={{width: '79%'}}>
  //               <Text
  //                 style={styles.title2}
  //                 numberOfLines={1}
  //                 ellipsizeMode="tail">
  //                 {item}
  //               </Text>
  //             </View>
  //           </View>

  //           <View
  //             style={{
  //               flexDirection: 'row',
  //               alignItems: 'center',
  //               justifyContent: 'space-between',
  //             }}>
  //             <View style={{width: '20%'}}>
  //               <Text
  //                 style={styles.title}
  //                 numberOfLines={1}
  //                 ellipsizeMode="tail">
  //                 Total:
  //               </Text>
  //             </View>
  //             <View style={{width: '79%'}}>
  //               <Text
  //                 style={styles.title2}
  //                 numberOfLines={1}
  //                 ellipsizeMode="tail">
  //                 Rs. {totalll.toFixed()}
  //               </Text>
  //             </View>
  //           </View>

  //           <View
  //             style={{
  //               flexDirection: 'row',
  //               alignItems: 'center',
  //               justifyContent: 'space-between',
  //             }}>
  //             <View style={{width: '20%'}}>
  //               <Text
  //                 style={styles.title}
  //                 numberOfLines={1}
  //                 ellipsizeMode="tail">
  //                 Date:
  //               </Text>
  //             </View>
  //             <View style={{width: '79%'}}>
  //               <Text
  //                 style={styles.title2}
  //                 numberOfLines={1}
  //                 ellipsizeMode="tail">
  //                 {formateDateTime(createdAt)}
  //               </Text>
  //             </View>
  //           </View>
  //         </View>
  //         <View style={{width: '10%', alignItems: 'flex-end'}}>
  //           <utils.vectorIcon.AntDesign
  //             name="right"
  //             color={theme.color.subTitle}
  //             size={22}
  //           />
  //         </View>
  //       </TouchableOpacity>
  //     );
  //   });

  //   return dd;
  // };

  const renderShowOrder = ({item, index}) => {
    const e = item;
    const i = index;
    const a = data.length;

    let oid = e.orderId || '';
    let itemm = '';
    let createdAt = e.createdAt;

    if (e.products?.length > 0) {
      e.products.map((ee, i, a) => {
        itemm = itemm + ee.productName + ', ';
      });
      itemm = itemm.replace(/,\s*$/, '');
    }

    let totalll = parseFloat(e.finalBill) || 0;

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => props.navigation.navigate('OrdersDetails', {data: e})}
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
                Order #{' '}
              </Text>
            </View>
            <View style={{width: '79%'}}>
              <Text
                style={[styles.title2, {textTransform: 'uppercase'}]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {oid}
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
                Items:
              </Text>
            </View>
            <View style={{width: '79%'}}>
              <Text
                style={styles.title2}
                numberOfLines={1}
                ellipsizeMode="tail">
                {itemm}
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
                Total:
              </Text>
            </View>
            <View style={{width: '79%'}}>
              <Text
                style={styles.title2}
                numberOfLines={1}
                ellipsizeMode="tail">
                Rs. {totalll.toFixed()}
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
                Date:
              </Text>
            </View>
            <View style={{width: '79%'}}>
              <Text
                style={styles.title2}
                numberOfLines={1}
                ellipsizeMode="tail">
                {formateDateTime(createdAt)}
              </Text>
            </View>
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
        <Text style={styles.htitle}>My Orders</Text>
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
            Currently no orders are available here
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
