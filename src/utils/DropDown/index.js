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
import theme from '../../theme/index';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {styles} from './styles';

function SearchBar({search, setsearch}) {
  return (
    <View style={styles.searchBarContainer}>
      <AntDesign name="search1" color={'rgba(17, 17, 17, 0.6)'} size={18} />
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
        value={search}
        onChangeText={t => {
          setsearch(t);
        }}
      />
    </View>
  );
}

function EmptyListMessage() {
  return (
    <>
      <Text
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          fontSize: 13,
          color: theme.color.title,
          fontFamily: theme.fonts.fontMedium,
          opacity: 0.4,
          marginVertical: 25,
        }}>
        No record found
      </Text>
    </>
  );
}

function Footer({onClickItem}) {
  return (
    <TouchableHighlight underlayColor={'#EEF6EF'} onPress={onClickItem}>
      <View style={[styles.rowContainer2, {}]}>
        <Text style={styles.Textc}>Create Custom Offer...</Text>
      </View>
    </TouchableHighlight>
  );
}

export default function DropDown(props) {
  let isSearchBar = props.search || false;
  let isFooter = props.footer || false;
  let c = props.c;
  let absolute = props.absolute || false;

  const [modalHeight, setmodalHeight] = useState(0);
  let maxModalHeight = 247;

  const [data, setData] = useState(props.data);

  const [search, setsearch] = useState('');

  useEffect(() => {
    if (search != '') {
      let d = [];
      if (props.data.length > 0) {
        d = props.data.filter(item => {
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
              : c == 'trip'
              ? item.species
              : '';

          return n.toLowerCase().includes(search.toLowerCase());
        });
      }
      setData(d);
    } else {
      setData(props.data);
    }
  }, [search]);

  useEffect(() => {
    return () => {
      setmodalHeight(0);
    };
  }, []);

  const onClickItem = item => {
    props.onSelectItem(item);
    props.setVisible(false);
    setmodalHeight(0);
  };

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
        : c == 'trip'
        ? item.species
        : '';

    let ts = props.style || {};
    return (
      <TouchableHighlight
        underlayColor={'#EEF6EF'}
        onPress={() => {
          onClickItem(item);
        }}>
        <View style={[styles.rowContainer, {}]}>
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
          <View style={{paddingHorizontal: 0}}>
            <FlatList
              // contentContainerStyle={{paddingHorizontal: 12}}
              showsVerticalScrollIndicator={false}
              initialNumToRender={24}
              maxToRenderPerBatch={10}
              data={data}
              nestedScrollEnabled
              ListEmptyComponent={
                c == 'trip' && props.data.length <= 0 ? null : (
                  <EmptyListMessage />
                )
              }
              ListHeaderComponent={
                isSearchBar && props.data.length > 0 ? (
                  <SearchBar search={search} setsearch={c => setsearch(c)} />
                ) : null
              }
              ListFooterComponent={
                isFooter ? (
                  <Footer
                    onClickItem={() => {
                      onClickItem('customOffer');
                    }}
                  />
                ) : null
              }
              renderItem={renderItems}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {/* {renderBottom()} */}
    </>
  );
}
