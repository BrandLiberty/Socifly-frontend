import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import BirthdayPost from '../posts/BirthdayPost';
import Post2 from '../posts/Post2';
import { FETCH } from '../../services/fetch';
import { useProfile, useLocal } from '../../context/ProfileContext';
import GoogleAds from '../Ads/GoogleAds'
const PostArray = ({ navigation }) => {
  const { localState, localDispatch } = useLocal();
  const { profileState, dispatch } = useProfile();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Initially, set loading to true

  async function getImages() {
    try {
      const { status, data } = await FETCH('GET', '/home/get-images', { lang: localState.lang });
      if (status === 200) {
        setPosts(data.data);
        localDispatch({
          type: 'IMAGES',
          payload: data.data,
        });
      } else {
        // Handle the error and set the modal accordingly
        // Assuming setModal is defined and working as expected
        setModal({
          visible: true,
          message: data.message,
          navigationPage: 'LoginScreen',
          onClose: () => {
            setShowModal(false);
          },
        });
        setShowModal(true);
      }
    } catch (error) {
      console.log('Error fetching images:', error);
    } finally {
      setLoading(false); // Set loading to false when the fetch is complete
    }
  }

  useEffect(() => {
    const load = async () => {
      console.log('Post Array Updating Posts');
      await getImages();
      console.log('Post Array Updated Posts');
      
    };
    load();
  }, [localState.lang]);

  useEffect(() => {
    setPosts(localState.images);
  }, [localState]);

  return (
    <View style={styles.postArrayContainer}>
      {loading ? ( // Show the loader if loading is true
        <ActivityIndicator size="large" color="blue" />
      ) : (
        posts.map((post, i) => {
          if (i % 4 === 0 && i !== 0) {
            return <GoogleAds key={i} />;
          } else if (post?.category?.type === 'Birthday' || post?.category?.type === 'birthday') {
            return (
              <BirthdayPost key={post._id} source={profileState.server + post.path} navigation={navigation} id={post._id} />
            );
          } else {
            return (
              <Post2 key={post._id} source={profileState.server + post.path} navigation={navigation} id={post._id} />
            );
          }
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  postArrayContainer: {
    marginVertical: 10, // Adjust this value as needed
  },
});

export default PostArray;
