import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { styles } from "./styles";
import { observer } from "mobx-react";
import store from "../../store/index";
import theme from "../../theme";
import Notifications from "../../screens/Notifications";
import NotificationsGuest from "../../screens/NotificationsGuest";

export default observer(DrawerHeader);
function DrawerHeader(props) {
  const prop = props.props;
  const headerTitle = props.headerTitle || "";
  const countRead = store.Notifications.unread;

  const [isShowNotifiction, setIsShowNotifiction] = useState(false);
  const [isShowGuestNotifiction, setIsShowGuestNotifiction] = useState(false);

  const render1 = () => {
    const onClick = () => {
      prop.navigation.openDrawer();
    };
    const src = require("../../assets/images/drawers/img.png");
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={onClick}>
        <Image source={src} style={styles.drawerIcon} />
      </TouchableOpacity>
    );
  };

  const render2 = () => {
    return (
      <View style={{ width: "74%" }}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.headerTitle}>
          {headerTitle}
        </Text>
      </View>
    );
  };

  const render3 = () => {
    const onClick = () => {
      if (store.User.user != "guest") setIsShowNotifiction(true);
      else setIsShowGuestNotifiction(true);
    };
    const src = require("../../assets/images/bell/img.png");
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onClick}>
        <Image source={src} style={styles.bellIcon} />
        {countRead > 0 && <View style={styles.dot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.headerConatainer}>
      {isShowNotifiction ? (
        <Notifications
          props={prop}
          callingScreen={headerTitle}
          isShowModal={isShowNotifiction}
          setIsShowModal={setIsShowNotifiction}
        />
      ) : (
        <NotificationsGuest
          props={prop}
          callingScreen={headerTitle}
          isShowModal={isShowGuestNotifiction}
          setIsShowModal={setIsShowGuestNotifiction}
        />
      )}
      {render1()}
      {render2()}
      {render3()}
    </View>
  );
}
