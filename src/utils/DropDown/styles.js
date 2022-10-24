import {StyleSheet, Platform} from 'react-native';

let bordercolor = '#D8E1DB';

export const styles = StyleSheet.create({
  Container: {
    width: '100%',
    borderColor: bordercolor,
    borderWidth: 1,
    alignSelf: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: 'white',
    zIndex: 100,
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
    paddingVertical: 15,
    borderColor: bordercolor,
    paddingHorizontal: 15,
  },
  rowContainer2: {
    width: '100%',
    paddingVertical: 15,
    borderColor: bordercolor,
    borderWidth: 1,
    paddingHorizontal: 15,
    // backgroundColor: 'white',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.18,
    // shadowRadius: 1.0,

    // elevation: 1,
  },
  Text: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    lineHeight: 19,
    textTransform: 'capitalize',
  },
  Textc: {
    color: '#3C6B49',
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
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
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});
