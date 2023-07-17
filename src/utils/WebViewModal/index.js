import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {styles} from './styles';
import theme from '../../theme';
import Modal from 'react-native-modal';
import {WebView} from 'react-native-webview';

export default function WebViewModal({link, isVisible, setisVisible}) {
  const [isLoad, setIsLoad] = useState(false);
  const closeModal = () => {
    setisVisible(false);
    setIsLoad(false);
  };

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      animationInTiming={1000}
      backdropTransitionInTiming={1000}
      animationOutTiming={500}
      style={{margin: 0, padding: 0}}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={700}
      onRequestClose={closeModal}>
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: isLoad ? '#f5f5f5' : 'white'},
        ]}>
        <WebView
          source={{
            uri: link,
          }}
          javaScriptEnabled={true}
          onLoad={() => {
            setIsLoad(true);
          }}
          domStorageEnabled={true}
          startInLoadingState={false}
          scalesPageToFit={true}
        />

        {!isLoad && (
          <View style={styles.loaderwebview}>
            <ActivityIndicator color={theme.color.button1} size={40} />
          </View>
        )}

        <View style={styles.BottomButtonWebViewContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={closeModal}
            style={styles.BottomButtonwebview}>
            <Text style={styles.buttonTextBottomwebview}>Close</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
