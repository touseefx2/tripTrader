import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import theme from '../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import utils from '.';
import store from '../store/index';
import {observer} from 'mobx-react';
import Modal from 'react-native-modal';
import Toast from 'react-native-easy-toast';

export default observer(TagLineModal);
function TagLineModal(props) {
  const setIsShow = c => {
    props.setisTaglineShow(c);
  };
  let isShow = props.isTaglineShow;
  let title = props.title;

  return (
    <>
      <Modal
        style={{padding: 0, margin: 0}}
        backdropOpacity={0.4}
        onRequestClose={() => {
          setIsShow(false);
        }}
        isVisible={isShow}>
        <View style={styles.modalCont}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setIsShow(false);
            }}
            style={{
              width: 20,
              height: 20,
              marginHorizontal: 15,
              borderRadius: 20 / 2,
              backgroundColor: theme.color.background,
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 10,
              marginBottom: 10,
            }}>
            <utils.vectorIcon.Entypo name="cross" color={'red'} size={16} />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: 15}}>
            <Text
              style={{
                color: theme.color.buttonText,
                fontSize: 16,
                fontFamily: theme.fonts.fontBold,
                lineHeight: 20,
              }}>
              {title}
            </Text>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalCont: {
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: theme.color.button1,
    width: responsiveWidth(85),
    height: responsiveHeight(40),
    alignSelf: 'center',
  },
});
