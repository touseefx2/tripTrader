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

  popularSearch = ['fishing', 'hunting', 'stays', 'bear', 'deer', 'birds'];
  @action setpopularSearch = obj => {
    this.popularSearch = obj;
  };

  recentSearch = ['fishing', 'hunting', 'stays'];
  @action setrecentSearch = obj => {
    this.recentSearch = obj;
  };

  @observable Loader = false;
  @action setLoader = obj => {
    this.Loader = obj;
  };

  @action clearSearches = () => {
    this.setSearch('');
    this.setpopularSearch([]);
    this.setrecentSearch([]);
    this.setLoader(false);
  };
}
export const Search = new search();
