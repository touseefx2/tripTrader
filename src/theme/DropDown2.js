import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  View,
  Linking,
  TextInput,
  Image,
  StatusBar,
  PermissionsAndroid,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';

import theme from '../theme/index';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

export default function DropDown(props) {
  let isSearchBar = props.search || false;
  let c = props.c;
  let absolute = props.absolute || false;

  let Message =
    c == 'timeslots' ? 'No any time slot available' : 'No record found';

  const [data, setData] = useState(props.data);
  const [search, setsearch] = useState('');

  useEffect(() => {
    if (search != '') {
      let Search = search.toLowerCase();
      let searchLength = Search.length;

      let d = [];
      props.data.map((item, i, a) => {
        let n = c == 'trip' ? item.offer : '';
        var Name = n.toLowerCase();
        let s = Name.substr(0, searchLength);

        if (s == Search) {
          d.push(item);
        }

        if (a.length - 1 == i) {
          setData(d);
          return;
        }
      });
    } else {
      setData(props.data);
    }
  }, [search]);

  const renderSearchBar = () => {
    return (
      <View style={styles.searchBarContainer}>
        <AntDesign name="search1" color={'rgba(17, 17, 17, 0.6)'} size={20} />
        <TextInput
          placeholder="Search"
          placeholderTextColor={'gray'}
          style={[
            styles.Text,
            {
              width: '92%',
              paddingHorizontal: 5,
            },
          ]}
          onChangeText={t => {
            setsearch(t);
          }}
        />
      </View>
    );
  };

  const rendershowMessage = () => {
    return (
      <View style={styles.emptyMessageConatiner}>
        <Text style={styles.emptyText}>{Message}</Text>
      </View>
    );
  };

  const onClickItem = item => {
    props.onSelectItem(item);
    props.setVisible(false);
  };

  const renderItems = ({item, index}) => {
    let title = c == 'trip' ? item.offer : '';

    return (
      <TouchableOpacity
        onPress={() => {
          onClickItem(item);
        }}>
        <View
          style={[
            styles.rowContainer,
            {borderBottomWidth: index < data.length - 1 ? 0.7 : 0},
          ]}>
          <Text style={styles.Text}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const style =
    data.length > 5
      ? {
          height: responsiveHeight(30),
          marginTop: absolute ? 75 : 10,
          position: absolute ? 'absolute' : 'relative',
        }
      : {
          marginTop: absolute ? 75 : 10,
          position: absolute ? 'absolute' : 'relative',
        };

  return (
    <SafeAreaView style={[styles.Container, style]}>
      <KeyboardAvoidingView style={{flex: 1}} enabled>
        {isSearchBar && renderSearchBar()}
        {data.length <= 0 && rendershowMessage()}
        <FlatList
          initialNumToRender={24}
          maxToRenderPerBatch={10}
          data={data}
          nestedScrollEnabled
          renderItem={renderItems}
          keyExtractor={(item, index) => item.title}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const windowHeight = Dimensions.get('window').height;
let fontSize = 2;
let bordercolor = '#D8E1DB';
// theme.color.fieldBorder;
const styles = StyleSheet.create({
  Container: {
    width: '100%',
    borderColor: bordercolor,
    borderWidth: 1,
    alignSelf: 'center',
    borderRadius: 6,
    backgroundColor: '#E5E5E5',
    zIndex: 999,
    marginBottom: 5,
    elevation: 4,
  },
  searchBarContainer: {
    width: '100%',
    borderBottomWidth: 0.7,
    borderColor: bordercolor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  rowContainer: {
    width: '100%',
    paddingVertical: 10,
    borderColor: bordercolor,
    paddingHorizontal: 15,
  },
  Text: {
    color: 'black',
    fontSize: 13,
    fontFamily: theme.fonts.fontNormal,
    lineHeight: 19,
  },
  emptyMessageConatiner: {
    width: '100%',
    paddingVertical: 15,
    borderColor: bordercolor,
    paddingHorizontal: 15,
  },
  emptyText: {
    color: 'grey',
    fontSize: responsiveFontSize(fontSize - 0.2),
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});
