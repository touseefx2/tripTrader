import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  Image,
  Pressable,
} from 'react-native';
import theme from '../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import utils from '.';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import store from '../store/index';
import {observer} from 'mobx-react';
import NetInfo from '@react-native-community/netinfo';
import RBSheet from 'react-native-raw-bottom-sheet';

export default observer(FullimageModal);
function FullimageModal(props) {
  const show = props.show;
  const pv = props.pv;

  let data=props.data || []
  let dl=data.length;

  const [si, setsi] = useState(props.si || 0);
  const [imgLoad, setimgLoad] = useState(false);

  const closeModal = () => {
    props.setshow(false);
    props.setpv('');
    setimgLoad(false);
  };

    const nextPhoto=()=>{
setimgLoad(false);
let c=si+1
setsi(c)
   }

   const prevPhoto=()=>{
    let c=si-1
    setsi(c)
  }

  const renderLoader = () => {
        return (
          <View style={{position: 'absolute', alignSelf: 'center', top: '45%'}}>
            <ActivityIndicator size={40} color={theme.color.button1} />
          </View>
        );
      };
    
  const renderImageModal = () => {

   
    const renderCross = () => {
      return (
        <Pressable
          onPress={closeModal}
          style={({pressed}) => [
            {opacity: pressed ? 0.8 : 1},
            [styles.modalButtonContainer],
          ]}>
          <utils.vectorIcon.AntDesign
            name="close"
            color={theme.color.title}
            size={16}
          />
        </Pressable>
      );
    };

    const renderImage=()=>{

   
    
    
      return(
        <View style={styles.ImageContainer}>
        <Image
          onLoadStart={() => {
            setimgLoad(false);
          }}
          onLoad={() => {
            setimgLoad(true);
          }}
          style={styles.Image}
      
          source={{uri: pv}}
        />
          {!imgLoad && renderLoader()}
          
        </View>
      )
    }

    const renderImageArr=()=>{

      let enableClr=theme.color.background
      let disableClr="#c7c7c7"

      const renderLeft = () => {
        let c=si<1?true:false
        return (
          <Pressable
          disabled={c}
            onPress={prevPhoto}
            style={({pressed}) => [
              {opacity: pressed ? 0.8 : 1},
              [styles.changeButtonContainer,{left:-10,backgroundColor:c ?disableClr:enableClr}],
            ]}>
           <utils.vectorIcon.EvilIcons
              name="chevron-left"
              color={!c ? theme.color.title:theme.color.subTitleLight}
              size={35}
            />
          </Pressable>
        );
      };
  
      const renderRight = () => {
        let c=si==dl-1?true:false
        return (
          <Pressable
          disabled={c}
            onPress={nextPhoto}
            style={({pressed}) => [
              {opacity: pressed ? 0.8 : 1},
              [styles.changeButtonContainer,{right:-10,backgroundColor:c ?disableClr:enableClr}],
            ]}>
            <utils.vectorIcon.EvilIcons
              name="chevron-right"
              color={!c ? theme.color.title:theme.color.subTitleLight}
              size={35}
            />
          </Pressable>
        );
      };

     
    
      return(
        <View style={styles.ImageContainer}>
        <Image
          onLoadStart={() => {
            setimgLoad(false);
          }}
          onLoad={() => {
            setimgLoad(true);
          }}
          style={styles.Image}
        
           
          source={{uri: data[si]}}
        />
          {!imgLoad && renderLoader()}
          {renderLeft()}
          {renderRight()}
        </View>
      )
    }

    
    return (
      <View style={styles.modalImageContainer}>
        {dl<=0 && renderImage()}
        {dl>0 && renderImageArr()}
        {renderCross()}
      </View>
    );
  };


  return (
    <Modal
      visible={show}
      transparent
      onRequestClose={() => {
        closeModal();
      }}>
      <View style={styles.modalContainer}>
        {renderImageModal()}
       
      
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "'rgba(0,0,0,0.3)'",
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImageContainer: {
    width: '91%',
    height: '90%',
  
    alignSelf: 'center',
  },
  ImageContainer: {
    backgroundColor: "'rgba(0,0,0,0.9)'",
    width: '100%',
    height: '93%',
    borderRadius: 9,
    alignSelf: 'center',   
    alignItems:"center",
    justifyContent:"center"
  },
 
  Image: {position: 'absolute', top: 0, left: 0, bottom: 0, right: 0,
  // borderRadius: 9,
    resizeMode:"contain"
},
  modalButtonContainer: {
    backgroundColor: theme.color.background,
    borderRadius: 35 / 2,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  changeButtonContainer: {
    backgroundColor: theme.color.background,
    borderRadius: 35 / 2,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
   position:"absolute",
  
   shadowColor: "#000",
   shadowOffset: {
     width: 0,
     height: 2,
   },
   shadowOpacity: 0.25,
   shadowRadius: 3.84,
   
   elevation: 5,
    opacity:1
  },
});
