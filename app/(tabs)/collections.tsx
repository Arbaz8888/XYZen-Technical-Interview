import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, FlatList, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../../supabaseClient';
import { collectionStyles as styles } from '../../styles/collectionStyles';
import { useAuth } from '../../context/AuthContext';

export default function CollectionsScreen() {
  const { user } = useAuth();

  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [caption, setCaption] = useState('');
  const [clips, setClips] = useState<any[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      let query = supabase.from('videos').select('*').order('created_at', { ascending: false });

      if (user?.role === 'artist') {
        query = query.eq('uploader_role', 'artist');
      } else if (user?.role === 'user') {
        query = query.or(`uploader_id.eq.${user.id},uploader_role.eq.artist`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching collections:', error);
        return;
      }
      setClips(data);
    };

    fetchVideos();
  }, [user]);

  const groupedClips: { [genre: string]: any[] } = clips.reduce((acc, clip) => {
    const clipGenre = clip.genre || 'Unsorted';
    if (!acc[clipGenre]) acc[clipGenre] = [];
    acc[clipGenre].push(clip);
    return acc;
  }, {});

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      setVideoUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!videoUri) {
      Alert.alert('Please select a video first.');
      return;
    }

    const fileExt = videoUri.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${FileSystem.cacheDirectory}${fileName}`;

    await FileSystem.copyAsync({ from: videoUri, to: filePath });

    const fileBlob = {
      uri: filePath,
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
      Alert.alert('Upload Failed', uploadError.message);
      return;
    }

    const { data: urlData } = supabase.storage.from('videos').getPublicUrl(fileName);
    const publicURL = urlData?.publicUrl;

    const { error: insertError } = await supabase.from('videos').insert([
      {
        video_url: publicURL,
        title: title || null,
        genre: genre || null,
        caption: caption || null,
        uploader_id: user?.id,
        uploader_role: user?.role,
      },
    ]);

    if (insertError) {
      Alert.alert('Upload Failed', insertError.message);
    } else {
      Alert.alert('Upload Successful!');
      setVideoUri(null);
      setTitle('');
      setGenre('');
      setCaption('');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={[styles.uploadButton, { marginBottom: 40 }]} onPress={pickVideo}>
        <Text style={styles.uploadText}>{videoUri ? 'Change Video' : 'Pick Video'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Optional Title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Genre</Text>
      <TextInput
        style={styles.input}
        placeholder="Optional Genre"
        placeholderTextColor="#888"
        value={genre}
        onChangeText={setGenre}
      />

      <Text style={styles.label}>Caption</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Optional Caption"
        placeholderTextColor="#888"
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.uploadText}>Upload Video</Text>
      </TouchableOpacity>

      {clips.length > 0 && (
        <View style={{ marginTop: 32 }}>
          {Object.entries(groupedClips).map(([genre, genreClips]) => (
            <View key={genre} style={styles.genreSection}>
              <Text style={styles.genreTitle}>{genre}</Text>
              <FlatList
                data={genreClips}
                horizontal
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Image source={{ uri: item.video_url }} style={styles.videoThumb} />
                )}
                contentContainerStyle={styles.genreList}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
