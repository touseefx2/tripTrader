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
  TouchableHighlight,
  FlatList,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import theme from '../index';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {styles} from './styles';

export default function DropDown(props) {
  let isSearchBar = props.search || false;
  let c = props.c;
  let absolute = props.absolute || false;

  let Message = 'No record found';

  const [modalHeight, setmodalHeight] = useState(0);
  let maxModalHeight = 247;

  const [data, setData] = useState(props.data);

  const [search, setsearch] = useState('');

  useEffect(() => {
    if (search != '') {
      let Search = search.toLowerCase();
      let searchLength = Search.length;

      let d = [];
      props.data.map((item, i, a) => {
        let n =
          c == 'loc' ||
          c == 'actvty' ||
          c == 'spcs' ||
          c == 'tt' ||
          c == 'state'
            ? item.name
            : c == 'topic'
            ? item.title
            : c == 'dur' || c == 'rdur'
            ? item.title
            : '';
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

  useEffect(() => {
    return () => {
      setmodalHeight(0);
    };
  }, []);

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
    setmodalHeight(0);
  };

  // const renderBottom = () => {
  //   return (
  //     <TouchableHighlight
  //       underlayColor={'#EEF6EF'}
  //       onPress={() => {
  //         onClickItem('customOffer');
  //       }}>
  //       <View style={[styles.rowContainer2, {}]}>
  //         <Text style={styles.Textc}>Create Custom Offer...</Text>
  //       </View>
  //     </TouchableHighlight>
  //   );
  // };

  const renderItems = ({item, index}) => {
    let title =
      c == 'loc' || c == 'actvty' || c == 'spcs' || c == 'state'
        ? item.name
        : c == 'tt'
        ? item.name
        : c == 'topic'
        ? item.title
        : c == 'dur' || c == 'rdur'
        ? item.title
        : '';

    let ts = props.style || {};
    return (
      <TouchableHighlight
        underlayColor={'#EEF6EF'}
        onPress={() => {
          onClickItem(item);
        }}>
        <View
          style={[
            styles.rowContainer,
            {
              // borderBottomWidth: index < data.length - 1 ? 0.7 : 0
            },
          ]}>
          <Text style={[styles.Text, ts]}>
            {title}
            {c == 'tt' && ' Trip'}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  let cc = modalHeight >= maxModalHeight ? true : false;

  const style = cc
    ? {
        height: 247,
        marginTop: absolute ? 53 : 8,
        position: absolute ? 'absolute' : 'relative',
      }
    : {
        marginTop: absolute ? 53 : 8,
        position: absolute ? 'absolute' : 'relative',
      };

  return (
    <>
      <SafeAreaView
        onLayout={event => {
          if (!cc) {
            let {height} = event.nativeEvent.layout;
            setmodalHeight(height);
          }
        }}
        style={[styles.Container, style]}>
        <KeyboardAvoidingView enabled>
          {isSearchBar && renderSearchBar()}
          {data.length <= 0 && rendershowMessage()}
          {data.length > 0 && (
            <View style={{paddingHorizontal: 15}}>
              <FlatList
                showsVerticalScrollIndicator={false}
                // contentContainerStyle={{paddingVertical: 5}}
                initialNumToRender={24}
                maxToRenderPerBatch={10}
                data={data}
                nestedScrollEnabled
                renderItem={renderItems}
                keyExtractor={(item, index) => item.title}
              />
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
      {/* {renderBottom()} */}
    </>
  );
}
