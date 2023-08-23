import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Pressable,
  TextInput,
  FlatList,
  RefreshControl,
} from "react-native";
import ProgressiveFastImage from "@freakycoder/react-native-progressive-fast-image";
import { styles } from "./styles";
import { observer } from "mobx-react";
import store from "../../../store/index";
import utils from "../../../utils/index";
import theme from "../../../theme";
import NetInfo from "@react-native-community/netinfo";
import { ActivityIndicator } from "react-native-paper";
import moment from "moment";

export default observer(Sent);

function Sent(props) {
  const guest = require("../../../assets/images/drawer/guest/img.png");
  const trnfericon = require("../../../assets/images/transfer/img.png");
  const durtnicon = require("../../../assets/images/confirmTrip/duration/img.png");
  const avlblicon = require("../../../assets/images/confirmTrip/available/img.png");
  const locationicon = require("../../../assets/images/confirmTrip/location/img.png");

  const { isInternet, offerGoTo, setOfferGoTo } = store.General;
  const { homeModalLoder, offersProfileProps } = store.User;

  const [modalObj, setModalObj] = useState(false);
  const [isCancelOfferModal, setIsCancelOfferModal] = useState(false);

  let data = store.Offers.sentOffers;
  let mloader = store.Offers.Loader;
  let mmloader = store.Offers.mLoader;

  useEffect(() => {
    if (offerGoTo != "") {
      setTimeout(() => {
        props.jumpTo(offerGoTo);
        setOfferGoTo("");
      }, 100);
    }
  }, [offerGoTo]);

  const [getDataOnce, setgetDataOnce] = useState(false);
  const setGetDataOnce = (C) => {
    setgetDataOnce(C);
  };
  const [refreshing, setRefreshing] = React.useState(false);
  const setrefeshing = (c) => {
    setRefreshing(c);
  };
  const onRefresh = React.useCallback(() => {
    console.log("onrefresh cal");
    setRefreshing(true);
    getDbData();
  }, []);
  const getDbData = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        store.Offers.attemptToGetSentOffers(setGetDataOnce, setrefeshing);
      } else {
        setrefeshing(false);
      }
    });
  };
  useEffect(() => {
    if (!getDataOnce && isInternet) {
      getDbData();
    }
    return () => {};
  }, [getDataOnce, isInternet]);

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 15,
        }}
      />
    );
  };

  const EmptyListMessage = ({ item }) => {
    return (
      // Flat List Item
      <>
        {!mloader && getDataOnce && (
          <Text
            style={{
              marginTop: "80%",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: 13,
              color: theme.color.subTitleLight,
              fontFamily: theme.fonts.fontMedium,
            }}
          >
            You have no pending sent offers
          </Text>
        )}

        {mloader && !getDataOnce && (
          <ActivityIndicator
            size={30}
            color={theme.color.button1}
            style={{
              marginTop: "80%",

              alignSelf: "center",
            }}
          />
        )}
      </>
    );
  };

  const ListHeader = () => {
    const renderResult = () => {
      let length = data.length;
      return (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            You sent {length} {length <= 1 ? "offer" : "offers"}
          </Text>
        </View>
      );
    };

    const renderSearch = () => {
      return (
        <TouchableOpacity disabled>
          <Image
            source={require("../../../assets/images/searchBar/search/img.png")}
            style={styles.Baricon}
          />
        </TouchableOpacity>
      );
    };

    const renderInput = () => {
      return (
        <View style={{ width: "85%" }}>
          <TextInput
            editable={false}
            style={styles.SerchBarInput}
            placeholder="Search"
          />
        </View>
      );
    };

    const renderFilter = () => {
      const onclick = () => {};

      return (
        <TouchableOpacity style={styles.Baricon} onPress={onclick} disabled>
          {/* <Image
            source={require('../../../assets/images/searchBar/filter/img.png')}
            style={styles.Baricon}
          /> */}
        </TouchableOpacity>
      );
    };

    return (
      <>
        {/* <Pressable
          style={({pressed}) => [
            {opacity: pressed ? 0.9 : 1},
            [styles.SerchBarContainer],
          ]}
          onPress={onclickSearchBar}>
          {renderSearch()}
          {renderInput()}
          {renderFilter()}
        </Pressable> */}

        {data.length > 0 && renderResult()}
      </>
    );
  };

  function FormatAvlblDate(s1, s2) {
    let avlbl = "";

    let sd = s1;
    let sdy = parseInt(new Date(sd).getFullYear());
    let ed = s2;
    let edy = parseInt(new Date(ed).getFullYear());
    if (sdy == edy) {
      avlbl =
        moment(sd).format("MMM DD") + " - " + moment(ed).format("MMM DD, YYYY");
    } else {
      avlbl =
        moment(sd).format("MMM DD, YYYY") +
        " - " +
        moment(ed).format("MMM DD, YYYY");
    }

    return avlbl;
  }

  function FormatPrfrDate(pd) {
    let t = "";
    let arset = [];
    if (pd.length > 0) {
      pd.map((e, i, a) => {
        arset.push(moment(e).format("MMM DD, YYYY"));
      });
    }
    if (arset.length > 0) {
      let fd = arset[0];
      if (arset.length > 1) {
        let sd = arset[arset.length - 1];

        let sdy = parseInt(new Date(fd).getFullYear());

        let edy = parseInt(new Date(sd).getFullYear());

        if (sdy == edy) {
          t =
            moment(fd).format("MMM DD") +
            " - " +
            moment(sd).format("MMM DD, YYYY");
        } else {
          t = fd + " - " + sd;
        }
      } else if (arset.length <= 1) {
        t = fd;
      }
    }

    return t;
  }

  function compare(d, dd) {
    let d1 = moment(d).format("YYYY-MM-DD");
    let d2 = moment(dd).format("YYYY-MM-DD");
    if (d2 > d1) {
      return "greater";
    } else if (d2 < d1) {
      return "smaller";
    } else {
      return "equal";
    }
  }

  function diff_minutes(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  }

  function CheckDate(d) {
    let t = "";
    let ud = new Date(d); //update date
    let cd = new Date(); //current date

    let udcy = false; //is update date  current year
    let udy = parseInt(ud.getFullYear());
    let cdy = parseInt(cd.getFullYear());
    if (udy == cdy) {
      udcy = true;
    }
    // && min < 1440 // 1 daya minure
    let sd = ud; //start date
    let ed = cd; //end date
    let ics = compare(sd, ed); //is check date
    // console.log('updated date : ', moment(ud).format('YYYY-MM-DD hh:mm:ss a'));
    // console.log('currentdate : ', moment(cd).format('YYYY-MM-DD hh:mm:ss a'));

    if (ics == "greater") {
      var start = moment(moment(ed).format("YYYY-MM-DD"), "YYYY-MM-DD");
      var end = moment(moment(sd).format("YYYY-MM-DD"), "YYYY-MM-DD");
      let days = start.diff(end, "days");

      if (days > 3) {
        if (udcy) {
          t = moment(ud).format("MMM DD");
        } else {
          t = moment(ud).format("MMM DD, YYYY");
        }
      } else {
        if (days == 1 || days == 0) {
          t = "1 day ago";
        }

        if (days == 2) {
          t = "2 days ago";
        }

        if (days == 3) {
          t = "3 days ago";
        }
      }
    } else {
      let min = diff_minutes(ed, sd);
      // console.log('minutes: ', min);
      if (min >= 0 && min <= 1) {
        t = "Just now";
      } else {
        if (min > 1 && min < 60) {
          t = min + " mins ago";
        } else if (min >= 60) {
          const hours = Math.floor(min / 60);

          const h = hours.toFixed(0);
          let tt = h <= 1 ? " hour" : " hours";
          t = h + tt + " ago";

          // t = moment(ud).format('hh:mm a');
        }
      }
    }

    return t;
  }

  const ItemView = ({ item, index }) => {
    const user = item.offeredTo;
    if (user) {
      const ofer = item.hostTrip;
      const trade = item.offeredTrip;
      const offernote = item.note || "";
      const create = CheckDate(item.createdAt);

      //user info
      const photo =
        user?.image && user.image != "" ? { uri: user.image } : guest;
      const userName = user.firstName + " " + user.lastName || "";
      const avgRating = user.rating || 0;
      const totalReviews = user.reviews || 0;

      //offer by (host trip)
      let title = ofer.species + " " + ofer.tradeType;
      let dur = ofer.duration.value;
      let t =
        dur <= 1
          ? ofer.duration.title.substring(0, ofer.duration.title.length - 1)
          : ofer.duration.title;
      dur = dur + " " + t;
      let avlbl = FormatAvlblDate(
        utils.functions.DateWithoutFormat(ofer.availableFrom),
        utils.functions.DateWithoutFormat(ofer.availableTo)
      );
      let loc = ofer.location.city + ", " + ofer.location.state;

      //ofer to (offer trip)
      let titlet = trade.species + " " + trade.tradeType;
      let durt = trade.duration.value;
      let tt =
        durt <= 1
          ? trade.duration.title.substring(0, trade.duration.title.length - 1)
          : trade.duration.title;
      durt = durt + " " + tt;
      const preferdates = item.preferredDates.map((e) =>
        utils.functions.DateWithoutFormat(e)
      );
      let avlblt = utils.functions.formatSelectedDates(preferdates, "arr");
      // FormatPrfrDate(preferdates);
      let loct = trade.location.city + ", " + trade.location.state;

      const renderProfile = () => {
        return (
          <>
            <View style={styles.mProfileImgContainer}>
              <ProgressiveFastImage
                style={styles.mProfileImg}
                source={photo}
                loadingImageStyle={styles.mimageLoader}
                loadingSource={require("../../../assets/images/imgLoad/img.jpeg")}
                blurRadius={5}
              />
            </View>
          </>
        );
      };

      const renderText = () => {
        return (
          <View style={[styles.mtextContainer]}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "72%" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: "#101B10",
                    fontSize: 16,
                    fontFamily: theme.fonts.fontBold,
                    lineHeight: 22.4,
                    textTransform: "capitalize",
                  }}
                >
                  {userName}
                </Text>
              </View>
              <View
                style={{
                  width: "27%",

                  alignItems: "flex-end",
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: theme.color.subTitleLight,
                    fontSize: 11,
                    fontFamily: theme.fonts.fontMedium,
                    lineHeight: 22.4,
                  }}
                >
                  {create}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", marginTop: 3 }}>
              <utils.vectorIcon.Entypo
                name="star"
                color={theme.color.rate}
                size={14}
              />
              <Text style={styles.textContainerRatetitle1}>
                {" "}
                {avgRating > 0 ? avgRating.toFixed(1) : avgRating}
                {"  "}
              </Text>
              <Text style={styles.textContainerRatetitle2}>
                {totalReviews > 300 ? "300+" : totalReviews} reviews
              </Text>
            </View>
          </View>
        );
      };

      const renderFields = () => {
        let titleS = {
          color: theme.color.subTitleLight,
          fontSize: 11.5,
          fontFamily: theme.fonts.fontBold,
          textTransform: "uppercase",
        };

        let titleM = {
          color: theme.color.title,
          fontSize: 13,
          fontFamily: theme.fonts.fontMedium,
          lineHeight: 19,
        };

        let iconS = {
          width: 20,
          height: 20,
          resizeMode: "contain",
        };

        let titleM2 = {
          color: "#101B10",
          fontSize: 13,
          fontFamily: theme.fonts.fontNormal,
          lineHeight: 19,
        };

        let offertitleS = {
          color: "#101B10",
          fontSize: 12,
          fontFamily: theme.fonts.fontNormal,
        };

        return (
          <View style={{ width: "96%", marginTop: 20, alignSelf: "center" }}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "40%" }}>
                <Text style={titleS}>YOU OFFERED</Text>
                <Text style={titleM}>{title}</Text>

                <View style={{ marginTop: 20 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Image style={iconS} source={durtnicon} />
                    <View style={{ width: "78%" }}>
                      <Text style={titleM2}>{dur}</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Image style={iconS} source={avlblicon} />
                    <View style={{ width: "78%" }}>
                      <Text style={titleM2}>{avlbl}</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Image style={iconS} source={locationicon} />
                    <View style={{ width: "78%" }}>
                      <Text style={titleM2}>{loc}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <Image
                style={{
                  width: 24,
                  height: 24,
                  resizeMode: "contain",
                  top: 26,
                }}
                source={trnfericon}
              />

              <View style={{ width: "40%" }}>
                <Text style={titleS}>for trade</Text>
                <Text style={titleM}>{titlet}</Text>

                <View style={{ marginTop: 20 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Image style={iconS} source={durtnicon} />
                    <View style={{ width: "78%" }}>
                      <Text style={titleM2}>{durt}</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Image style={iconS} source={avlblicon} />
                    <View style={{ width: "78%" }}>
                      <Text style={titleM2}>{avlblt}</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Image style={iconS} source={locationicon} />
                    <View style={{ width: "78%" }}>
                      <Text style={titleM2}>{loct}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {offernote != "" && (
              <View style={{ width: "100%", marginTop: 20 }}>
                <Text style={titleS}>OFFER NOTE</Text>
                <Text style={offertitleS}>{offernote}</Text>
              </View>
            )}
          </View>
        );
      };

      const renderBottom = () => {
        let bc = {
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          height: 48,
          backgroundColor: "#F8ECEC",
          // borderWidth: 1,
          // borderColor: theme.color.fieldBorder,
        };

        let btS = {
          color: "#B93B3B",
          fontSize: 14,
          fontFamily: theme.fonts.fontBold,
        };

        return (
          <View
            style={{
              width: "100%",
              marginTop: 30,
            }}
          >
            <Pressable
              onPress={() => {
                const userPlanStatus =
                  utils.functions.checkUserPalnStatus(offersProfileProps);
                if (userPlanStatus) {
                  openModal({ item: item, selIndex: index }, "cancelOffer");
                }
              }}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, bc]}
            >
              <Text numberOfLines={1} ellipsizeMode="tail" style={btS}>
                Cancel Offer
              </Text>
            </Pressable>
          </View>
        );
      };

      return (
        <Pressable
          disabled
          onPress={() => {}}
          style={({ pressed }) => [
            { opacity: pressed ? 0.8 : 1.0 },
            [
              styles.modalinfoConatiner,
              {
                marginTop: index == 0 ? 10 : 0,
              },
            ],
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {renderProfile()}
            {renderText()}
          </View>
          {renderFields()}
          {renderBottom()}
        </Pressable>
      );
    }
  };

  const openModal = (obj, check) => {
    setModalObj(obj);

    if (check == "cancelOffer") setIsCancelOfferModal(true);
  };

  return (
    <>
      <View style={styles.container}>
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              style={{ marginTop: 5 }}
              contentContainerStyle={{
                paddingTop: 5,
                paddingBottom: 40,
                paddingHorizontal: 2,
              }}
              showsVerticalScrollIndicator={false}
              data={data}
              renderItem={ItemView}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={EmptyListMessage}
              ItemSeparatorComponent={ItemSeparatorView}
              ListHeaderComponent={data.length > 0 ? ListHeader : null}
            />
            {data.length > 0 && !getDataOnce && mloader && (
              <ActivityIndicator
                size={30}
                color={theme.color.button1}
                style={{
                  top: "50%",
                  position: "absolute",
                  alignSelf: "center",
                }}
              />
            )}
          </View>

          {isCancelOfferModal && (
            <utils.CancelOfferModal
              isModal={isCancelOfferModal}
              setIsModal={setIsCancelOfferModal}
              modalObj={modalObj}
              setModalObj={setModalObj}
              loader={homeModalLoder}
              check={"cancel"}
            />
          )}
        </SafeAreaView>
      </View>
    </>
  );
}
