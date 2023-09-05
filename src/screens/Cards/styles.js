import { StyleSheet } from "react-native";
import theme from "../../theme/index";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.backgroundGreen,
  },
  container2: {
    flex: 1,
    backgroundColor: theme.color.background,
  },
  container3: {
    flex: 1,
    backgroundColor: theme.color.background,
  },
  listContainer: {
    padding: 15,
  },
  emptyTitle: {
    marginTop: "70%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    fontSize: responsiveFontSize(1.5),
    color: theme.color.title,
    fontFamily: theme.fonts.fontMedium,
    opacity: 0.4,
  },
  cardContainer: {
    width: "100%",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    borderRadius: 8,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontFamily: theme.fonts.fontBold,
    color: theme.color.title,
    textTransform: "capitalize",
    fontSize: responsiveFontSize(1.8),
    width: "70%",
  },
  card: {
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.title,
    textTransform: "capitalize",
    fontSize: responsiveFontSize(1.6),
  },
  expiry: {
    fontFamily: theme.fonts.fontNormal,
    color: theme.color.title,
    textTransform: "capitalize",
    fontSize: responsiveFontSize(1.5),
  },
  sectionBottom: {
    width: "100%",
    marginTop: 5,
    alignItems: "flex-end",
  },
  delete: {
    fontFamily: theme.fonts.fontMedium,
    color: "red",
    textTransform: "capitalize",
    fontSize: responsiveFontSize(1.4),
    textDecorationLine: "underline",
    textDecorationColor: "red",
  },
});
