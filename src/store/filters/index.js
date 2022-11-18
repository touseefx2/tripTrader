import {observable, makeObservable, action} from 'mobx';
import {AppState} from 'react-native';
import {persist} from 'mobx-persist';

class filters {
  constructor() {
    makeObservable(this);
  }

  //general

  @observable tripType = [
    {name: 'Most Recent', isSel: false},
    {name: 'Highest Rated', isSel: false},
    {name: 'Hunting', isSel: false},
    {name: 'Fishing', isSel: false},
  ];
  @action settripType = obj => {
    this.tripType = obj;
  };
  @persist('object') @observable tripLocation = [];
  @action settripLocation = obj => {
    this.tripLocation = obj;
  };
  @persist('object') @observable activity = [];
  @action setactivity = obj => {
    this.activity = obj;
  };
  @persist('object') @observable species = [];

  @action setspecies = obj => {
    this.species = obj;
  };

  //selected
  @observable stripType = false;
  @action setstripType = obj => {
    this.stripType = obj;
  };
  @observable stripLocation = false;
  @action setstripLocation = obj => {
    this.stripLocation = obj;
  };
  @observable sactivity = false;
  @action setsactivity = obj => {
    this.sactivity = obj;
  };
  @observable sspecies = false;
  @action setsspecies = obj => {
    this.sspecies = obj;
  };
  @observable shostRating = 0;
  @action setshostRating = obj => {
    this.shostRating = obj;
  };
  @observable svu = false;
  @action setsvu = obj => {
    this.svu = obj;
  };

  @observable isFilter = false;
  @action setisFilter = obj => {
    this.isFilter = obj;
  };

  @action clearFilters = () => {
    this.setstripType(false);
    this.setstripLocation(false);
    this.setsactivity(false);
    this.setsspecies(false);
    this.setshostRating(0);
    this.setsvu(false);
    this.setisFilter(false);
  };

  @action clearAllFilters = () => {
    this.settripType([
      {name: 'Most Recent', isSel: false},
      {name: 'Highest Rated', isSel: false},
      {name: 'Hunting', isSel: false},
      {name: 'Fishing', isSel: false},
    ]);

    this.settripLocation([]);
    this.setactivity([]);
    this.setspecies([]);

    this.clearFilters();
  };
}
export const Filters = new filters();
