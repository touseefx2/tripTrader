import { StyleSheet } from "react-native";
import theme from "../../theme";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },

  modal: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: theme.color.background,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  list: {
    flex: 1,
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
});
