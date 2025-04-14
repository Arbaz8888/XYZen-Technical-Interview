import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const collectionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  header: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  uploadButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  uploadForm: {
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyMessage: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 20,
  },
  genreSection: {
    marginBottom: 24,
  },
  genreTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  videoThumb: {
    width: width * 0.4,
    height: height * 0.25,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#222',
  },
  genreList: {
    paddingBottom: 10,
  },
  label: {
    color: '#333',
    fontSize: 16,
    marginBottom: 8,
  },
});
