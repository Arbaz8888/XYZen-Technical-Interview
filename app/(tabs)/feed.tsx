import 'react-native-get-random-values';
import { supabase } from '../../supabaseClient';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect, useRef } from 'react';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { feedStyles as styles } from '../../styles/feedStyles';

const { height } = Dimensions.get('window');

export default function FeedScreen() {
  const [clips, setClips] = useState<{ id: string; source: { uri: string } }[]>([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFooter, setShowFooter] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const videoRefs = useRef<{ [key: string]: Video | null }>({});
  const footerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching videos:', error);
        setLoading(false);
        return;
      }

      const loadedClips = data.map((item) => ({
        id: item.id,
        source: { uri: item.video_url },
      }));

      setClips(loadedClips);
      setLoading(false);
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const isLast = visibleIndex === clips.length - 1;
    if (isLast && clips.length > 0 && !showFooter) {
      setShowFooter(true);
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(footerOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => setShowFooter(false));
        }, 2000);
      });
    }
  }, [visibleIndex, clips.length]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        Object.values(videoRefs.current).forEach((video) => {
          video?.pauseAsync?.();
        });
      };
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      const currentClip = clips[visibleIndex];
      const currentVideo = currentClip ? videoRefs.current[currentClip.id] : null;

      if (currentVideo) {
        currentVideo.playAsync?.();
      }

      return () => {
        Object.values(videoRefs.current).forEach((video) => {
          video?.pauseAsync?.();
        });
      };
    }, [visibleIndex, clips])
  );

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const originalUri = asset.uri;
      const fileExt = originalUri.split('.').pop() || 'mp4';
      const fileName = `${Date.now()}.${fileExt}`;
      const newPath = `${FileSystem.cacheDirectory}${fileName}`;

      try {
        await FileSystem.copyAsync({ from: originalUri, to: newPath });

        const fileInfo = await FileSystem.getInfoAsync(newPath);
        if (!fileInfo.exists || fileInfo.size === 0) {
          console.error('❌ File missing or 0 bytes:', fileInfo);
          return;
        }

        const fileBlob = {
          uri: newPath,
          name: fileName,
          type: 'video/mp4',
        } as any;

        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(fileName, fileBlob, {
            contentType: fileBlob.type,
            upsert: true,
          });

        if (uploadError) {
          console.error('❌ Upload error:', uploadError);
          return;
        }

        const { data: urlData } = supabase.storage.from('videos').getPublicUrl(fileName);
        const publicURL = urlData?.publicUrl;

        const { error: insertError, data: inserted } = await supabase
          .from('videos')
          .insert([{ video_url: publicURL }])
          .select()
          .single();

        if (insertError) {
          console.error('❌ DB Insert error:', insertError);
          return;
        }

        setClips([{ id: inserted.id, source: { uri: publicURL } }, ...clips]);
        console.log('✅ Upload complete:', publicURL);
      } catch (err) {
        console.error('❌ Unexpected upload error:', err);
      }
    }
  };

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const currentIndex = viewableItems[0].index;
      setVisibleIndex(currentIndex);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const handleLike = () => {
    console.log('Liked');
  };

  const handleComment = () => {
    setShowCommentModal(true);
  };

  const handleShare = () => {
    console.log('Shared');
  };

  const handleSubmitComment = () => {
    console.log('Comment submitted:', commentText);
    setCommentText('');
    setShowCommentModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? null : clips.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="videocam" size={48} color="#888" />
          <Text style={styles.emptyText}>No videos yet</Text>
          <Text style={styles.emptySubText}>Tap + to upload your first clip</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={clips}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              const isVisible = index === visibleIndex;
              return (
                <View style={styles.clip}>
                  <Video
                    ref={(ref) => (videoRefs.current[item.id] = ref)}
                    source={item.source}
                    rate={1.0}
                    volume={1.0}
                    isMuted={!isVisible}
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay={isVisible}
                    isLooping
                    style={styles.video}
                  />
                  <View style={styles.actionsRow}>
                    <TouchableOpacity onPress={handleLike} style={styles.actionIcon}>
                      <Ionicons name="heart-outline" size={28} color="#fff" />
                      <Text style={styles.actionText}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleComment} style={styles.actionIcon}>
                      <Ionicons name="chatbubble-outline" size={28} color="#fff" />
                      <Text style={styles.actionText}>Comment</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShare} style={styles.actionIcon}>
                      <Ionicons name="share-social-outline" size={28} color="#fff" />
                      <Text style={styles.actionText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={handleViewableItemsChanged.current}
            viewabilityConfig={viewConfigRef.current}
            snapToAlignment="start"
            decelerationRate="fast"
            snapToInterval={height}
          />

          {showFooter && (
            <Animated.View style={[styles.footerMessage, { opacity: footerOpacity }]}>
              <Text style={styles.footerText}>💡 You’ve reached the end of the feed</Text>
            </Animated.View>
          )}

          <Modal visible={showCommentModal} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalHeader}>Add a comment</Text>
                <TextInput
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="Write something..."
                  placeholderTextColor="#888"
                  style={styles.commentInput}
                />
                <TouchableOpacity style={styles.modalButton} onPress={handleSubmitComment}>
                  <Text style={styles.modalButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}

      <TouchableOpacity style={styles.uploadButton} onPress={pickVideo}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}