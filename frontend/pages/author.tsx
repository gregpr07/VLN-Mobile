import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");

import defaultStyles from "../constants/DefaultStyleSheet";

import { noHeadFetcher } from "../services/fetcher";

import { useTheme } from "@react-navigation/native";

import { ActivityView } from "../components/Components";

import Categories from "../components/CategoriesList";

import Lectures from "../components/LecturesList";

import { shorterText, numberWithCommas } from "../services/functions";
import Container from "../components/Container";

const padding = 14;

const Author = ({ navigation, route }: any) => {
  const { colors, dark } = useTheme();

  const { authorID } = route.params;

  const [author, setAuthor] = useState(null);

  useEffect(() => {
    noHeadFetcher(`author/${authorID}/`).then((json) => setAuthor(json));
  }, [authorID]);

  useEffect(() => {
    navigation.setOptions({
      title: author ? author.name : "",
    });
  }, [author]);

  if (!author) {
    return <ActivityView color={colors.primary} />;
  }

  const Header = () => {
    const AUTHOR_WIDTH = 150;
    return (
      <View
        style={{
          alignItems: "center",
        }}
      >
        <View
          style={{
            ...defaultStyles.shadow,

            borderRadius: AUTHOR_WIDTH,
          }}
        >
          <Image
            source={
              author.image
                ? {
                    uri: author.image,
                  }
                : require(`../assets/icons/profile_image.png`)
            }
            style={{
              height: AUTHOR_WIDTH,
              width: AUTHOR_WIDTH,
              borderRadius: AUTHOR_WIDTH,

              resizeMode: "cover",

              marginBottom: 5,
            }}
          />
        </View>
        <Text style={styles.h3}>
          {numberWithCommas(author.views)} views in total
        </Text>
      </View>
    );
  };

  const ListHeaderComponent = () => (
    <View>
      <Header />

      <Categories
        cats={author.categories}
        navigation={navigation}
        colors={colors}
        padding={padding}
        HeaderPadding={padding}
      />

      <Text
        style={{
          fontSize: 24,
          fontFamily: "SF-UI-semibold",
          color: colors.text,
          paddingTop: padding,
          textAlign: "center",
        }}
      >
        Top lectures
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    viewPager: {
      flex: 1,
    },
    page: {
      justifyContent: "center",
      alignItems: "center",
    },

    h3: {
      fontSize: 17,
      fontFamily: "SF-UI-semibold",
      color: colors.secondary,
      padding: padding,
      paddingBottom: 0,
    },
    h4: {
      paddingBottom: 2,
      fontSize: 14,
      fontFamily: "SF-UI-medium",
      color: colors.text,
    },
    h5: {
      fontSize: 14,
      fontFamily: "SF-UI-semibold",
    },
  });

  return (
    <Container>
      <Lectures
        navigation={navigation}
        HeaderComponent={ListHeaderComponent}
        padding={padding}
        styles={styles}
        //lectures={author.lectures}
        fetchurl={`author/${authorID}/lectures_most_viewed/`}
      />
    </Container>
  );
};

export default Author;
