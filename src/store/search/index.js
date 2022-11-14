import {observable, makeObservable, action} from 'mobx';
import {AppState} from 'react-native';
import {persist} from 'mobx-persist';

class search {
  constructor() {
    makeObservable(this);
  }

  @observable search = '';
  @action setSearch = obj => {
    this.search = obj;
  };

  popularSearch = ['Fishing', 'Hunting', 'Stays', 'Bear', 'Deer', 'Birds'];
  @action setpopularSearch = obj => {
    this.popularSearch = obj;
  };

  recentSearch = ['Fishing', 'Hunting', 'Stays'];
  @action setrecentSearch = obj => {
    this.recentSearch = obj;
  };

  @observable Loader = false;
  @action setLoader = obj => {
    this.Loader = obj;
  };

  @action clearSearches = () => {
    this.setSearch('');
    // this.setpopularSearch([]);
    // this.setrecentSearch([]);
  };
}
export const Search = new search();
