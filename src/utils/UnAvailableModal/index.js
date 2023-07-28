import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { styles } from "./styles";
import Header from "./components/Header";
import Title from "./components/Title";
import Bottom from "./components/Bottom";
import Calender from "./components/Calender";
import theme from "../../theme";
import utils from "../../utils";

export default function UnAvailableModal({
  isModal,
  setIsModal,
  unAvailable,
  setUnAvailble,
  minDate,
  maxDate,
  totalDays,
}) {
  const maxModalHeight = theme.window.Height - 70;
  const weekList = [
    { _id: 1, name: "Sun", num: 0, isSel: false },
    { _id: 2, name: "Mon", num: 1, isSel: false },
    { _id: 3, name: "Tue", num: 2, isSel: false },
    { _id: 4, name: "Wed", num: 3, isSel: false },
    { _id: 5, name: "Thu", num: 4, isSel: false },
    { _id: 6, name: "Fri", num: 5, isSel: false },
    { _id: 7, name: "Sat", num: 6, isSel: false },
  ];
  const [isMaxHeight, setIssMaxHeight] = useState(false);
  const [modalHeight, setmodalHeight] = useState(0);
  const [unavailableDates, setUnavailableDates] = useState(null);
  const [unavailableDatesText, setUnavailableDatesText] = useState("");
  const [unavailableWeeksDates, setUnavailableWeeksDates] = useState(null);
  const [isShowCalender, setIsShowCalender] = useState(false);
  const [daysOfWeeks, setDaysOfWeeks] = useState(weekList); //days of week

  useEffect(() => {
    if (unAvailable) {
      let weekArr = [];
      let dateList = [];
      setUnavailableWeeksDates(unAvailable.unavailableDaysOfWeek);
      unAvailable.excludeSpecificDates.forEach((date) => {
        dateList[date] = theme.dayStyle.markeDateStyle;
      });
      weekList.forEach((item) => {
        const obj = { ...item };
        const isFind = unAvailable.daysOfWeek.find(
          (element) => element === item.name
        );
        if (isFind != undefined) obj.isSel = true;
        weekArr.push(obj);
      });
      setUnavailableDates(dateList);
      setDaysOfWeeks(weekArr);
    }
  }, [unAvailable]);

  useEffect(() => {
    setIssMaxHeight(modalHeight >= maxModalHeight ? true : false);
  }, [modalHeight]);

  useEffect(() => {
    const arr = utils.functions.getWeekDaysBtwnDate(
      daysOfWeeks,
      minDate,
      maxDate
    );
    setUnavailableWeeksDates(arr);
  }, [daysOfWeeks]);

  useEffect(() => {
    if (unavailableDates) {
      setUnavailableDatesText(
        utils.functions.getDateWithFormat(unavailableDates)
      );
    } else setUnavailableDatesText("");
  }, [unavailableDates]);

  const onViewLayout = (event) => {
    if (!isMaxHeight) {
      const { height } = event.nativeEvent.layout;
      setmodalHeight(height);
    }
  };

  const closeModal = () => {
    setIsModal(false);
  };

  const openCalender = () => {
    setIsShowCalender(true);
  };

  const onClickSave = () => {
    const obj = utils.functions.getUnavailableDaysObject(
      daysOfWeeks,
      unavailableDates,
      unavailableWeeksDates,
      unavailableDatesText,
      minDate,
      maxDate,
      totalDays
    );

    if (obj === undefined) return;

    setUnAvailble(obj);
    closeModal();
  };

  const renderWeek = () => {
    const onClickDay = (index) => {
      const arr = daysOfWeeks.slice();
      arr[index].isSel = !arr[index].isSel;
      setDaysOfWeeks(arr);
    };

    const renderShowData = () => {
      const days = daysOfWeeks.map((item, index, arr) => {
        return (
          <TouchableOpacity
            activeOpacity={0.6}
            style={[
              styles.dayContainer,
              {
                marginRight: index <= arr.length - 1 ? 15 : 0,
              },
            ]}
            onPress={() => onClickDay(index)}
          >
            <View
              style={[
                styles.dayCheckBox,
                {
                  backgroundColor: !item.isSel ? "white" : theme.color.button1,
                },
              ]}
            >
              {item.isSel && (
                <utils.vectorIcon.FontAwesome5
                  name={"check"}
                  color={theme.color.buttonText}
                  size={11}
                />
              )}
            </View>
            <Text style={styles.dayText}>{item.name}</Text>
          </TouchableOpacity>
        );
      });

      return days;
    };

    return (
      <View style={styles.fieldWrapper}>
        <Text style={styles.fieldTitle}>Days of Week</Text>
        <View style={styles.fieldContainer}>{renderShowData()}</View>
      </View>
    );
  };

  const renderOtherDates = () => {
    return (
      <>
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldTitle}>Exclude Specific Dates</Text>

          <Pressable
            onPress={openCalender}
            style={({ pressed }) => [
              { opacity: pressed ? 0.8 : 1.0 },
              [styles.inputContainer],
            ]}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styles.inputText,
                {
                  color:
                    unavailableDatesText == ""
                      ? theme.color.subTitleLight
                      : theme.color.title,
                },
              ]}
            >
              {unavailableDatesText == ""
                ? "Select dates this trip is not available"
                : unavailableDatesText}
            </Text>
            <View style={styles.inputIconContainer}>
              <Image
                source={require("../../assets/images/cal/img.png")}
                style={styles.inputIcon}
              />
            </View>
          </Pressable>
        </View>
      </>
    );
  };

  return (
    <Modal visible={isModal} transparent onRequestClose={closeModal}>
      <SafeAreaView style={styles.modalContainer}>
        <View
          onLayout={onViewLayout}
          style={[
            styles.modal,
            isMaxHeight
              ? { height: maxModalHeight, paddingTop: 0 }
              : { padding: 15 },
          ]}
        >
          <Header
            title={"Set Unavailable Days"}
            closeModal={closeModal}
            isMaxHeight={isMaxHeight}
          />

          {isMaxHeight ? (
            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 15 }}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
            >
              <Title />
              {renderWeek()}
              {renderOtherDates()}
            </ScrollView>
          ) : (
            <>
              <Title />
              {renderWeek()}
              {renderOtherDates()}
            </>
          )}
          <Bottom
            isMaxHeight={isMaxHeight}
            goBack={closeModal}
            onClickSave={onClickSave}
          />

          {isShowCalender && (
            <Calender
              isShowCalender={isShowCalender}
              setIsShowCalender={setIsShowCalender}
              minDate={minDate}
              maxDate={maxDate}
              unavailableDates={unavailableDates}
              setUnavailableDates={setUnavailableDates}
              unavailableWeeksDates={unavailableWeeksDates}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
