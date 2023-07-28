import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  FlatList,
  RefreshControl,
} from "react-native";
import ProgressiveFastImage from "@freakycoder/react-native-progressive-fast-image";
import { styles } from "./styles";
import { observer } from "mobx-react";
import store from "../../store/index";
import utils from "../../utils/index";
import theme from "../../theme";
import NetInfo from "@react-native-community/netinfo";

export default observer(ShowOtherFollowers);

function ShowOtherFollowers(props) {
  const chk = store.User.chk;
  const headerTitle = store.User.fuser;
  const fscreen = store.User.fscreen || "";
  let db = false;
  if (fscreen == "Home") {
    db = true;
  }

  const { isInternet } = store.General;
  const { user } = store.Userv;

  const [followers, setfollowers] = useState(0);
  const [following, setfollowing] = useState(0);
  const [data, setdata] = useState([]);

  const [refreshing, setrefreshing] = useState(false);

  const total = chk == "followers" ? followers : following;

  const [getDataOnce, setgetDataOnce] = useState(false);
  const setGetDataOnce = (C) => {
    setgetDataOnce(C);
  };

  const onRefresh = React.useCallback(() => {
    console.warn("onrefresh cal");

    getDbData();
  }, []);
  const getDbData = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        if (chk == "followers") {
          store.Userv.attemptToGetFollowers(
            user._id,
            setGetDataOnce,
            (c) => setfollowers(c),
            (c) => setfollowing(c),
            (c) => setdata(c),
            (c) => setrefreshing(c)
          );
        } else {
          store.Userv.attemptToGetFollowing(
            user._id,
            setGetDataOnce,
            (c) => setfollowers(c),
            (c) => setfollowing(c),
            (c) => setdata(c),
            (c) => setrefreshing(c)
          );
        }
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
          height: 10,
        }}
      />
    );
  };

  const EmptyListMessage = () => {
    return (
      // Flat List Item
      <>
        {!refreshing && getDataOnce && (
          <Text
            style={{
              marginTop: "80%",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: 13,
              color: theme.color.title,
              fontFamily: theme.fonts.fontMedium,
              opacity: 0.4,
            }}
            onPress={() => getItem(item)}
          >
            {chk == "followers"
              ? "No Followers Found"
              : `${user.firstName} ${user.lastName} are not following anyone yet`}
          </Text>
        )}
      </>
    );
  };

  const ItemView = ({ item, index }) => {
    const usrr = item.userId;
    //user
    let photo = "";
    let userName = "undefined";
    if (usrr) {
      photo = usrr.image || "";
      userName = usrr.firstName + " " + usrr.lastName;
    }

    const renderProfile = () => {
      return (
        <View style={styles.mProfileImgContainer}>
          <ProgressiveFastImage
            style={styles.mProfileImg}
            source={
              photo != ""
                ? { uri: photo }
                : require("../../assets/images/drawer/guest/img.png")
            }
            loadingImageStyle={styles.mimageLoader}
            loadingSource={require("../../assets/images/imgLoad/img.jpeg")}
            blurRadius={5}
          />
          {/* {isVeirfy && (
            <Image
              style={styles.miconVerify}
              source={require('../../assets/images/verified/img.png')}
            />
          )} */}
        </View>
      );
    };

    const renderText = () => {
      return (
        <View style={styles.mtextContainer}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color: "#3C6B49",
              fontSize: 15,
              fontFamily: theme.fonts.fontBold,

              textTransform: "capitalize",
            }}
          >
            {userName}
          </Text>
        </View>
      );
    };

    const isDisable = store.User.user._id == usrr?._id || !usrr ? true : false;

    return (
      <Pressable
        disabled={isDisable}
        onPress={() => {
          store.Userv.setfscreen("home");
          store.Userv.setUser(usrr);
          store.Userv.addauthToken(store.User.authToken);
          props.navigation.navigate("UserProfile");
        }}
        style={({ pressed }) => [
          { opacity: pressed ? 0.8 : 1.0 },
          [styles.modalinfoConatiner, { marginTop: index == 0 ? 15 : 0 }],
        ]}
      >
        {renderProfile()}
        {renderText()}
      </Pressable>
    );
  };

  const ListHeader = () => {
    let t = chk == "followers" ? "Followers" : "Following";
    let num = total;
    return (
      <View style={{ width: "100%" }}>
        <Text
          style={{
            color: "#101B10",
            fontSize: 16,
            fontFamily: theme.fonts.fontBold,

            textTransform: "capitalize",
          }}
        >
          {t} ({num})
        </Text>
      </View>
    );
  };

  const ListFooter = () => {
    return (
      <>
        <View>
          <View style={styles.listFooter}>
            <Text style={styles.listFooterT}>End of results</Text>
          </View>
        </View>
      </>
    );
  };

  console.log("data : ", data);

  return (
    <>
      <View style={styles.container}>
        <utils.StackHeader
          bell={true}
          props={props}
          headerTitle={headerTitle}
          screen={"followers"}
        />
        {!isInternet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              contentContainerStyle={{
                paddingVertical: 15,
                paddingHorizontal: 15,
              }}
              data={data}
              renderItem={ItemView}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={EmptyListMessage}
              ItemSeparatorComponent={ItemSeparatorView}
              // ListHeaderComponent={data.length > 0 ? ListHeader : null}
              // ListFooterComponent={data.length > 0 ? ListFooter : null}
            />
          </View>

          <utils.Footer
            doubleBack={db}
            nav={props.navigation}
            screen={"Followers"}
            focusScreen={store.General.focusScreen}
          />
        </SafeAreaView>
      </View>
    </>
  );
}
