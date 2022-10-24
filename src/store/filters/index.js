import {observable, makeObservable, action} from 'mobx';
import {AppState} from 'react-native';
import {persist} from 'mobx-persist';

class filters {
  constructor() {
    makeObservable(this);
  }

  @observable tripType = [
    'fishing',
    'hunting',
    'stay',
    'newly added',
    'closest distance',
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

  @observable hostRating = 0;
  @action sethostRating = obj => {
    this.hostRating = obj;
  };

  @action clearSearches = () => {
    this.settripType([]);
    this.settripLocation([]);
    this.setactivity([]);
    this.setspecies([]);
    this.hostRating(0);
  };
}
export const Filters = new filters();
