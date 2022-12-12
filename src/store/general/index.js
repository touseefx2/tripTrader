import {observable, makeObservable, action} from 'mobx';
import {AppState, Alert} from 'react-native';
import {persist} from 'mobx-persist';
import io from 'socket.io-client';
import db from '../../database/index';

class general {
  constructor() {
    makeObservable(this);
  }

  @observable socket = io(db.apis.BASE_URL);

  @observable ServerErrorTitle = 'Network Error';
  @observable ServerErrorMessage = 'Server not responding';

  @observable AppName = 'Trip Trader';
  @observable isServerError = false;
  @observable photoSelInd = 0;
  @observable Loading = true;
  @observable isInternet = false;
  @observable isLocation = false;
  @observable appState = AppState.currentState;
  @observable selectedFilter = [];
  @observable isUpdateNeeded = false;
  @persist('object') @observable isGLocation = false;
  @persist('object') @observable apiLevel = '';
  @persist('object') @observable appBuildNumber = '';
  @persist('object') @observable appVersionNumber = '';
  @persist('object') @observable package = '';

  @observable isSheetOpen = false;
  @observable focusScreen = '';
  @observable goto = 'home';

  @action checkServer = err => {
    if (err.response.data == undefined && err.response.status == 0) {
      Alert.alert(this.ServerErrorTitle, this.ServerErrorMessage);
      return;
    }
  };

  @action setphotoSelInd = obj => {
    this.photoSelInd = obj;
  };

  @action setgoto = obj => {
    this.goto = obj;
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
