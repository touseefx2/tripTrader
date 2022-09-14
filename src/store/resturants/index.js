import {observable, makeObservable, action} from 'mobx';
import {persist} from 'mobx-persist';
import store from '../index';
import NetInfo from '@react-native-community/netinfo';
import db from '../../database/index';
import {Alert} from 'react-native';

class resturants {
  constructor() {
    makeObservable(this);
  }

  @observable Resturants = false;
  @observable filter = [];

  @persist('object') @observable isSetLocOnce = false;

  @persist('object') @observable data = [];

  @observable dataLoader = false;

  @action setResturants = obj => {
    this.Resturants = obj;
  };

  @action setisLocOnce = obj => {
    this.isSetLocOnce = obj;
  };

  @action setdatLaoader = obj => {
    this.dataLoader = obj;
  };

  @action setData = obj => {
    this.data = obj;
  };

  @action setfilter = obj => {
    this.filter = obj;
  };

  @action.bound
  getData(loc, type) {
    this.setdatLaoader(true);

    setTimeout(() => {
      let arr = [
        {
          _id: 1,
          name: 'BroadWay Pizza',
          type: 'Pizza',
          price: '$',

          promotions: true,
          tagline: '',
          phone: '03075839836',
          tax: 20,
          estimatedDeliveryTime: 30,
          estimatedPickupTime: 40,
          slider_images: [
            'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/Chicken-Mandi-Lazzat-1655881202158.jpeg',
            'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/img1-1655881202284.jpeg',
            'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/img2-1655881202349.jpeg',
            'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/img3-1655881202562.jpeg',
            'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/istockphoto-466762504-612x612-1655881202635.jpeg',
          ],
          loc: {
            coords: {latitude: 33.62497365767188, longitude: 72.96931675031028},
            address: 'D Chowk, Islamabad',
          },
          rating: {
            average_rating: 3.5,
            total_reviews: 555,
            details: [
              {
                user_name: 'Imran ismail',
                rate: 3,
                comment: 'Taste and quantity were good',
                created_at: 'Aug 2, 2022',
              },
              {
                user_name: 'Nawaz golra',
                rate: 4,
                comment:
                  'Urna libero massa in pulvinar aliquet morbi eu, cursus pulvinar duis molestie at enim euismod vitae ipsum risus tincidunt tellus donec risus',
                created_at: 'Aug 1, 2022',
              },
              {
                user_name: 'James Bond',
                rate: 3,
                comment: '',
                created_at: 'Aug 1, 2022',
              },
              {
                user_name: 'Imran ismail',
                rate: 3,
                comment: 'Taste and quantity were good',
                created_at: 'Aug 2, 2022',
              },
              {
                user_name: 'Nawaz golra',
                rate: 4,
                comment:
                  'Urna libero massa in pulvinar aliquet morbi eu, cursus pulvinar duis molestie at enim euismod vitae ipsum risus tincidunt tellus donec risus',
                created_at: 'Aug 1, 2022',
              },
              {
                user_name: 'James Bond',
                rate: 3,
                comment: '',
                created_at: 'Aug 1, 2022',
              },
            ],
          },
          opening_times: [
            {day: 'Mon', open: '9 am', close: '4 pm'},
            {day: 'Tue', open: '9 am', close: '5 pm'},
            {day: 'Wed', open: '9 am', close: '7 pm'},
            {day: 'Thu', open: '9 am', close: '4 pm'},
            {day: 'Fri', open: '1 pm', close: '8 pm'},
            {day: 'Sat', open: '', close: ''},
            {day: 'Sun', open: '', close: ''},
          ],
          order_type: 'delivery',
          deals: '',
          image: require('../../assets/images/pizza/img.jpeg'),
          delivery_charges: 80,
          food_menu: [
            //menu list
            {
              __v: 0,
              key: '62a3264bc8cac57addb8738c',
              createdAt: '2022-06-10T11:08:59.756Z',
              isActive: true,
              title: 'Somewhat Sooper',
              data: [
                {
                  __v: 0,
                  _id: '62a8316b1fb677bbeecb1eef',
                  additional_variation: [
                    {
                      _id: '62a8316b1fb677bbeecb1ef4',
                      details: [
                        {
                          _id: '62a8316b1fb677bbeecb1ef5',
                          name: 'Chicken Small',
                          price: 40,
                        },
                        {
                          _id: '62a8316b1fb677bbeecb1ef6',
                          name: 'Cheese Small',
                          price: 40,
                        },
                        {
                          _id: '62a8316b1fb677bbeecb1ef7',
                          name: 'Chicken Regular',
                          price: 60,
                        },
                        {
                          _id: '62a8316b1fb677bbeecb1ef8',
                          name: 'Chicken Regular',
                          price: 60,
                        },
                      ],
                      isRequired: true,
                      name: 'Extra Topping',
                    },
                  ],
                  base_variation: [
                    {
                      details: [
                        {
                          _id: '62a8316b1fb677bbeecb1ef0',
                          name: 'Small',
                          price: 370,
                        },
                        {
                          _id: '62a8316b1fb677bbeecb1ef1',
                          name: 'Regular',
                          price: 850,
                        },
                        {
                          _id: '62a8316b1fb677bbeecb1ef2',
                          name: 'Large',
                          price: 1200,
                        },
                        {
                          _id: '62a8316b1fb677bbeecb1ef3',
                          name: 'Party',
                          price: 1800,
                        },
                      ],
                      isRequired: true,
                      name: 'Variation',
                    },
                  ],
                  category: '62a3264bc8cac57addb8738c',
                  createdAt: '2022-06-14T06:57:47.864Z',
                  image:
                    'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/pizze-1655189651224.jpg',
                  isActive: true,
                  noOfOrders: 1,
                  price: 370,
                  title: 'Euro',
                  description: 'Freshly pizza with fries and drink.',
                  updatedAt: '2022-06-28T12:48:03.097Z',
                },
              ],
              updatedAt: '2022-06-28T09:43:57.902Z',
            },
            {
              __v: 0,
              key: '62a325a86a9973030670f575',
              createdAt: '2022-06-10T11:06:16.646Z',
              isActive: true,
              title: 'Starters',
              data: [
                {
                  __v: 0,
                  _id: '62a348baba3524faa0017b06',
                  additional_variation: [],
                  base_variation: [
                    {
                      details: [
                        {
                          _id: '62a348baba3524faa0017b08',
                          name: '6pcs',
                          price: 280,
                        },
                        {
                          _id: '62a348baba3524faa0017b09',
                          name: '12pcs',
                          price: 520,
                        },
                      ],
                      isRequired: true,
                      name: 'Variation',
                    },
                  ],
                  category: '62a325a86a9973030670f575',
                  createdAt: '2022-06-10T13:35:54.305Z',
                  description: 'Freshly oven backed wings',
                  image:
                    'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/pizze-1655212836371.jpg',
                  isActive: true,
                  noOfOrders: 21,
                  price: 280,
                  title: 'Peri Peri Oven Backed Wings',
                  updatedAt: '2022-08-01T07:51:21.935Z',
                },
                {
                  __v: 0,
                  _id: '62a34905ba3524faa0017b0b',
                  additional_variation: [],
                  base_variation: [],
                  category: '62a325a86a9973030670f575',
                  createdAt: '2022-06-10T13:37:09.369Z',
                  description: 'Freshly backed bread filled with cheese.',
                  image:
                    'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/burger-1654868830324.jpg',
                  isActive: true,
                  noOfOrders: 75,
                  price: 400,
                  title: 'Cheese Sticks',
                  updatedAt: '2022-08-04T09:40:05.439Z',
                },
              ],
              updatedAt: '2022-06-10T11:06:16.646Z',
            },
          ],
        },
        {
          _id: 2,
          name: 'AB Cuisine',
          type: 'Fast Food',
          price: '$$',
          promotions: true,
          tagline: '',
          phone: '03009887787',
          tax: 15,
          estimatedDeliveryTime: 20,
          estimatedPickupTime: 30,
          slider_images: [
            'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/img1-1655881202284.jpeg',
            'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/img2-1655881202349.jpeg',
            'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/img3-1655881202562.jpeg',
            'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/istockphoto-466762504-612x612-1655881202635.jpeg',
          ],
          image: require('../../assets/images/burger/img.jpeg'),
          loc: {
            coords: {latitude: 33.64581985471614, longitude: 72.97007398160882},
            address: 'J Mall, Islamabad',
          },
          rating: {
            average_rating: 4.5,
            total_reviews: 455,
            details: [
              {
                user_name: 'Imran ismail',
                rate: 3,
                comment: 'Taste and quantity were good',
                created_at: 'Aug 2, 2022',
              },
              {
                user_name: 'Nawaz golra',
                rate: 4,
                comment:
                  'Urna libero massa in pulvinar aliquet morbi eu, cursus pulvinar duis molestie at enim euismod vitae ipsum risus tincidunt tellus donec risus',
                created_at: 'Aug 1, 2022',
              },
              {
                user_name: 'James Bond',
                rate: 3,
                comment: '',
                created_at: 'Aug 1, 2022',
              },
              {
                user_name: 'Imran ismail',
                rate: 3,
                comment: 'Taste and quantity were good',
                created_at: 'Aug 2, 2022',
              },
              {
                user_name: 'Nawaz golra',
                rate: 4,
                comment:
                  'Urna libero massa in pulvinar aliquet morbi eu, cursus pulvinar duis molestie at enim euismod vitae ipsum risus tincidunt tellus donec risus',
                created_at: 'Aug 1, 2022',
              },
              {
                user_name: 'James Bond',
                rate: 3,
                comment: '',
                created_at: 'Aug 1, 2022',
              },
            ],
          },
          opening_times: [
            {day: 'Mon', open: '9 am', close: '4 pm'},
            {day: 'Tue', open: '9 am', close: '5 pm'},
            {day: 'Wed', open: '9 am', close: '7 pm'},
            {day: 'Thu', open: '9 am', close: '4 pm'},
            {day: 'Fri', open: '1 pm', close: '8 pm'},
            {day: 'Sat', open: '', close: ''},
            {day: 'Sun', open: '', close: ''},
          ],
          food_menu: [
            //menu list
            {
              __v: 0,
              key: '62a3264bc8cac57addb8738c',
              createdAt: '2022-06-10T11:08:59.756Z',
              isActive: true,
              title: 'Somewhat Sooper',
              data: [
                {
                  __v: 0,
                  _id: '62a8316b1fb677bbeecb1eef',
                  additional_variation: [
                    {
                      _id: '62a8316b1fb677bbeecb1ef4',
                      details: [
                        {
                          _id: '62a8316b1fb677bbeecb1ef5',
                          name: 'Chicken Small',
                          price: 40,
                        },
                        {
                          _id: '62a8316b1fb677bbeecb1ef6',
                          name: 'Cheese Small',
                          price: 40,
                        },
                        {
                          _id: '62a8316b1fb677bbeecb1ef7',
                          name: 'Chicken Regular',
                          price: 60,
                        },
                        {
                          _id: '62a8316b1fb677bbeecb1ef8',
                          name: 'Chicken Regular',
                          price: 60,
                        },
                      ],
                      isRequired: true,
                      name: 'Extra Topping',
                    },
                  ],
                  base_variation: [
                    {
                      details: [
                        {
                          _id: '62a8316b1fb677bbeecb1ef0',
                          name: 'Small',
                          price: 370,
                        },
                        {
                          _id: '62a8316b1fb677bbeecb1ef1',
                          name: 'Regular',
                          price: 850,
                        },
                        {
                          _id: '62a8316b1fb677bbeecb1ef2',
                          name: 'Large',
                          price: 1200,
                        },
                        {
                          _id: '62a8316b1fb677bbeecb1ef3',
                          name: 'Party',
                          price: 1800,
                        },
                      ],
                      isRequired: true,
                      name: 'Variation',
                    },
                  ],
                  category: '62a3264bc8cac57addb8738c',
                  createdAt: '2022-06-14T06:57:47.864Z',
                  image:
                    'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/pizze-1655189651224.jpg',
                  isActive: true,
                  noOfOrders: 1,
                  price: 370,
                  title: 'Euro',
                  description: 'Freshly pizza with fries and drink.',
                  updatedAt: '2022-06-28T12:48:03.097Z',
                },
              ],
              updatedAt: '2022-06-28T09:43:57.902Z',
            },
            {
              __v: 0,
              key: '62a325a86a9973030670f575',
              createdAt: '2022-06-10T11:06:16.646Z',
              isActive: true,
              title: 'Starters',
              data: [
                {
                  __v: 0,
                  _id: '62a348baba3524faa0017b06',
                  additional_variation: [],
                  base_variation: [
                    {
                      details: [
                        {
                          _id: '62a348baba3524faa0017b08',
                          name: '6pcs',
                          price: 280,
                        },
                        {
                          _id: '62a348baba3524faa0017b09',
                          name: '12pcs',
                          price: 520,
                        },
                      ],
                      isRequired: true,
                      name: 'Variation',
                    },
                  ],
                  category: '62a325a86a9973030670f575',
                  createdAt: '2022-06-10T13:35:54.305Z',
                  description: 'Freshly oven backed wings',
                  image:
                    'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/pizze-1655212836371.jpg',
                  isActive: true,
                  noOfOrders: 21,
                  price: 280,
                  title: 'Peri Peri Oven Backed Wings',
                  updatedAt: '2022-08-01T07:51:21.935Z',
                },
                {
                  __v: 0,
                  _id: '62a34905ba3524faa0017b0b',
                  additional_variation: [],
                  base_variation: [],
                  category: '62a325a86a9973030670f575',
                  createdAt: '2022-06-10T13:37:09.369Z',
                  description: 'Freshly backed bread filled with cheese.',
                  image:
                    'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/burger-1654868830324.jpg',
                  isActive: true,
                  noOfOrders: 75,
                  price: 400,
                  title: 'Cheese Sticks',
                  updatedAt: '2022-08-04T09:40:05.439Z',
                },
              ],
              updatedAt: '2022-06-10T11:06:16.646Z',
            },
          ],
          order_type: 'delivery',
          deals: 'Summer deals & discounts',
          delivery_charges: 50,
        },
        {
          _id: 3,
          name: 'KFC',
          type: 'Fast Food',
          price: '$$$',
          promotions: false,
          tagline: '',
          phone: '03114343543',
          image: require('../../assets/images/kfc/img.jpeg'),
          tax: 25,
          estimatedDeliveryTime: 20,
          estimatedPickupTime: 30,
          slider_images: [
            'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/img1-1655881202284.jpeg',
            'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/img2-1655881202349.jpeg',
            'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/img3-1655881202562.jpeg',
          ],
          loc: {
            coords: {latitude: 33.69460562193796, longitude: 73.01318278125936},
            address: 'KFC F10, Islamabad',
          },
          rating: {
            average_rating: 4.7,
            total_reviews: 200,
            details: [
              {
                user_name: 'Imran ismail',
                rate: 3,
                comment: 'Taste and quantity were good',
                created_at: 'Aug 2, 2022',
              },
              {
                user_name: 'Nawaz golra',
                rate: 4,
                comment:
                  'Urna libero massa in pulvinar aliquet morbi eu, cursus pulvinar duis molestie at enim euismod vitae ipsum risus tincidunt tellus donec risus',
                created_at: 'Aug 1, 2022',
              },
              {
                user_name: 'James Bond',
                rate: 3,
                comment: '',
                created_at: 'Aug 1, 2022',
              },
              {
                user_name: 'Imran ismail',
                rate: 3,
                comment: 'Taste and quantity were good',
                created_at: 'Aug 2, 2022',
              },
              {
                user_name: 'Nawaz golra',
                rate: 4,
                comment:
                  'Urna libero massa in pulvinar aliquet morbi eu, cursus pulvinar duis molestie at enim euismod vitae ipsum risus tincidunt tellus donec risus',
                created_at: 'Aug 1, 2022',
              },
              {
                user_name: 'James Bond',
                rate: 3,
                comment: '',
                created_at: 'Aug 1, 2022',
              },
            ],
          },
          opening_times: [
            {day: 'Mon', open: '9 am', close: '4 pm'},
            {day: 'Tue', open: '9 am', close: '5 pm'},
            {day: 'Wed', open: '9 am', close: '7 pm'},
            {day: 'Thu', open: '9 am', close: '4 pm'},
            {day: 'Fri', open: '1 pm', close: '8 pm'},
            {day: 'Sat', open: '', close: ''},
            {day: 'Sun', open: '', close: ''},
          ],
          food_menu: [
            //menu list
            {
              __v: 0,
              key: '62a3264bc8cac57addb8738c',
              createdAt: '2022-06-10T11:08:59.756Z',
              isActive: true,
              title: 'Somewhat Sooper',
              data: [
                {
                  __v: 0,
                  _id: '62a8316b1fb677bbeecb1eef',
                  additional_variation: [
                    {
                      _id: '62a8316b1fb677bbeecb1ef4',
                      details: [
                        {
                          _id: '62a8316b1fb677bbeecb1ef5',
                          name: 'Chicken Small',
                          price: 40,
                        },
                        {
                          _id: '62a8316b1fb677bbeecb1ef6',
                          name: 'Cheese Small',
                          price: 40,
                        },
                        {
                          _id: '62a8316b1fb677bbeecb1ef7',
                          name: 'Chicken Regular',
                          price: 60,
                        },
                        {
                          _id: '62a8316b1fb677bbeecb1ef8',
                          name: 'Chicken Regular',
                          price: 60,
                        },
                      ],
                      isRequired: true,
                      name: 'Extra Topping',
                    },
                  ],
                  base_variation: [
                    {
                      details: [
                        {
                          _id: '62a8316b1fb677bbeecb1ef0',
                          name: 'Small',
                          price: 370,
                        },
                        {
                          _id: '62a8316b1fb677bbeecb1ef1',
                          name: 'Regular',
                          price: 850,
                        },
                        {
                          _id: '62a8316b1fb677bbeecb1ef2',
                          name: 'Large',
                          price: 1200,
                        },
                        {
                          _id: '62a8316b1fb677bbeecb1ef3',
                          name: 'Party',
                          price: 1800,
                        },
                      ],
                      isRequired: true,
                      name: 'Variation',
                    },
                  ],
                  category: '62a3264bc8cac57addb8738c',
                  createdAt: '2022-06-14T06:57:47.864Z',
                  image:
                    'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/pizze-1655189651224.jpg',
                  isActive: true,
                  noOfOrders: 1,
                  price: 370,
                  title: 'Euro',
                  description: 'Freshly pizza with fries and drink.',
                  updatedAt: '2022-06-28T12:48:03.097Z',
                },
              ],
              updatedAt: '2022-06-28T09:43:57.902Z',
            },
            {
              __v: 0,
              key: '62a325a86a9973030670f575',
              createdAt: '2022-06-10T11:06:16.646Z',
              isActive: true,
              title: 'Starters',
              data: [
                {
                  __v: 0,
                  _id: '62a348baba3524faa0017b06',
                  additional_variation: [],
                  base_variation: [
                    {
                      details: [
                        {
                          _id: '62a348baba3524faa0017b08',
                          name: '6pcs',
                          price: 280,
                        },
                        {
                          _id: '62a348baba3524faa0017b09',
                          name: '12pcs',
                          price: 520,
                        },
                      ],
                      isRequired: true,
                      name: 'Variation',
                    },
                  ],
                  category: '62a325a86a9973030670f575',
                  createdAt: '2022-06-10T13:35:54.305Z',
                  description: 'Freshly oven backed wings',
                  image:
                    'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/pizze-1655212836371.jpg',
                  isActive: true,
                  noOfOrders: 21,
                  price: 280,
                  title: 'Peri Peri Oven Backed Wings',
                  updatedAt: '2022-08-01T07:51:21.935Z',
                },
                {
                  __v: 0,
                  _id: '62a34905ba3524faa0017b0b',
                  additional_variation: [],
                  base_variation: [],
                  category: '62a325a86a9973030670f575',
                  createdAt: '2022-06-10T13:37:09.369Z',
                  description: 'Freshly backed bread filled with cheese.',
                  image:
                    'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/burger-1654868830324.jpg',
                  isActive: true,
                  noOfOrders: 75,
                  price: 400,
                  title: 'Cheese Sticks',
                  updatedAt: '2022-08-04T09:40:05.439Z',
                },
              ],
              updatedAt: '2022-06-10T11:06:16.646Z',
            },
          ],
          order_type: 'delivery',
          deals: '',
          delivery_charges: 200,
        },
        {
          _id: 4,
          name: 'Cheezious Golra Mor',
          type: 'Pizza',
          price: '$$',
          promotions: false,

          tagline: '',
          phone: '03072345678',
          image: require('../../assets/images/cheezious/img.png'),
          tax: 12,
          estimatedDeliveryTime: 25,
          estimatedPickupTime: 35,
          slider_images: [
            'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/img1-1655881202284.jpeg',
            'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/img2-1655881202349.jpeg',
          ],
          loc: {
            coords: {latitude: 33.62501062086861, longitude: 72.96990425307199},
            address: 'Cheezious Golra Mor Branch, Rawalpindi',
          },
          rating: {
            average_rating: 4.9,
            total_reviews: 2000,
            details: [
              {
                user_name: 'Imran ismail',
                rate: 3,
                comment: 'Taste and quantity were good',
                created_at: 'Aug 2, 2022',
              },
              {
                user_name: 'Nawaz golra',
                rate: 4,
                comment:
                  'Urna libero massa in pulvinar aliquet morbi eu, cursus pulvinar duis molestie at enim euismod vitae ipsum risus tincidunt tellus donec risus',
                created_at: 'Aug 1, 2022',
              },
              {
                user_name: 'James Bond',
                rate: 3,
                comment: '',
                created_at: 'Aug 1, 2022',
              },
              {
                user_name: 'Imran ismail',
                rate: 3,
                comment: 'Taste and quantity were good',
                created_at: 'Aug 2, 2022',
              },
              {
                user_name: 'Nawaz golra',
                rate: 4,
                comment:
                  'Urna libero massa in pulvinar aliquet morbi eu, cursus pulvinar duis molestie at enim euismod vitae ipsum risus tincidunt tellus donec risus',
                created_at: 'Aug 1, 2022',
              },
              {
                user_name: 'James Bond',
                rate: 3,
                comment: '',
                created_at: 'Aug 1, 2022',
              },
            ],
          },
          opening_times: [
            {day: 'Mon', open: '9 am', close: '4 pm'},
            {day: 'Tue', open: '9 am', close: '5 pm'},
            {day: 'Wed', open: '9 am', close: '7 pm'},
            {day: 'Thu', open: '9 am', close: '4 pm'},
            {day: 'Fri', open: '1 pm', close: '8 pm'},
            {day: 'Sat', open: '', close: ''},
            {day: 'Sun', open: '', close: ''},
          ],
          food_menu: [],

          order_type: 'delivery',
          deals: 'Summer deals & discounts',
          delivery_charges: 350,
        },
      ];
      this.setResturants(arr);
    }, 3500);

    // setLoader(true);
    // setTimeout(() => {
    //   setLoader(false);
    //   store.Resturants.setisLocOnce(true);
    // }, 2000);
    // db.hitApi(db.apis.GET_FOOD_CATEGORY + city._id, 'get', null, null)
    //   ?.then((resp: any) => {
    //     this.setloader(false);
    //     console.log(
    //       `response  ${db.apis.GET_FOOD_CATEGORY} : `,
    //       resp.data.data,
    //     );
    //   })
    //   .catch(err => {
    //     this.setloader(false);
    //     let msg = err.response.data.message || err.response.status;
    //     console.log(`Error in ${db.apis.GET_FOOD_CATEGORY} : `, msg);
    //     if (msg == 503 || msg == 500) {
    //       store.General.setisServerError(true);
    //       return;
    //     }
    //     if (msg == 'No records found') {
    //       this.setData([]);
    //       return;
    //     }
    //     Alert.alert('', msg.toString());
    //   });
  }
}

export const Resturants = new resturants();
