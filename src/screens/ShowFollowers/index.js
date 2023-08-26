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

export default observer(ShowFollowers);

function ShowFollowers(props) {
  const {
    check,
    user,
    userName: headerTitle,
    callingScreen,
  } = props?.route?.params;
  const { isInternet } = store.General;

  const [data, setdata] = useState([]);
  const [refreshing, setrefreshing] = useState(false);
  const [getDataOnce, setgetDataOnce] = useState(false);

  useEffect(() => {
    if (!getDataOnce && isInternet) {
      getDbData();
    }
  }, [getDataOnce, isInternet]);
  const onRefresh = React.useCallback(() => {
    console.log("onrefresh cal");

    getDbData();
  }, []);
  const getDbData = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        if (check === "followers") {
          store.Userv.attemptToGetFollowers(
            user._id,
            setgetDataOnce,
            () => {},
            () => {},
            setdata,
            setrefreshing
          );
        } else {
          store.Userv.attemptToGetFollowing(
            user._id,
            setgetDataOnce,
            () => {},
            () => {},
            setdata,
            setrefreshing
          );
        }
      }
    });
  };
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
            {check === "followers"
              ? "No Followers Found"
              : `Not Following Anyone Yet`}
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
          utils.functions.goToUserProfile(props, usrr, usrr?._id.toString());
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
            />
          </View>

          <utils.Footer
            nav={props.navigation}
            screen={"Followers"}
            focusScreen={store.General.focusScreen}
          />
        </SafeAreaView>
      </View>
    </>
  );
}
