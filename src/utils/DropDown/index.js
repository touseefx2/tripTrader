import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableHighlight,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import theme from '../../theme/index';
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
      <View style={styles.rowContainer2}>
        <Text style={styles.Textc}>Create Custom Offer...</Text>
      </View>
    </TouchableHighlight>
  );
}

export default function DropDown(props) {
  const isSearchBar = props.search || false;
  const isFooter = props.footer || false;
  const c = props.c;
  const absolute = props.absolute || false;

  const [modalHeight, setmodalHeight] = useState(0);
  const maxModalHeight = 220;

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

  const renderItems = ({item}) => {
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
        <View style={styles.rowContainer}>
          <Text style={[styles.Text, ts]}>
            {title}
            {c == 'tt' && ' Trip'}
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
            let {height} = event.nativeEvent.layout;
            setmodalHeight(height);
          }
        }}
        style={[styles.Container, style]}>
        <KeyboardAvoidingView enabled>
          <FlatList
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
            renderItem={renderItems}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => {
              return (
                <View
                  style={{height: 1, backgroundColor: '#D8E1DB', width: '100%'}}
                />
              );
            }}
          />
        </KeyboardAvoidingView>
        {isFooter && (
          <Footer
            onClickItem={() => {
              onClickItem('customOffer');
            }}
          />
        )}
      </SafeAreaView>
    </>
  );
}
