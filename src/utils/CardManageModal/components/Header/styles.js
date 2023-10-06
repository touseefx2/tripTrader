import { StyleSheet } from "react-native";
import theme from "../../../../theme";

export const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15,
    paddingBottom: 7,
    backgroundColor: theme.color.background,
  },
  title: {
    fontSize: 19,
    color: theme.color.title,
    fontFamily: theme.fonts.fontBold,
  },
  cross: {
    position: "absolute",
  },
});
