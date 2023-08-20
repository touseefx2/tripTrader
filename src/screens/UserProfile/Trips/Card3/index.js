import React, { useState, memo } from "react";
import { View, Text, Pressable } from "react-native";
import ProgressiveFastImage from "@freakycoder/react-native-progressive-fast-image";
import { styles } from "./styles";
import store from "../../../../store/index";
import utils from "../../../../utils/index";
import theme from "../../../../theme";
import { ImageSlider } from "react-native-image-slider-banner";
import moment from "moment";
import * as Animatable from "react-native-animatable";

export default memo(Card3);

function Card3({
  item,
  index,
  user,
  props,
  isActive,
  showpic,
  animtntime,
  onClickMakeOffer,
  userSubscription,
}) {
  const [pvm, setpvm] = useState(false);
  const [pd, setpd] = useState([]);
  const [pdc, setpdc] = useState("");

  let usr = item.hostId;

  //trip
  let status = item.status || "";
  let tripPhotos = item.photos ? item.photos : [];
  let titlee = item.title || ""; //ofering
  let locName = item.location.city + ", " + item.location.state;
  let trade = item.returnActivity || ""; //for trade
  let sd = utils.functions.DateWithoutFormat(item.availableFrom);
  let sdy = parseInt(new Date(sd).getFullYear());
  let ed = utils.functions.DateWithoutFormat(item.availableTo);
  let edy = parseInt(new Date(ed).getFullYear());
  let favlbl = "";
  if (sdy == edy) {
    favlbl =
      moment(sd).format("MMM DD") + " - " + moment(ed).format("MMM DD, YYYY");
  } else {
    favlbl =
      moment(sd).format("MMM DD, YYYY") +
      " - " +
      moment(ed).format("MMM DD, YYYY");
  }

  let title = item.tradeType || "";
  let offer = item.title || "";

  let availability = item.availableFrom || "";

  let c = status == "suspended" ? true : false;
  let tc = theme.color.boxTitle;

  const renderSec2 = () => {
    const renderTripImages = () => {
      let chk =
        tripPhotos.length <= 0
          ? "0"
          : tripPhotos.length == 1
          ? "1"
          : tripPhotos.length > 1
          ? "2"
          : "0";

      return (
        <>
          {chk == "2" && (
            <>
              <View style={styles.tripImageConatiner}>
                <ImageSlider
                  showHeader={false}
                  preview={true}
                  data={tripPhotos}
                  autoPlay={false}
                />
              </View>
            </>
          )}

          {(chk == "0" || chk == "1") && (
            <>
              <Pressable
                style={({ pressed }) => [
                  { opacity: pressed ? 0.95 : 1.0 },
                  [styles.tripImageConatiner],
                ]}
                onPress={() => {
                  setpvm(true);
                  setpd(chk == "1" ? tripPhotos[0] : "");
                  setpdc(chk == "1" ? "tp" : "ph");
                }}
              >
                <ProgressiveFastImage
                  style={styles.tripImg}
                  source={
                    chk == "1"
                      ? { uri: tripPhotos[0] }
                      : require("../../../../assets/images/trip/img.jpeg")
                  }
                  loadingImageStyle={styles.imageLoader2}
                  loadingSource={require("../../../../assets/images/imgLoad/img.jpeg")}
                  blurRadius={5}
                />
              </Pressable>
            </>
          )}
        </>
      );
    };

    return <View style={styles.boxSection2}>{renderTripImages()}</View>;
  };

  const renderSec2c = () => {
    return (
      <View style={styles.boxSection2}>
        <Animatable.Image
          style={[styles.tripImageConatiner]}
          // style={styles.tripImg}
          duration={animtntime}
          easing="ease-out"
          animation={isActive ? "zoomIn" : false}
          source={require("../../../../assets/gif/stl.gif")}
        />
      </View>
    );
  };

  const renderSec3 = () => {
    return (
      <View style={styles.boxSection3}>
        <Animatable.Text
          style={styles.sec3T1}
          duration={animtntime}
          easing="ease-out"
          animation={isActive ? "zoomIn" : false}
        >
          {titlee}
        </Animatable.Text>

        <View style={styles.sec3T2Container}>
          <Animatable.Image
            style={{
              width: 20,
              height: 20,
              marginLeft: -3,
              // resizeMode: 'contain',
            }}
            duration={animtntime}
            easing="ease-out"
            animation={isActive ? "zoomIn" : false}
            source={require("../../../../assets/images/location/img.png")}
          />

          <View style={{ width: "94%" }}>
            <Animatable.Text
              style={styles.sec3T2}
              duration={animtntime}
              easing="ease-out"
              animation={isActive ? "zoomIn" : false}
            >
              {locName}
            </Animatable.Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <Animatable.Text
            style={styles.sec3T31}
            duration={animtntime}
            easing="ease-out"
            animation={isActive ? "zoomIn" : false}
          >
            In Return For
          </Animatable.Text>
          <Animatable.Text
            style={styles.sec3T32}
            duration={animtntime}
            easing="ease-out"
            animation={isActive ? "zoomIn" : false}
          >
            {trade}
          </Animatable.Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <Animatable.Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.sec3T31}
            duration={animtntime}
            easing="ease-out"
            animation={isActive ? "zoomIn" : false}
          >
            Availability
          </Animatable.Text>
          <Animatable.Text
            style={styles.sec3T32}
            duration={animtntime}
            easing="ease-out"
            animation={isActive ? "zoomIn" : false}
          >
            {favlbl}
          </Animatable.Text>
        </View>
      </View>
    );
  };

  const renderSec33 = () => {
    return (
      <View style={styles.boxSection3}>
        <Animatable.Text
          style={styles.sec3T1}
          duration={animtntime}
          easing="ease-out"
          animation={isActive ? "zoomIn" : false}
        >
          {titlee}
        </Animatable.Text>

        <View style={styles.sec3T2Container}>
          <Animatable.Image
            style={{
              width: 20,
              height: 20,
              marginLeft: -3,
              // resizeMode: 'contain',
            }}
            duration={animtntime}
            easing="ease-out"
            animation={isActive ? "zoomIn" : false}
            source={require("../../../../assets/images/location/img.png")}
          />

          <View style={{ width: "94%" }}>
            <Animatable.Text
              style={styles.sec3T2}
              duration={animtntime}
              easing="ease-out"
              animation={isActive ? "zoomIn" : false}
            >
              {locName}
            </Animatable.Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <Animatable.Text
            style={styles.sec3T31}
            duration={animtntime}
            easing="ease-out"
            animation={isActive ? "zoomIn" : false}
          >
            In Return For
          </Animatable.Text>
          <Animatable.Text
            style={styles.sec3T32}
            duration={animtntime}
            easing="ease-out"
            animation={isActive ? "zoomIn" : false}
          >
            {trade}
          </Animatable.Text>
        </View>
        <View
          style={{
            marginTop: 10,
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: "60%" }}>
            <Animatable.Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.sec3T31}
              duration={animtntime}
              easing="ease-out"
              animation={isActive ? "zoomIn" : false}
            >
              Availability
            </Animatable.Text>
            <Animatable.Text
              style={styles.sec3T32}
              duration={animtntime}
              easing="ease-out"
              animation={isActive ? "zoomIn" : false}
            >
              {favlbl}
            </Animatable.Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              { opacity: pressed ? 0.8 : 1.0 },
              styles.buttonContainer,
            ]}
            onPress={() => {
              if (
                (userSubscription && userSubscription?.status !== "active") ||
                !userSubscription
              ) {
                props.navigation.navigate("Plan");
              } else {
                onClickMakeOffer({ item: item, selIndex: index }, "offer");
              }
            }}
          >
            <Text style={styles.buttonText}>Make Offer</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <>
      {pvm && (
        <utils.FullimageModal
          data={[]}
          si={0}
          show={pvm}
          pd={pd}
          pdc={pdc}
          closModal={() => {
            setpvm(!pvm);
            setpd("");
            setpdc("");
          }}
        />
      )}
      <Animatable.View
        duration={300}
        transition="backgroundColor"
        style={{
          backgroundColor: isActive
            ? "rgba(255,255,255,1)"
            : "rgba(245,252,255,1)",
        }}
      >
        {isActive && (
          <>
            {!showpic ? renderSec2() : renderSec2c()}
            {c && renderSec3()}
            {!c && renderSec33()}
          </>
        )}
      </Animatable.View>
    </>
  );
}
