import React from "react";
import { View, Text, ScrollView } from "react-native";
import { styles } from "./styles";
import Bottom from "./components/Bottom";
import ProgressiveFastImage from "@freakycoder/react-native-progressive-fast-image";

export default function Report({ modalObj, isMaxHeight, closeModal }) {
  const { item } = modalObj;

  const renderMain = () => {
    let userName = "";
    let photo = "";
    if (item) {
      userName = item.firstName + " " + item.lastName;
      photo = item.image ? item.image : "";
    }
    return (
      <>
        <View style={styles.mainContainer}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            Report User
          </Text>
        </View>

        <View style={styles.main1}>
          <View style={styles.mProfileImgContainerss}>
            <ProgressiveFastImage
              style={styles.mProfileImgss}
              source={
                photo != ""
                  ? { uri: photo }
                  : require("../../../../assets/images/drawer/guest/img.png")
              }
              loadingImageStyle={styles.mimageLoader}
              loadingSource={require("../../../../assets/images/imgLoad/img.jpeg")}
              blurRadius={5}
            />
          </View>

          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title1}>
            {userName}
          </Text>

          <View style={{ width: "93%", alignSelf: "center" }}>
            <Text style={styles.title3}>
              Thank You! We will review your comments and take any necessary
              actions.
            </Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      {isMaxHeight ? (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {renderMain()}
        </ScrollView>
      ) : (
        <>{renderMain()}</>
      )}

      <Bottom isMaxHeight={isMaxHeight} closeModal={closeModal} />
    </>
  );
}
