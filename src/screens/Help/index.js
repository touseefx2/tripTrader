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

export default observer(Help);
function Help(props) {
  // const data = props.route.params.food;
  let image = require('../../assets/images/logo/img.png');
  let title = 'Food Panda';
  let email = 'panda@gmail.com';
  let phone = '03076565665';

  const goBack = () => {
    props.navigation.goBack();
  };

  const onPressEmail = () => {
    Linking.openURL(`mailto:${email}`);
  };

  const onPressPhone = () => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.back}>
          <TouchableOpacity activeOpacity={0.4} onPress={goBack}>
            <utils.vectorIcon.Ionicons
              name="chevron-back"
              color={theme.color.button1}
              size={26}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.htitle}>Contact us</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section1}>
          <Image style={styles.logo} source={image} />
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.title2}>Support Center</Text>

          <Text style={styles.title3}>For queries, please contact us at:</Text>

          <TouchableOpacity activeOpacity={0.7} onPress={onPressEmail}>
            <Text style={styles.title4}>{email}</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={onPressPhone}>
            <Text style={styles.title5}>{phone}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
