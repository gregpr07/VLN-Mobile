import React, { useState,useEffect } from "react";
import { StyleSheet, View, Text, Image,ScrollView,TouchableOpacity,FlatList,Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

import { noHeadFetcher } from "../services/fetcher";

import { useTheme } from "@react-navigation/native";

import { ActivityView } from '../components/Components'

import { Categories } from '../components/Components'

import { shorterText, numberWithCommas } from "../services/functions";


import { connect } from "react-redux";
import { setVideoID } from "../services/actions";



const padding = 14;

const Author = ({ navigation, route,videoRef,audioRef,setVidID }: any) => {
  const { colors, dark } = useTheme();

  const { authorID } = route.params;


  const [author,setAuthor] = useState(null)


    useEffect(() => {
    noHeadFetcher(`author/${authorID}/`).then(json => setAuthor(json))
  }, [authorID]);

  useEffect(() => {
    navigation.setOptions({
      title: author ? author.name : '',
    });
  }, [author])

  if (!author) {
    return <ActivityView color={colors.primary}/>;
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
            shadowColor: colors.shadow,
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowRadius: 19,
            shadowOpacity: 1,

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

              borderColor: colors.card,
              borderWidth: 4,
            }}
          />
        </View>
        <Text style={styles.h3}>{author.views} views in total</Text>
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
        />
        
      <Text style={styles.h1}>Top lectures</Text>
      </View>
  )

  const Lectures = () => {

    const _handleResultsClick = async (item) => {
    if (videoRef) {
      await videoRef.unloadAsync();
      await audioRef.unloadAsync();
    }

    setVidID(item.id);
    navigation.navigate("Player", {
      screen: "Video",
    });
  };

  const Separator = () => (
    <Text
      style={{
        color: "#5468fe",
      }}
    >
      {" "}
      |{" "}
    </Text>
  );
  const RenderItem = ({ item }: any) => (
    <View style={styles.default_card}>
      <TouchableOpacity
        onPress={() => _handleResultsClick(item)}
        //key={item.title}
        style={styles.recommendation}
      >
        <Image
          source={item.thumbnail ? {
            uri: item.thumbnail,
          } :  dark
              ? require("../assets/icons/videolecture-net-dark.png")
              : require("../assets/icons/videolecture-net-light.png")}
          style={{
            height: 80,
            maxWidth: (80 / 9) * 16,
            flex: 3,

            borderBottomLeftRadius: 12,
            borderTopLeftRadius: 12,
            resizeMode: item.thumbnail ? "cover" : 'contain',
          }}
        />
        <View style={{ flex: 4, padding: 6, alignContent: "center" }}>
          <Text style={[styles.h4]}>{shorterText(item.title, 75)}</Text>
          <View>
            <Text style={[styles.h5, { color: colors.secondary }]}>
              {item.author}
              <Separator />
              {numberWithCommas(item.views)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );


    return (
      <View style={{ flex: 1,paddingHorizontal:padding}}>
       
        
        <FlatList
          data={author.lectures}
          renderItem={RenderItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={<ListHeaderComponent />}
          ListFooterComponent={() => <View style={{ marginBottom: padding }} />}
          //getNativeScrollRef={(ref) => (flatlistRef = ref)}
          keyboardDismissMode={"on-drag"}
          numColumns={width / 600 > 1 ? 2 : 1}
        />
      </View>
    )
  }

 


  const styles = StyleSheet.create({
    viewPager: {
      flex: 1,
    },
    page: {
      justifyContent: "center",
      alignItems: "center",
    },
        h1: {
      fontSize: 24,
      fontFamily: "SF-UI-semibold",
          color: colors.text,
          paddingTop: padding,
          textAlign:'center'
      
    },
    h3: {
      fontSize: 17,
      fontFamily: "SF-UI-semibold",
      color: colors.secondary,
      padding: padding,
      paddingBottom:0
    },
     h4: {
      paddingBottom: 2,
      fontSize: 14,
      fontFamily: "SF-UI-medium",
      color: colors.text,
    },
    h5: {
      fontSize: 12,
      fontFamily: "SF-UI-medium",
    },
        recommendation: {
      flexDirection: "row",
    },
    default_card: {
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowRadius: 19,
      shadowOpacity: 1,

      marginTop: padding,
      backgroundColor: colors.card,
      //padding: padding,
      borderRadius: 15,

      maxWidth: 500,

      flex: 1,
    },
  });

  return (


        
        <Lectures/>

    

  );
};

const mapStateToProps = (state) => ({
  videoID: state.video.videoID,
  videoRef: state.video.videoRef,
  audioRef: state.video.audioRef,
});

const mapDispatchToProps = (dispatch) => ({
  setVidID: (num: number) => dispatch(setVideoID(num)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Author);
