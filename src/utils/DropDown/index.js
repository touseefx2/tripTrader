import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableHighlight,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import theme from '../../theme/index';
import {styles} from './styles';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

function SearchBar({search, setsearch}) {
  return (
    <View style={styles.searchBarContainer}>
      <AntDesign
        name="search1"
        color={'rgba(17, 17, 17, 0.6)'}
        size={responsiveFontSize(2.35)}
      />
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

function EmptyListMessage({isMaxHeight, maxModalHeight}) {
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
          marginTop: !isMaxHeight ? 20 : maxModalHeight / 3,
          marginBottom: !isMaxHeight ? 20 : maxModalHeight / 3,
        }}>
        No record found
      </Text>
    </>
  );
}

function Footer({onClickItem}) {
  return (
    <TouchableHighlight underlayColor={'#EEF6EF'} onPress={onClickItem}>
      <View style={styles.rowContainer2}>
        <Text style={styles.Textc}>Create Custom Offer...</Text>
      </View>
    </TouchableHighlight>
  );
}

export default function DropDown(props) {
  const isSearchBar = props.search || false;
  const isFooter = props.footer || false;
  const check = props.c;
  const absolute = props.absolute || false;

  const [modalHeight, setmodalHeight] = useState(0);
  const maxModalHeight = 200;

  const [data, setData] = useState(props.data);
  const [search, setsearch] = useState('');

  useEffect(() => {
    if (search != '') {
      let result = [];
      if (props.data.length > 0) {
        result = props.data.filter(item => {
          const name =
            check == 'loc' ||
            check == 'actvty' ||
            check == 'spcs' ||
            check == 'tt' ||
            check == 'state'
              ? item.name
              : check == 'topic'
              ? item.title
              : check == 'dur' || check == 'rdur'
              ? item.title
              : check == 'trip'
              ? item.species
              : '';

          return name.toLowerCase().includes(search.toLowerCase());
        });
      }
      setData(result);
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

  const renderItems = ({item}) => {
    const title =
      check === 'loc' ||
      check == 'actvty' ||
      check == 'spcs' ||
      check == 'state'
        ? item.name
        : check === 'tt'
        ? item.name
        : check === 'topic'
        ? item.title
        : check === 'dur' || check === 'rdur'
        ? item.title
        : check === 'trip'
        ? item.species
        : '';

    const ts = props.style || {};
    return (
      <TouchableHighlight
        underlayColor={'#EEF6EF'}
        onPress={() => {
          onClickItem(item);
        }}>
        <View style={styles.rowContainer}>
          <Text style={[styles.Text, ts]}>
            {title}
            {check == 'tt' && ' Trip'}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  const isMaxHeight = modalHeight >= maxModalHeight ? true : false;
  const style = isMaxHeight
    ? {
        height: maxModalHeight,
        marginTop: absolute ? 50 : 8,
        position: absolute ? 'absolute' : 'relative',
      }
    : {
        marginTop: absolute ? 50 : 8,
        position: absolute ? 'absolute' : 'relative',
      };

  return (
    <>
      <SafeAreaView
        onLayout={event => {
          if (!isMaxHeight) {
            const {height} = event.nativeEvent.layout;
            setmodalHeight(height);
          }
        }}
        style={[
          styles.Container,
          {
            borderWidth: check == 'trip' && props.data.length <= 0 ? 0 : 1,
            maxHeight: maxModalHeight,
          },
          style,
        ]}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}>
            <FlatList
              showsVerticalScrollIndicator={false}
              initialNumToRender={24}
              maxToRenderPerBatch={10}
              data={data}
              nestedScrollEnabled
              ListEmptyComponent={
                check == 'trip' && props.data.length <= 0 ? null : (
                  <EmptyListMessage
                    isMaxHeight={isMaxHeight}
                    maxModalHeight={maxModalHeight}
                  />
                )
              }
              ListHeaderComponent={
                isSearchBar && props.data.length > 0 ? (
                  <SearchBar search={search} setsearch={c => setsearch(c)} />
                ) : null
              }
              renderItem={renderItems}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => {
                return (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: '#D8E1DB',
                      width: '100%',
                    }}
                  />
                );
              }}
            />
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
      {isFooter && (
        <Footer
          onClickItem={() => {
            onClickItem('customOffer');
          }}
        />
      )}
    </>
  );
}
