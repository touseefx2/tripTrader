import {observable, makeObservable, action} from 'mobx';
import {AppState, Alert} from 'react-native';
import {persist} from 'mobx-persist';
import io from 'socket.io-client';
import db from '../../database/index';

class general {
  constructor() {
    makeObservable(this);
  }

  @observable socket = io(db.apis.BASE_URLS);

  @observable Stripe_Publish_Key =
    'pk_test_51M9HIuBmhbfqULZ4IstWDtc73GFl6mVRnA4jUcOR9BVRkndz1Ou2FSlOeP4WjGgYqlH4LflMtgUY8foGkY58lHAq00OGfQUjlR';
  @observable Terms_and_Conditions_Link =
    'http://trip-trader.com.s3-website-us-east-1.amazonaws.com/termsandconditionsapp';
  @observable Privacy_and_Policy_Link =
    'http://trip-trader.com.s3-website-us-east-1.amazonaws.com/privacypolicyapp';

  @observable AppName = 'Trip Trader';
  @observable isServerError = false;
  @observable photoSelInd = 0;
  @observable Loading = true;
  @observable isInternet = false;
  @observable isLocation = false;
  @observable appState = AppState.currentState;
  @observable selectedFilter = [];
  @observable isUpdateNeeded = false;
  @observable isEmailPopup = false;

  @persist('object') @observable isGLocation = false;
  @persist('object') @observable apiLevel = '';
  @persist('object') @observable appBuildNumber = '';
  @persist('object') @observable appVersionNumber = '';
  @persist('object') @observable package = '';

  @observable isSheetOpen = false;
  @observable focusScreen = '';
  @observable goto = 'home';
  @observable settingsGoTo = '';
  @observable offerGoTo = '';

  @observable goToo = null;
  @action setgoToo = obj => {
    this.goToo = obj;
  };

  @action checkServer = err => {
    if (err.response.data == undefined && err.response.status == 0) {
      Alert.alert('Network Error', 'Server not responding');
      return;
    }
  };

  @action setphotoSelInd = obj => {
    this.photoSelInd = obj;
  };

  @action setIsEmailPopup = obj => {
    this.isEmailPopup = obj;
  };

  @action setgoto = obj => {
    this.goto = obj;
  };

  @action setSettingsGoTo = obj => {
    this.settingsGoTo = obj;
  };

  @action setOfferGoTo = obj => {
    this.offerGoTo = obj;
  };

  @action setFocusScreen = obj => {
    this.focusScreen = obj;
  };

  @action setisSheetOpen = obj => {
    this.isSheetOpen = obj;
  };

  @action setisUpdateNeeded = obj => {
    this.isUpdateNeeded = obj;
  };

  @action setselectedFilter = obj => {
    this.selectedFilter = obj;
  };

  @action setisServerError = obj => {
    this.isServerError = obj;
  };

  @action setappBuildNumber = obj => {
    this.appBuildNumber = obj;
  };

  @action setappVersionNumber = obj => {
    this.appVersionNumber = obj;
  };

  @action setpackage = obj => {
    this.package = obj;
  };

  @action setLoading = obj => {
    this.Loading = obj;
  };

  @action setInternet = obj => {
    this.isInternet = obj;
  };

  @action setLocation = obj => {
    this.isLocation = obj;
  };

  @action setGLocation = obj => {
    this.isGLocation = obj;
  };

  @action.bound
  setapiLevel(val) {
    this.apiLevel = val;
  }

  @action setappState = obj => {
    this.appState = obj;
  };

  @action setSocket = obj => {
    this.socket = obj;
  };
}
export const General = new general();
