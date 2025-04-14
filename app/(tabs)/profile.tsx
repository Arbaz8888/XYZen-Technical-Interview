import { View, Text, Image, TouchableOpacity } from 'react-native';
import { profileStyles as styles } from '../../styles/profileStyles';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/300' }} // placeholder profile picture
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.name}>Arbaz Attar</Text>
          <Text style={styles.handle}>@musiclover</Text>
        </View>
      </View>

      <Text style={styles.bio}>Style: Trendy | Personality: Chill 🎧</Text>
      <Text style={styles.sectionTitle}>About Me</Text>
      <Text style={styles.aboutText}>
        Music enthusiast passionate about discovering new beats and sharing vibes. Follow to explore my journey in sound.
      </Text>

      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
