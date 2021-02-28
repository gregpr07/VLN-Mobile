// @ts-ignore
import Carousel from "react-native-snap-carousel";

import React, { useState } from "react";

const CarouselPlatform = ({ events, EventCard, width, padding, itemWidth }) => (
  <Carousel
    data={events}
    renderItem={EventCard}
    sliderWidth={width}
    itemWidth={itemWidth}
    //layout={"stack"}
    layout={"stack"}
    activeSlideAlignment="start"
    containerCustomStyle={{
      paddingStart: padding,
    }}
  />
);

export default CarouselPlatform;
