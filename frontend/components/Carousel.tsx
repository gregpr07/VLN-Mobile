import React, { useState } from "react";

import { View, FlatList } from "react-native";

const CarouselPlatform = ({ events, EventCard, width, padding, itemWidth }) => (
  <FlatList
    data={events.results}
    ListHeaderComponent={() => <View style={{ paddingLeft: padding }} />}
    renderItem={EventCard}
    keyExtractor={(item) => item.id}
    ItemSeparatorComponent={() => <View style={{ paddingLeft: padding }} />}
    horizontal
    //snapToInterval={AUTHOR_WIDTH + SEPARATOR_WIDTH}
    showsHorizontalScrollIndicator={false}
    decelerationRate={0}
  />
);

export default CarouselPlatform;
