import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
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
import Toast from 'react-native-easy-toast';

export default observer(Favourite);
function Favourite(props) {
  // const data = props.route.params.food;

  const toast = useRef(null);
  const toastduration = 700;

  let internet = store.General.isInternet;
  let favrts = store.User.fvrtList;
  let food = store.Food.food;

  const [data, setdata] = useState(false);

  useEffect(() => {
    if (internet) {
      store.User.attemptToGetFavtList();
    }
  }, [internet]);

  useEffect(() => {
    setTimeout(() => {
      let arr = [];
      if (favrts.length > 0) {
        favrts.map((e, i, a) => {
          if (food.length > 0) {
            food.map((d, i, a) => {
              let p = d.products;

              if (p.length > 0) {
                p.map((c, i, a) => {
                  if (c._id == e._id) {
                    arr.push(e);
                  }
                });
              }
            });
          }
        });
      }
      setdata(arr);
    }, 50);
  }, [favrts]);

  const goBack = () => {
    props.navigation.goBack();
  };

  const renderShowList = () => {
    const dd = data.map((e, i, a) => {
      let d = e;

      return (
        <utils.FoodCard
          data={d}
          nav={props.navigation}
          call="fav"
          toast={toast}
        />
      );
    });
    return dd;
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.htitle}>Favourites</Text>
      </View>

      {data.length <= 0 && (
        <View style={styles.emptySECTION}>
          <Image
            style={styles.emptyImg}
            source={require('../../assets/images/empty/img.png')}
          />
          <Text style={styles.emptyText}>Sorry!</Text>
          <Text style={[styles.emptyText, {marginTop: -5}]}>
            It looks like you didn't make any product as favourite
          </Text>
        </View>
      )}

      {data.length > 0 && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingHorizontal: 15, paddingVertical: 15}}>
            {renderShowList()}
          </View>
        </ScrollView>
      )}
      <Toast ref={toast} position="bottom" />
    </SafeAreaView>
  );
}
