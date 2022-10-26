import {observable, makeObservable, action} from 'mobx';
import {AppState} from 'react-native';
import {persist} from 'mobx-persist';

class filters {
  constructor() {
    makeObservable(this);
  }

  //general

  @observable tripType = [
    {name: 'fishing', isSel: false},
    {name: 'hunting', isSel: false},
    {name: 'stay', isSel: false},
    {name: 'newly added', isSel: false},
    {name: 'closest distance', isSel: false},
  ];
  @action settripType = obj => {
    this.tripType = obj;
  };
  @observable tripLocation = [
    {name: 'islamabad', corrd: []},
    {name: 'rawalpindi', corrd: []},
    {name: 'multan', corrd: []},
  ];
  @action settripLocation = obj => {
    this.tripLocation = obj;
  };
  @observable activity = [
    {name: 'islamabad', corrd: []},
    {name: 'rawalpindi', corrd: []},
    {name: 'multan', corrd: []},
  ];
  @action setactivity = obj => {
    this.activity = obj;
  };
  @observable species = [
    {name: 'islamabad', corrd: []},
    {name: 'rawalpindi', corrd: []},
    {name: 'multan', corrd: []},
  ];
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
    this.setisFilter(false);
  };

  @action clearAllFilters = () => {
    this.settripType([
      {name: 'fishing', isSel: false},
      {name: 'hunting', isSel: false},
      {name: 'stay', isSel: false},
      {name: 'newly added', isSel: false},
      {name: 'closest distance', isSel: false},
    ]);
    // this.settripType([]);
    // this.settripLocation([]);
    // this.setactivity([]);
    // this.setspecies([]);
    this.clearFilters();
  };
}
export const Filters = new filters();
