import React from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import data from './Countries';
import theme from '../../../src/theme';
import { color } from 'react-native-reanimated';

export default class IntlPhoneInput extends React.Component {
  constructor(props) {
    super(props);
    const defaultCountry = data.filter((obj) => obj.code === props.defaultCountry)[0] || data.filter((obj) => obj.code === 'TR')[0];
    this.state = {
      defaultCountry,
      flag: defaultCountry.flag,
      modalVisible: false,
      dialCode: defaultCountry.dialCode,
      phoneNumber: props.phone  || '',
      mask: props.mask || defaultCountry.mask,
      countryData: data,
      selectedCountry:defaultCountry,
      regExp: defaultCountry.regExp || "",
      placeholderTextColor: 'grey',
      clearPhone:props.clearPhone
    };
  }


  onChangePropText=(unmaskedPhoneNumber, phoneNumber) => {
    const { dialCode, mask, selectedCountry,regExp } = this.state;
    const countOfNumber = mask.match(/9/g).length;
    if (this.props.onChangeText) {
      let isVerified = countOfNumber === unmaskedPhoneNumber?.length && phoneNumber?.length > 0;
     
      if(isVerified && regExp!==""){
        isVerified = regExp.test(unmaskedPhoneNumber)
        console.log("isVerified : ",isVerified)
      }
     
      this.props.onChangeText({
        dialCode, unmaskedPhoneNumber, phoneNumber, isVerified,selectedCountry
      });
    }
  }

  onChangeText = (value) => {
    let unmaskedPhoneNumber = (value.match(/\d+/g) || []).join('');

    if (unmaskedPhoneNumber.length === 0) {
      this.setState({ phoneNumber: '' });
      this.onChangePropText('', '');
      return;
    }


    let phoneNumber = this.state.mask.replace(/9/g, '_');
    for (let index = 0; index < unmaskedPhoneNumber.length; index += 1) {
      phoneNumber = phoneNumber.replace('_', unmaskedPhoneNumber[index]);
    }
    let numberPointer = 0;
    for (let index = phoneNumber.length; index > 0; index -= 1) {
      if (phoneNumber[index] !== ' ' && !isNaN(phoneNumber[index])) {
        numberPointer = index;
        break;
      }
    }
    phoneNumber = phoneNumber.slice(0, numberPointer + 1);
    unmaskedPhoneNumber = (phoneNumber.match(/\d+/g) || []).join('');

    this.onChangePropText(unmaskedPhoneNumber, phoneNumber);
    this.setState({ phoneNumber });
  }


  showModal = async  () => {
    this.props.disableCountryChange ? null : this.setState({ modalVisible: true });
  const countryData = await data; this.setState({ countryData })
};

  hideModal = () => this.setState({ modalVisible: false });

  onCountryChange = async (code) => {
    const countryData = await data;
    try {
      const country = await countryData.filter((obj) => obj.code === code)[0];
      this.setState({
        dialCode: country.dialCode,
        flag: country.flag,
        mask: this.props.mask || country.mask,
        phoneNumber: '',
        selectedCountry:country,
        regExp: country.regExp || ""
      });
      this.hideModal();
      this.state.clearPhone()

    } catch (err) {
      const defaultCountry = this.state.defaultCountry;
      this.setState({
        dialCode: defaultCountry.dialCode,
        flag: defaultCountry.flag,
        mask: this.props.mask || defaultCountry.mask,
        phoneNumber: '',
        selectedCountry:defaultCountry
      });
    }
  }

  AutoCapitalize=(v)=>{
    const str = v;

     
    const arr = str.split(" ");
    
    
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    
    }
    
    
     return arr.join(" ");
    
    
  }

  filterCountries = (v) => {
    let value =  this.AutoCapitalize(v)
   const { lang
  } = this.props;
    const countryData = data.filter((obj) => (
     obj[lang?.toLowerCase()??"en"]?.indexOf(value) > -1 || obj.dialCode.indexOf(value) > -1)      
      );
    this.setState({ countryData });
  }

  focus() {
    this.props.inputRef.current.focus();
  }

  renderModal=() => {
    if (this.props.customModal) return this.props.customModal(this.state.modalVisible,this.state.countryData,this.onCountryChange);
    const {
      countryModalStyle,
      modalContainer,
      modalFlagStyle,
      filterInputStyle,
      modalCountryItemCountryNameStyle,
      modalCountryItemCountryDialCodeStyle,
      closeText,
      filterText,
      searchIconStyle,
      closeButtonStyle,
      lang,
      placeholderTextColor
    } = this.props;
    return (
      <Modal animationType="slide"  onRequestClose={this.hideModal} transparent={false} visible={this.state.modalVisible}>
        <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.modalContainer, modalContainer]}>
          <View style={styles.filterInputStyleContainer}>
            <TextInput autoCapitalize = 'words'  autoFocus   onChangeText={this.filterCountries} placeholder={filterText || 'Filter'} style={[styles.filterInputStyle, filterInputStyle]} placeholderTextColor={placeholderTextColor }/>
            <Text style={[styles.searchIconStyle, searchIconStyle]}>🔍</Text>
          </View>
          <FlatList
            style={{ flex: 1 }}
            data={this.state.countryData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={
          ({ item }) => (
            <TouchableWithoutFeedback onPress={() => this.onCountryChange(item.code)}>
              <View style={[styles.countryModalStyle, countryModalStyle]}>
                <Text style={[styles.modalFlagStyle, modalFlagStyle]}>{item.flag}</Text>
                <View style={styles.modalCountryItemContainer}>
                  <Text style={[styles.modalCountryItemCountryNameStyle, modalCountryItemCountryNameStyle]}>{item[lang?.toLowerCase()??"en"]}</Text>
                  <Text style={[styles.modalCountryItemCountryDialCodeStyle, modalCountryItemCountryDialCodeStyle]}>{`  ${item.dialCode}`}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )
        }
          />
        </View>
        <TouchableOpacity onPress={() => this.hideModal()} style={[styles.closeButtonStyle, closeButtonStyle]}>
          <Text style={styles.closeTextStyle}>{closeText || 'CLOSE'}</Text>
        </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    );
  }

