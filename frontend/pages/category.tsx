import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";

import { noHeadFetcher } from "../services/fetcher";

import { ActivityView, Categories as SubCats } from "../components/Components";

import Lectures from "../components/LecturesList";
import { loading } from "../services/actions";

const Category = ({ navigation, route }: any) => {
  const { colors, dark } = useTheme();

  const { categoryID } = route.params;

  const padding: number = 12;

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  //const { data: category } = useSWR(`category/${categoryID}/`, noHeadFetcher);

  useEffect(() => {
    setLoading(true);
    noHeadFetcher(`category/${categoryID}/`).then((json) => {
      setCategory(json);
      setLoading(false);
    });
  }, [categoryID]);

  useEffect(() => {
    navigation.setOptions({
      title: category ? category.name : "",
    });
  }, [category]);

  const styles = StyleSheet.create({
    viewPager: {
      flex: 1,
    },
    page: {
      justifyContent: "center",
      alignItems: "center",
    },
    default_card: {
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowRadius: 19,
      shadowOpacity: 1,

      backgroundColor: colors.card,

      marginTop: padding,

      padding: padding,
      borderRadius: 12,
    },
  });

  if (!category || loading) return <ActivityView color={colors.primary} />;

  const ListHeaderComponent = () => (
    <View>
      <View
        style={{
          width: "100%",
          paddingHorizontal: 0,
        }}
      >
        <Image
          source={{
            uri:
              "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F000%2F385%2F812%2Foriginal%2Fillustration-of-characters-and-computer-science-concept-vector.jpg&f=1&nofb=1",
          }}
          style={{
            height: 200,
            resizeMode: "cover",
          }}
        />
        <SubCats
          cats={category.children}
          navigation={navigation}
          padding={padding}
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
    </View>
  );

  return (
    <Lectures
      navigation={navigation}
      HeaderComponent={ListHeaderComponent}
      padding={padding}
      styles={styles}
      //lectures={category.lectures}
      fetchurl={`category/${categoryID}/lectures/`}
    />
  );
};

export default Category;
