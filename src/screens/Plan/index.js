import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
  Keyboard,
  StatusBar,
  KeyboardAvoidingView,
  BackHandler,
  Platform,
} from "react-native";
import { styles } from "./styles";
import { observer } from "mobx-react";
import store from "../../store/index";
import utils from "../../utils/index";
import theme from "../../theme";
import {
  responsiveFontSize,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import Toast from "react-native-easy-toast";
import NetInfo from "@react-native-community/netinfo";
import { Notification } from "../../services/Notification";
import Card from "../Cards/Card";

import {
  StripeProvider,
  CardField,
  useStripe,
} from "@stripe/stripe-react-native";

export default observer(Plan);
function Plan(props) {
  const nameRegex = /^[a-zA-Z-' ]+$/;
  const toast = useRef(null);
  const {
    plans,
    user,
    regLoader,
    setregLoader,
    setUser,
    attemptToGetPlan,
    SubscribePlan,
    cardDetails,
    allCardDetails,
    getCardInfo,
    userSubscription,
  } = store.User;
  const { isInternet, Stripe_Publish_Key } = store.General;
  const { usrData = null, callingScreen = "" } = props?.route.params;

  const { confirmPayment } = useStripe();

  const [isShowTermsAndConditions, setIsShowTermsAndConditions] =
    useState(false);

  const [userData, setUserData] = useState(usrData || user);
  const [data, setData] = useState(plans);

  const [selectedCard, setSelectedCard] = useState(null);
  const [isCardModal, setIsCardModal] = useState(false);

  const [isAutoRenew, setIsAutoRenew] = useState(false);

  const [plan, setPlan] = useState(false);
  const [isPage, setisPage] = useState(1);

  const [cfn, setcfn] = useState("");
  const [Emptycfn, setEmptycfn] = useState(false);
  const [invalidcfn, setInvalidcfn] = useState(false);
  const [cardErr, setcardErr] = useState("");
  const [cardObj, setCardObj] = useState(null);

  const [pc, setpc] = useState("");
  const [isShowPromoFiled, setisShowPromoFiled] = useState(false);
  const [isPromoApply, setisPromoApply] = useState(false);
  const [promoValue, setpromoValue] = useState(0);

  const [monthly, setmonthly] = useState(0);
  const [annualy, setannualy] = useState(0);
  const [save, setsave] = useState(0);
  const [totalAnually, settotalAnually] = useState(0);

  const [iscTerms, setiscTerms] = useState(false);
  const [EmptycTerms, setEmptycTerms] = useState(false);

  let subscriptionStatus = "";
  let subscribePlanType = "";

  if (userSubscription) {
    subscriptionStatus = userSubscription?.status;
    subscribePlanType = userSubscription?.plan?.interval;
  }

  function toFixed(num, fix) {
    var re = new RegExp("^-?\\d+(?:.\\d{0," + (fix || -1) + "})?");
    return num.toString().match(re)[0];
  }

  useEffect(() => {
    if (isInternet) {
      attemptToGetPlan();
      if (callingScreen !== "Signup") {
        getCardInfo(userData.customerId);
      }
    }
  }, []);

  useEffect(() => {
    if (cardDetails) {
      setSelectedCard(cardDetails);
    }
  }, [cardDetails]);

  useEffect(() => {
    if (plans) {
      setData(plans);
    }
  }, [plans]);

  useEffect(() => {
    if (plan) {
      let monthly = 0;
      let annualy = 0;
      if (data && data.data.length > 0) {
        data.data.map((e, i, a) => {
          if (e.type == "annual") {
            annualy = e.charges;
          }
          if (e.type == "monthly") {
            monthly = e.charges;
          }
        });
      }
      let aa = annualy * 12;
      let ta = aa - 0.01;
      setmonthly(monthly);
      setannualy(annualy);
      settotalAnually(ta);

      if (isPromoApply) {
        let p = (isPromoApply.percent_off || 0) / 100;
        let discount = 0;
        if (plan.type == "monthly") {
          discount = monthly - p * monthly;
        }
        if (plan.type == "annual") {
          discount = totalAnually - p * totalAnually;
        }

        setpromoValue((discount + 0.01).toFixed(2));
      }
    }
  }, [plan, isPromoApply]);

  useEffect(() => {
    if (data && data.data.length > 0) {
      setPlan(data.data[0]);
      if (data.annual_discount) {
        setsave(data.annual_discount);
      }
    }
  }, [data]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonClick
    );
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
      subscription.remove();
    };
  }, [isPage]);

  function handleBackButtonClick() {
    if (!props.navigation.isFocused()) {
      return false;
    } else {
      goBack();
      return true;
    }
  }

  const toggleCardModal = useCallback(() => {
    setIsCardModal(!isCardModal);
  }, [isCardModal]);

  const goBack = () => {
    if (isPage === 1) {
      props.navigation.goBack();
    } else if (isPage === 2) {
      clearCard();
    }
  };

  const checkCardError = (value) => {
    const cnvalid = value.validNumber === "Valid" ? true : false;
    if (!cnvalid) {
      setcardErr("Card number is invalid");
      return false;
    }
    const cevalid = value.validExpiryDate === "Valid" ? true : false;
    if (!cevalid) {
      setcardErr("Card expiry date is invalid");
      return false;
    }
    const ccvcvalid = value.validCVC === "Valid" ? true : false;
    if (!ccvcvalid) {
      setcardErr("Card cvc number is invalid");
      return false;
    }

    setcardErr("");
    return true;
  };

  const clearCard = () => {
    setcfn("");
    setpc("");
    setcardErr("");
    setEmptycfn(false);
    setInvalidcfn(false);
    setisShowPromoFiled(false);
    setisPromoApply(null);
    setiscTerms(false);
    setpromoValue(0);
    setCardObj(null);
    setEmptycTerms(false);
    setisPage(1);
  };

  const applyPromo = () => {
    Keyboard.dismiss();
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        store.User.applyPromo(pc.trim(), setisPromoApply);
      } else {
        Alert.alert("", "Please connect internet");
      }
    });
  };

  const createSubscription = () => {
    Keyboard.dismiss();

    if (cfn.trim() === "") {
      setEmptycfn(true);
      return;
    }

    if (nameRegex.test(cfn.trim()) === false) {
      setInvalidcfn(true);
      return;
    }

    if (!cardObj) {
      setcardErr("Please enter full Card detials");
      return;
    } else {
      if (!checkCardError(cardObj)) {
        return;
      } else {
        if (!iscTerms) {
          setEmptycTerms(true);
          return;
        }

        NetInfo.fetch().then((state) => {
          if (state.isConnected) {
            const body = {
              customerId: userData?.customerId,
              priceId: plan?.stripeId,
            };
            if (isPromoApply) {
              body.promoCode = pc.trim();
            }
            store.User.attempToCreateSubscription(body, SucGetClientsecret);
          } else {
            Alert.alert("", "Please connect internet");
          }
        });

        return;
      }
    }
  };

  const SucGetClientsecret = async (clientSecret) => {
    try {
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card", //strip > 0.5.0
        // type: "Card", //stripe <= 0.5.0
        billingDetails: { name: cfn.trim() },
        // autoRenew:isAutoRenew
      });

      if (error) {
        setregLoader(false);
        Notification.sendPaymentFailedNotification(userData._id);
        console.log(`confirmPayment error: `, error);
        Alert.alert(`Payment ${error.code}`, error.message);
      } else if (paymentIntent) {
        const totalValue = plan.type === "annual" ? totalAnually : monthly;
        const subscription = {
          title: plan.type,
          charges: plan.charges,
          discount: plan.discount,
          startDate: new Date(),
          endDate: utils.functions.addMonths(
            new Date(),
            plan.type === "annual" ? 12 : 1
          ),
          amtPaid: totalValue,
          status: "active",
        };
        const obj = {
          subscription: subscription,
          subscriptionStatus: "paid",
        };

        SubscribePlan(obj, userData._id, userData.customerId, subPlanSucess);
      }
    } catch (err) {
      setregLoader(false);
      Notification.sendPaymentFailedNotification(userData._id);
      console.log(`confirmPayment cath error: `, err);
    }
  };

  const goToWelcome = () => {
    props.navigation.navigate("PlanStack", {
      screen: "Welcome",
      params: { user: userData },
    });
  };

  const subPlanSucess = (res) => {
    if (callingScreen === "Signup") {
      goToWelcome();
      return;
    }

    setUser(res);
    props.navigation.goBack();
  };

  const renderShowFieldError = (c) => {
    let text = c === "card" ? cardErr : "";

    if (c === "cfn") {
      text = Emptycfn
        ? "Please enter a full name"
        : invalidcfn
        ? "Full name is invalid"
        : "";
    }

    if (c === "cterms") {
      text = EmptycTerms ? "Agreeing to Terms and Conditions is required" : "";
    }

    return (
      <View style={styles.errorMessageFieldContainer}>
        <Text style={styles.errorMessageFieldText}>{text}</Text>
      </View>
    );
  };

  const renderSection2 = () => {
    // Methods

    const entercFn = (t) => {
      setEmptycfn(false);
      setInvalidcfn(false);
      setcfn(t);
    };

    const enterpc = (t) => {
      setpc(t);
    };

    const onChangeCard = (value) => {
      setCardObj(value);
      setEmptycTerms(false);
      setcardErr("");
    };

    const changePlan = () => {
      goBack();
    };

    const TermsnCndtnClickCard = () => {
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          setIsShowTermsAndConditions(true);
        } else {
          Alert.alert("Network Error", "Please connect internet.");
        }
      });
    };

    // Render

    const renderButtonPlan = () => {
      return (
        <>
          <TouchableOpacity
            onPress={() => {
              setisPage(2);
            }}
            activeOpacity={0.9}
            style={[
              styles.BottomButton,
              { marginTop: 0, width: "60%", height: 55 },
            ]}
          >
            <Text style={[styles.buttonTextBottom, { fontSize: 14 }]}>
              choose {plan.type} plan
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderButtonSubscribe = () => {
      return (
        <>
          <TouchableOpacity
            onPress={createSubscription}
            activeOpacity={0.7}
            style={styles.BottomButton}
          >
            <Text style={styles.buttonTextBottom}>Subscribe</Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderButtonCancel = () => {
      return (
        <>
          <TouchableOpacity activeOpacity={0.7} onPress={goBack}>
            <Text
              style={[
                styles.section2bottomTitle,
                { color: "rgba(17, 17, 17, 0.6)" },
              ]}
            >
              Cancel and go back
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderPlanBar = () => {
      const p = data.data.map((e, i, a) => {
        const name = e.type;

        return (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setPlan(e);
            }}
            style={{
              paddingHorizontal: 12,
              height: 37,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                plan.type == name
                  ? theme.color.button1
                  : theme.color.disableBack,
              borderTopLeftRadius: i == 0 ? 8 : 0,
              borderBottomLeftRadius: i == 0 ? 8 : 0,
              borderTopRightRadius: i == a.length - 1 ? 8 : 0,
              borderBottomRightRadius: i == a.length - 1 ? 8 : 0,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color:
                  plan.type == name
                    ? theme.color.buttonText
                    : theme.color.subTitle,
                fontFamily: theme.fonts.fontMedium,
                textTransform: "capitalize",
              }}
            >
              {name}
            </Text>
          </TouchableOpacity>
        );
      });

      return p;
    };

    const renderPlanDetails = () => {
      const pd = plan.features.map((feature) => {
        return (
          <View
            style={{
              flexDirection: "row",
              marginTop: 2,
              width: "100%",
            }}
          >
            <utils.vectorIcon.Entypo name="check" color={"#16953A"} size={20} />
            <Text
              style={{
                fontSize: 14,
                color: theme.color.subTitleAuth,
                fontFamily: theme.fonts.fontNormal,
                marginLeft: 10,
                bottom: 1,
                opacity: 0.6,
              }}
            >
              {feature}
            </Text>
          </View>
        );
      });

      return pd;
    };

    return (
      <>
        {/* Plan 1 */}

        {isPage == 1 && (
          <View style={styles.section2}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.section2Title1,
                    { textTransform: "none", alignSelf: "flex-start" },
                  ]}
                >
                  Choose a plan
                </Text>
                {/* {errorMessage !== '' && renderShowError()} */}
                <Text
                  style={[
                    styles.section2LogoTitle2c,
                    { alignSelf: "flex-start" },
                  ]}
                >
                  Unlock all features with a subscription.
                </Text>
              </View>

              <View
                style={{
                  width: "100%",
                  alignSelf: "center",
                  height: 0.6,
                  backgroundColor: theme.color.subTitleLight,
                  marginVertical: 15,
                  opacity: 0.5,
                }}
              />

              <View style={{ marginTop: 7 }}>
                {data && data.data && (
                  <>
                    <View
                      style={{
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      {renderPlanBar()}
                    </View>
                  </>
                )}

                {plan && (
                  <>
                    <View style={{ marginTop: 20 }}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontSize: 26,
                            color: theme.color.title,
                            fontFamily: theme.fonts.fontBold,
                          }}
                        >
                          $
                          {plan.type == "annual" ? annualy.toFixed(2) : monthly}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: theme.color.subTitleAuth,
                            fontFamily: theme.fonts.fontBold,
                            opacity: 0.6,
                            marginLeft: 5,
                          }}
                        >
                          /month{" "}
                          {plan.type == "annual" ? "(Billed annually)" : ""}
                        </Text>
                      </View>
                      {plan.type === "annual" && (
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#16953A",
                            fontFamily: theme.fonts.fontMedium,
                            textTransform: "capitalize",
                            top: -5,
                          }}
                        >
                          Best Value • ${toFixed(save, 0)} savings
                        </Text>
                      )}
                      {plan.type == "monthly" && (
                        <>
                          {save > 0 && (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                top: -5,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: "#767676",
                                  fontFamily: theme.fonts.fontMedium,
                                }}
                              >
                                Save ${toFixed(save, 0)} with an
                              </Text>
                              <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => {
                                  setPlan(data.data[1]);
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: "green",
                                    fontFamily: theme.fonts.fontMedium,
                                    marginLeft: 5,
                                  }}
                                >
                                  Annual Plan
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </>
                      )}
                    </View>
                    {plan.features.length > 0 && (
                      <View style={{ marginTop: 20 }}>
                        {renderPlanDetails()}
                      </View>
                    )}
                  </>
                )}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 25,
                }}
              >
                {renderButtonPlan()}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={callingScreen === "Signup" ? goToWelcome : goBack}
                >
                  <Text
                    style={[
                      styles.section2bottomTitle,
                      {
                        marginTop: 0,
                        marginLeft: 25,
                        fontSize: 14,
                        color: "rgba(17, 17, 17, 0.6)",
                      },
                    ]}
                  >
                    Try for free
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}

        {/* Payment 2 */}

        {isPage == 2 && (
          <View style={styles.section2}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {((subscribePlanType === "year" && plan.type === "annual") ||
                (subscribePlanType === "month" && plan.type === "monthly")) &&
              subscriptionStatus === "active" ? (
                <>
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: 50,
                    }}
                  >
                    <Text
                      style={{
                        width: "95%",
                        alignSelf: "center",
                        fontSize: responsiveFontSize(2.8),
                        color: theme.color.button1,
                        fontFamily: theme.fonts.fontMedium,
                        textAlign: "center",
                        marginBottom: 20,
                      }}
                    >
                      You have already subscribed to this plan
                    </Text>

                    {renderButtonCancel()}
                  </View>
                </>
              ) : (
                <>
                  <View style={{}}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        styles.section2Title1,
                        { textTransform: "none", alignSelf: "flex-start" },
                      ]}
                    >
                      Payment Information
                    </Text>

                    <Text
                      style={[
                        styles.section2LogoTitle2c,
                        { alignSelf: "flex-start", marginTop: 5 },
                      ]}
                    >
                      Your subscription will start after you make your first
                      payment below.
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      height: 0.6,
                      alignSelf: "center",
                      marginVertical: 12,
                      backgroundColor: theme.color.subTitleLight,
                      opacity: 0.5,
                    }}
                  />
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                      }}
                    >
                      <Text style={styles.paymenttitle1}>total due Now :</Text>
                      {!isPromoApply && (
                        <Text
                          style={[
                            styles.paymenttitle1,
                            {
                              color: theme.color.title,
                              width: "65%",
                              marginLeft: 5,
                              textTransform: "none",
                            },
                          ]}
                        >
                          {plan.type == "annual"
                            ? `$${toFixed(totalAnually, 2)} ($${annualy.toFixed(
                                2
                              )} /mo)`
                            : `$${monthly} /mo`}
                        </Text>
                      )}

                      {isPromoApply && (
                        <View
                          style={{
                            flexDirection: "row",
                            marginLeft: 5,
                            width: "65%",
                          }}
                        >
                          <Text
                            style={{
                              color: theme.color.title,
                              fontSize: 11,

                              fontFamily: theme.fonts.fontBold,
                              textTransform: "capitalize",
                              textDecorationLine: "line-through",
                            }}
                          >
                            {plan.type == "annual"
                              ? `$${toFixed(totalAnually, 2)}`
                              : `$${monthly}`}
                            {"  "}
                          </Text>

                          <Text
                            style={{
                              color: theme.color.titleGreen,
                              fontSize: 11,
                              fontFamily: theme.fonts.fontBold,
                              textTransform: "capitalize",
                            }}
                          >
                            ${promoValue} ({isPromoApply.percent_off}% discount)
                          </Text>
                        </View>
                      )}
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.paymenttitle2}>your plan :</Text>
                      <Text
                        style={[
                          styles.paymenttitle2,
                          {
                            color: theme.color.title,
                            marginLeft: 5,
                          },
                        ]}
                      >
                        {plan.type}
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={changePlan}
                      >
                        <Text
                          style={[
                            styles.paymenttitle2,
                            {
                              color: theme.color.titleGreen,
                              marginLeft: 10,
                              fontFamily: theme.fonts.fontNormal,
                              textDecorationLine: "underline",
                            },
                          ]}
                        >
                          change
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View>
                    {!selectedCard ? (
                      <>
                        <View style={styles.Field}>
                          {allCardDetails.length > 0 && (
                            <TouchableOpacity
                              onPress={toggleCardModal}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.selectCard}>Select card</Text>
                            </TouchableOpacity>
                          )}

                          <Text style={styles.FieldTitle1}>full name</Text>
                          <TextInput
                            placeholder="Card holder’s first and last name"
                            value={cfn}
                            onChangeText={entercFn}
                            style={[
                              styles.FieldInput,
                              {
                                borderColor:
                                  Emptycfn || invalidcfn
                                    ? theme.color.fieldBordeError
                                    : theme.color.fieldBorder,
                                fontSize: 12,
                                color: "black",
                              },
                            ]}
                          />
                          {(Emptycfn || invalidcfn) &&
                            renderShowFieldError("cfn")}
                        </View>

                        <View style={styles.Field}>
                          <Text style={styles.FieldTitle1}>card</Text>

                          <CardField
                            postalCodeEnabled={false}
                            placeholders={{
                              number: "Card number",
                            }}
                            cardStyle={{
                              textColor: theme.color.title,
                              fontSize: responsiveFontSize(1.5),
                              borderColor: theme.color.fieldBorder,
                              borderWidth: 1,
                              borderRadius: 8,
                              fontFamily: theme.fonts.fontNormal,
                            }}
                            style={{
                              width: "100%",
                              height: 45,
                            }}
                            onCardChange={(cardDetails) => {
                              onChangeCard(cardDetails);
                            }}
                            onFocus={(focusedField) => {
                              console.log("focusField", focusedField);
                            }}
                          />
                          {cardErr !== "" && renderShowFieldError("card")}
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={[styles.Field, { paddingHorizontal: 5 }]}>
                          <Card
                            item={selectedCard}
                            bottomText={
                              allCardDetails.length > 0 ? "change" : ""
                            }
                            changeCard={toggleCardModal}
                          />
                          <TouchableOpacity
                            onPress={() => setSelectedCard(null)}
                            activeOpacity={0.7}
                            style={{
                              position: "absolute",
                              top: -10,
                              right: -1,
                            }}
                          >
                            <utils.vectorIcon.Entypo
                              name="circle-with-cross"
                              color={theme.color.button1}
                              size={responsiveFontSize(2.2)}
                            />
                          </TouchableOpacity>
                        </View>
                      </>
                    )}

                    <View
                      style={[
                        styles.Field,
                        {
                          flexDirection: "row",
                          justifyContent: "space-between",
                        },
                      ]}
                    >
                      <Text style={styles.FieldTitle1}>Auto Renew</Text>
                      <utils.CheckBox
                        isSel={isAutoRenew}
                        setIsSel={setIsAutoRenew}
                      />
                    </View>

                    {isShowPromoFiled && (
                      <View style={styles.Field}>
                        <Text style={styles.FieldTitle1}>promo code</Text>

                        {!isPromoApply && (
                          <View
                            style={[
                              styles.FieldInput,
                              {
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                paddingHorizontal: 0,
                                borderWidth: 1,
                                borderColor: theme.color.fieldBorder,
                              },
                            ]}
                          >
                            <TextInput
                              placeholder="Add a promo code"
                              value={pc}
                              onChangeText={enterpc}
                              style={{
                                fontSize: 13,

                                color: "black",
                                width: "70%",
                                height: "100%",
                                paddingLeft: 10,
                              }}
                            />

                            {pc != "" && (
                              <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={applyPromo}
                                style={{
                                  width: 60,
                                  height: "100%",
                                  borderTopRightRadius: 8,
                                  borderBottomRightRadius: 8,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: theme.color.button1,
                                  paddingHorizontal: 3,
                                }}
                              >
                                <Text
                                  style={{
                                    color: theme.color.buttonText,
                                    fontSize: 13,
                                    fontFamily: theme.fonts.fontMedium,
                                  }}
                                >
                                  Apply
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        )}

                        {isPromoApply && (
                          <View
                            style={{
                              marginTop: 5,
                              alignItems: "center",
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={{
                                width: "50%",
                                color: theme.color.title,
                                fontSize: 12,
                                fontFamily: theme.fonts.fontMedium,
                              }}
                            >
                              {isPromoApply?.id.trim()}
                            </Text>

                            <TouchableOpacity
                              activeOpacity={0.7}
                              onPress={() => setisPromoApply(false)}
                            >
                              <Text
                                style={{
                                  color: theme.color.titleGreen,
                                  fontSize: 12,
                                  fontFamily: theme.fonts.fontMedium,
                                  textDecorationLine: "underline",
                                }}
                              >
                                Remove
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    )}

                    {!isShowPromoFiled && (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setisShowPromoFiled(true)}
                        style={{ marginTop: 20 }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: theme.color.titleGreen,
                            fontFamily: theme.fonts.fontMedium,
                            textDecorationLine: "underline",
                          }}
                        >
                          I have a promo code
                        </Text>
                      </TouchableOpacity>
                    )}

                    <View style={{ marginTop: 20 }}>
                      <View
                        style={[
                          styles.Field2,
                          { justifyContent: "space-between" },
                        ]}
                      >
                        <TouchableOpacity
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 4,
                            backgroundColor: !iscTerms
                              ? "white"
                              : theme.color.button1,
                            alignItems: "center",
                            justifyContent: "center",
                            borderWidth: 1,
                            borderColor: theme.color.fieldBorder,
                          }}
                          activeOpacity={0.5}
                          onPress={() => {
                            setiscTerms(!iscTerms);
                            setEmptycTerms(false);
                          }}
                        >
                          {iscTerms && (
                            <utils.vectorIcon.FontAwesome5
                              name={"check"}
                              color={theme.color.buttonText}
                              size={11}
                            />
                          )}
                        </TouchableOpacity>

                        <View style={{ width: "90%" }}>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={TermsnCndtnClickCard}
                          >
                            <Text style={styles.Field2Titlec}>
                              I agree to Trip Trader’s{" "}
                              <Text style={styles.Field2Titlecc}>
                                Terms & Conditions
                              </Text>
                            </Text>
                          </TouchableOpacity>
                          <Text style={[styles.Field2Titlec, { top: -3 }]}>
                            and understand that upon clicking “Subscribe” below,
                            I will be charged{" "}
                            {plan.type == "annual"
                              ? `$${toFixed(totalAnually, 2)}`
                              : `$${monthly}`}{" "}
                            {plan.type == "annual"
                              ? plan.type + "y"
                              : plan.type}
                            .
                          </Text>
                        </View>
                      </View>
                      {EmptycTerms && renderShowFieldError("cterms")}
                    </View>
                  </View>
                  {renderButtonSubscribe()}
                  {renderButtonCancel()}
                </>
              )}
            </ScrollView>
          </View>
        )}
      </>
    );
  };

  const renderStatusBar = () => {
    return (
      <>
        <StatusBar
          translucent={true}
          backgroundColor={"transparent"}
          barStyle={"light-content"}
        />
      </>
    );
  };

  return (
    <StripeProvider publishableKey={Stripe_Publish_Key}>
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/background/img.png")}
          style={styles.container2}
        />
        <SafeAreaView style={styles.container3}>
          <utils.AuthHeader props={props} screen="plan" goBack={goBack} />
          <KeyboardAvoidingView
            style={{
              flex: 1,
              paddingHorizontal: 15,
              marginTop: responsiveHeight(3),
            }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            {renderSection2()}
          </KeyboardAvoidingView>
        </SafeAreaView>

        <Toast ref={toast} position="center" />
        <utils.Loader load={regLoader} />

        {renderStatusBar()}
        {isShowTermsAndConditions && (
          <utils.WebViewModal
            link={store.General.Terms_and_Conditions_Link}
            isVisible={isShowTermsAndConditions}
            setisVisible={setIsShowTermsAndConditions}
          />
        )}
      </View>
    </StripeProvider>
  );
}
