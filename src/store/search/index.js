import {observable, makeObservable, action} from 'mobx';
import {AppState} from 'react-native';
import {persist} from 'mobx-persist';

class search {
  constructor() {
    makeObservable(this);
  }

  @observable isApplySearch = false;
  @action setisApplySearch = obj => {
    this.isApplySearch = obj;
  };
  @observable search = '';
  @action setSearch = obj => {
    this.search = obj;
  };

  @observable popularSearch = [
    'Fishing',
    'Hunting',
    // 'Stays',
    // 'Bear',
    // 'Deer',
    // 'Birds',
  ];
  @action setpopularSearch = obj => {
    this.popularSearch = obj;
  };

  // @observable recentSearch = ['Fishing', 'Hunting', 'Stays'];
  @persist('object') @observable recentSearch = [];
  @action setrecentSearch = obj => {
    this.recentSearch = obj;
  };

  @observable Loader = false;
  @action setLoader = obj => {
    this.Loader = obj;
  };

  @action clearSelSearches = () => {
    this.setSearch('');

    this.setisApplySearch(false);
  };

  @action clearSearches = () => {
    this.setSearch('');
    // this.setpopularSearch([]);
    this.setrecentSearch([]);
    this.setisApplySearch(false);
  };
}
export const Search = new search();
