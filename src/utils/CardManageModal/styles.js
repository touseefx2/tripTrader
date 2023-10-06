import { StyleSheet } from "react-native";
import theme from "../../theme";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
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
    paddingHorizontal: 15,
    paddingBottom: 15,
  },

  Field: { marginVertical: 40, alignItems: "center", justifyContent: "center" },
  FieldTitle1: {
    color: theme.color.titleGreenForm,
    fontSize: 12.5,
    fontFamily: theme.fonts.fontBold,
    textAlign: "center",
  },
  FieldInput: {
    width: "100%",
    paddingHorizontal: 10,
    borderWidth: 1,
    height: 45,
    borderRadius: 8,
  },
  ButtonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.color.button1,
    height: 45,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 12,
  },
  ButtonText: {
    color: theme.color.buttonText,
    fontSize: 14,
    fontFamily: theme.fonts.fontBold,
    textTransform: "capitalize",
  },
  errorMessageFieldContainer: {
    marginTop: 2,
  },
  errorMessageFieldText: {
    color: theme.color.fieldBordeError,
    fontSize: 10,
    fontFamily: theme.fonts.fontNormal,
  },
});
