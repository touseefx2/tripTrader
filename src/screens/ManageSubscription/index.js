import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { styles } from "./styles";
import { observer } from "mobx-react";
import store from "../../store/index";
import utils from "../../utils/index";
import theme from "../../theme";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-easy-toast";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";
import { ActivityIndicator } from "react-native-paper";

export default observer(ManageSubscription);

function toFixed(num, fix) {
  var re = new RegExp("^-?\\d+(?:.\\d{0," + (fix || -1) + "})?");
  return num.toString().match(re)[0];
}

function ManageSubscription(props) {
  const toast = useRef(null);
  const toastduration = 700;
  const headerTitle = "Manage Subscription";

  const { isInternet } = store.General;
  const {
    user,
    regLoader,
    ucRef,
    userCardInfo,
    authToken,
    getCardInfo,
    userSubscription,
    cardDetails,
  } = store.User;

  const [isCancelSubModal, setIsCancelSubModal] = useState(false);

  let sub = "";
  let isSub = "";
  let isSubObj = false;
  let endDate = "";

  const card = {
    number: 4040,
    brand: "visa",
  };
  if (cardDetails?.length > 0) {
    const data = cardDetails[cardDetails.length - 1].card;
    if (data) {
      card.number = data.last4;
      card.brand = data.brand;
    }
  }

  if (user !== "guest" && user) {
    sub = user.subscriptionStatus || "";
    isSubObj = user.subscription || false;
    isSub = isSubObj.status;
    endDate = isSubObj.endDate ? isSubObj.endDate : "";
  }

  // console.log("userSubscription : ", userSubscription);
  // console.log("cardDetails : ", cardDetails[0].card);

  useEffect(() => {
    if (isInternet) getCardInfo(user.customerId, "", authToken);
  }, [isInternet]);

  const Cancelsubscription = () => {
    setIsCancelSubModal(true);
  };

  const renderMain = () => {
    const renderButton = () => {
      return (
        <>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("Plan")}
            activeOpacity={0.7}
            style={styles.BottomButton}
          >
            <Text style={styles.buttonTextBottom}>Choose Plan</Text>
          </TouchableOpacity>
        </>
      );
    };

    return (
      <View style={styles.section2}>
        <View style={styles.Field1}>
          <Text style={styles.FieldTitle1}>
            You are currently on a{" "}
            <Text
              style={[styles.FieldTitle1, { fontFamily: theme.fonts.fontBold }]}
            >
              Free plan
            </Text>
            . Subscribe today to unlock full access to all Trip Trader features!
          </Text>
        </View>

        {renderButton()}
      </View>
    );
  };

  const renderMain2 = () => {
    const renderButton = () => {
      return (
        <>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("Plan")}
            activeOpacity={0.7}
            style={styles.BottomButton}
          >
            <Text style={styles.buttonTextBottom}>Change plan</Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderButton2 = () => {
      return (
        <>
          <TouchableOpacity
            onPress={Cancelsubscription}
            activeOpacity={0.7}
            style={[
              styles.BottomButton,
              { backgroundColor: theme.color.button2, marginTop: 12 },
            ]}
          >
            <Text style={[styles.buttonTextBottom, { color: "#B93B3B" }]}>
              Cancel subscription
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const status = isSub;
    const pt = isSubObj.title ? isSubObj.title : "annual";
    const pt2 = pt.charAt(0).toUpperCase() + pt.slice(1);

    let planType = "";

    if (pt == "annual") {
      let amnt = toFixed(isSubObj.charges ? isSubObj.charges : 0, 2);
      planType = pt2 + ` ($${amnt}/mo)`;
    }
    if (pt == "monthly") {
      let amnt = toFixed(isSubObj.charges ? isSubObj.charges : 0, 2);
      planType = pt2 + ` ($${amnt})`;
    }

    return (
      <View style={styles.section2}>
        <View style={styles.Fieldp}>
          <Text style={styles.FieldpTitle}>Current Plan:</Text>
          <View style={{ width: "80%", marginLeft: 5 }}>
            <Text
              style={[
                styles.FieldpTitle,
                { fontFamily: theme.fonts.fontBold, color: theme.color.title },
              ]}
            >
              {planType}
            </Text>
          </View>
        </View>
        <View style={[styles.Fieldp, { marginTop: 5 }]}>
          <Text style={styles.FieldpTitle}>Card:</Text>
          <View
            style={{
              width: "80%",
              marginLeft: !ucRef ? 10 : 30,
              alignItems: "flex-start",
            }}
          >
            {ucRef && (
              <ActivityIndicator size={20} color={theme.color.button1} />
            )}
            {!ucRef && (
              <Text
                style={[
                  styles.FieldpTitle,
                  {
                    fontFamily: theme.fonts.fontBold,
                    color: theme.color.title,
                    textTransform: "capitalize",
                  },
                ]}
              >
                {card.brand + " ........." + card.number}
              </Text>
            )}
          </View>
        </View>

        {renderButton()}
        {renderButton2()}
      </View>
    );
  };

  const renderMain3 = () => {
    const renderButton = () => {
      return (
        <>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("Plan")}
            activeOpacity={0.7}
            style={styles.BottomButton}
          >
            <Text style={styles.buttonTextBottom}>Renew Subscription</Text>
          </TouchableOpacity>
        </>
      );
    };

    const status = isSub;
    const pt = isSubObj.title ? isSubObj.title : "annual";
    const planType = pt + " (" + status + ")";
    const txt =
      status == "canceled"
        ? `Your subscription plan has been ${status} and will not be renewed at the end of your billing cycle. You will continue to have full access until your plan ends on`
        : `Your subscription plan has been ${status} at`;

    return (
      <View style={styles.section2}>
        <View style={styles.Field1}>
          <Text style={styles.FieldTitle1}>
            {txt}{" "}
            <Text
              style={[styles.FieldTitle1, { fontFamily: theme.fonts.fontBold }]}
            >
              {moment(endDate).format("MMMM DD, YYYY")}.
            </Text>
          </Text>
        </View>

        <View style={styles.Fieldp}>
          <Text style={styles.FieldpTitle}>Current plan:</Text>
          <View style={{ width: "80%", marginLeft: 5 }}>
            <Text
              style={[
                styles.FieldpTitle,
                {
                  fontFamily: theme.fonts.fontBold,
                  color: theme.color.title,
                  textTransform: "capitalize",
                },
              ]}
            >
              {planType}
            </Text>
          </View>
        </View>
        <View style={[styles.Fieldp, { marginTop: 5 }]}>
          <Text style={styles.FieldpTitle}>Card:</Text>
          <View
            style={{
              width: "80%",
              marginLeft: !ucRef ? 10 : 30,
              alignItems: "flex-start",
            }}
          >
            {ucRef && (
              <ActivityIndicator size={20} color={theme.color.button1} />
            )}
            {!ucRef && (
              <Text
                style={[
                  styles.FieldpTitle,
                  {
                    fontFamily: theme.fonts.fontBold,
                    textTransform: "capitalize",
                  },
                ]}
              >
                {card.brand + " ........." + card.number}
              </Text>
            )}
          </View>
        </View>

        {renderButton()}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <utils.StackHeader bell={true} props={props} headerTitle={headerTitle} />
      {!isInternet && <utils.InternetMessage />}
      <SafeAreaView style={styles.container2}>
        <View style={styles.container3}>
          <KeyboardAvoidingView style={{ flex: 1 }} enabled>
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 15,
                paddingVertical: 15,
              }}
            >
              {sub == "freemium" && renderMain()}
              {sub == "paid" && isSub === "active" && renderMain2()}
              {sub == "paid" && isSub !== "active" && renderMain3()}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
        <utils.Footer
          nav={props.navigation}
          screen={headerTitle}
          focusScreen={store.General.focusScreen}
        />
      </SafeAreaView>
      <utils.Loader load={regLoader} />
      <Toast ref={toast} position="bottom" />
      {isCancelSubModal && (
        <utils.CancelSubModal
          isModal={isCancelSubModal}
          setIsModal={setIsCancelSubModal}
          userSubscription={userSubscription}
        />
      )}
    </View>
  );
}
