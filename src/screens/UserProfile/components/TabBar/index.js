import React, { memo, useState } from "react";
import { View } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import Reviews from "../../Reviews";
import Trips from "../../Trips";
import Photos from "../../Photos";

export default memo(TabBar);

function TabBar({ props }) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "reviews", title: "Reviews" },
    { key: "trips", title: "Trips" },
    { key: "photos", title: "Photos" },
  ]);
  const renderScene = SceneMap({
    // trips: () => <Trips p={props} />,
    // reviews: Reviews,
    // trips: Trips,
    // photos: Photos,

    reviews: () => <Reviews p={props} />,
    trips: () => <Trips p={props} />,
    photos: () => <Photos p={props} />,
  });

  return (
    <>
      <View
        style={{
          paddingHorizontal: 15,
          flex: 1,
          marginTop: 10,
        }}
      >
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
        />
      </View>
    </>
  );
}
