import {StyleSheet} from 'react-native';
import theme from '../../../../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    width: '92%',
    alignSelf: 'center',
    paddingBottom: 20,
    backgroundColor: theme.color.background,
    borderRadius: 10,
    paddingTop: 5,
    paddingHorizontal: 5,
  },
  calenderTheme: {
    textDisabledColor: theme.color.subTitleLight,
    dayTextColor: theme.color.title,
    textDayFontSize: 13,
    textDayFontFamily: theme.fonts.fontMedium,
    textDayHeaderFontSize: 13,
    textSectionTitleColor: theme.color.title,
    textDayHeaderFontFamily: theme.fonts.fontMedium,
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: theme.fonts.fontBold,
    color: '#111111',
  },
});
