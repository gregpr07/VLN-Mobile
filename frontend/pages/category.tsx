import React, { useState } from "react";
import { StyleSheet, View, Text, Image, FlatList } from "react-native";
import { useTheme } from "@react-navigation/native";

const Category = ({ navigation }: any) => {
  const { colors, dark } = useTheme();

  const padding: number = 12;
  const [eventinfo, setEventInfo] = useState();

  const SubCats = () => {
    //const speeds = [1, 1.25, 1.5, 2];
    const subcats = ["big data", "machine learning", "programming"];

    const Cat = ({ item }) => (
      <View
        style={[
          styles.default_card,
          {
            flex: 1,
            //maxWidth: 150,
            //marginRight: index !== speeds.length - 1 ? padding : 0,
          },
        ]}
      >
        <Text
          style={{
            textAlign: "center",
            color: colors.text,
            fontFamily: "SF-UI-medium",
          }}
        >
          {item}
        </Text>
      </View>
    );
    return (
      <FlatList
        data={subcats}
        renderItem={Cat}
        keyExtractor={(item) => item}
        ItemSeparatorComponent={() => <View style={{ marginLeft: padding }} />}
        horizontal
        //snapToInterval={AUTHOR_WIDTH + SEPARATOR_WIDTH}
        showsHorizontalScrollIndicator={false}
        decelerationRate={0}
        ListHeaderComponent={() => <View style={{ marginLeft: padding }} />}
      />
    );
  };

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

  return (
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
        <SubCats />
      </View>
    </View>
  );
};

export default Category;