renderAction=()=>{
  const renderAction=this.props.renderAction;
  if(renderAction) {
    console.log("action",renderAction);
    if(typeof renderAction!=="function") throw ("The renderAction is not a function. Please set a renderAction function on there");
    else return this.props.renderAction();
  }
  return null;
}

  render() {

    console.warn("phone num : ",  this.state.phoneNumber)

    const { flag } = this.state;
    const {
      containerStyle,
      flagStyle,
      phoneInputStyle,
      dialCodeTextStyle,
      inputProps,
      placeholderTextColor
    } = this.props;
    return (
      <View style={{ ...styles.container, ...containerStyle }}>
        <TouchableOpacity onPress={() => this.showModal()}>
          <View style={styles.openDialogView}>
            <Text style={[styles.flagStyle, flagStyle]}>{flag}</Text>
            <Text style={[styles.dialCodeTextStyle, dialCodeTextStyle]}>{this.state.dialCode}</Text>
          </View>
        </TouchableOpacity>
        {this.renderModal()}
        <TextInput
          {...inputProps}
          style={[styles.phoneInputStyle, phoneInputStyle]}
          placeholder={this.props.placeholder || this.state.mask.replace(/9/g, '_')}
          autoCorrect={false}
          keyboardType="number-pad"
          secureTextEntry={false}
          value={this.state.phoneNumber}
          onChangeText={this.onChangeText}
          placeholderTextColor={placeholderTextColor}
        />
        {this.renderAction()}

      </View>


    );
  }
}

IntlPhoneInput.propTypes = {
  lang: PropTypes.string,
  defaultCountry: PropTypes.string,
  mask: PropTypes.string,
  onChangeText: PropTypes.func,
  customModal: PropTypes.func,
  phoneInputStyle: PropTypes.object, // {}
  containerStyle: PropTypes.object, // {}
  dialCodeTextStyle: PropTypes.object, // {}
  flagStyle: PropTypes.object, // {}
  modalContainer: PropTypes.object, // {}
  filterInputStyle: PropTypes.object, // {}
  closeButtonStyle: PropTypes.object, // {}
  modalCountryItemCountryNameStyle: PropTypes.object, // {}
  filterText: PropTypes.string,
  closeText: PropTypes.string,
  searchIconStyle: PropTypes.object,
  disableCountryChange: PropTypes.bool,
  inputRef: PropTypes.object,
  placeholderTextColor: PropTypes.string
};

const styles = StyleSheet.create({
  closeTextStyle: {
    padding: 5,
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold'
  },
  modalCountryItemCountryDialCodeStyle: {
    fontSize: 15,
    color:"black"
  },
  modalCountryItemCountryNameStyle: {
    flex: 1,
    fontSize: 15,
    color:"black"
  },
  modalCountryItemContainer: {
    flex: 1,
    paddingLeft: 5,
    flexDirection: 'row'
  },
  modalFlagStyle: {
    fontSize: 25,
  },
  modalContainer: {
    paddingTop: 15,
    paddingLeft: 25,
    paddingRight: 25,
    flex: 10,
    backgroundColor: 'white'
  },
  flagStyle: {
    fontSize: 20,
    bottom:Platform.OS=="android"?2:0
    
  },
  dialCodeTextStyle: {
    marginLeft:5,
    color:"black",
    fontSize:14,
    
    fontFamily:theme.fonts.fontNormal
  },
  countryModalStyle: {
    flex: 1,
    borderColor: 'black',
    borderTopWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  openDialogView: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  filterInputStyle: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    color: '#424242',
  },
  searchIcon: {
    padding: 10,
  },
  filterInputStyleContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneInputStyle: {
    marginLeft: 5,
    flex: 1,
    fontSize:14,
    top:Platform.OS=="android"?1: 0,
    color:"black",
    fontFamily:theme.fonts.fontNormal
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:theme.color.background,
    height:45
  },
  searchIconStyle: {
    color: 'black',
    fontSize: 15,
    marginLeft: 15
  },
  buttonStyle: {
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  countryStyle: {
    flex: 1,
    borderColor: 'black',
    borderTopWidth: 1,
    padding: 12,
  },
  closeButtonStyle: {
    padding: 12,
    alignItems: 'center',
  }
});
