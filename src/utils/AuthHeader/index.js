import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';

export default observer(AuthHeader);
function AuthHeader(props) {
  let prop = props.props;
  let screen = props.screen || '';

  const goBack = () => {
    if (screen == 'signup' || screen == 'plan') {
      props.goBack();
      return;
    }
    prop.navigation.goBack();
  };

  const renderLogo = () => {
    return (
      <View style={styles.section1}>
        <Image
          style={styles.logo}
          source={require('../../assets/images/logo/img.png')}
        />
        <Text style={styles.title1}>{store.General.AppName}</Text>
      </View>
    );
  };

  const renderBack = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={goBack}
        style={{position: 'absolute', left: 20}}>
        <utils.vectorIcon.Ionicons
          name={'chevron-back-outline'}
          color={theme.color.buttonText}
          size={25}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.Header}>
      {renderLogo()}
      {renderBack()}
    </View>
  );
}
