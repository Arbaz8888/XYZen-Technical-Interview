import { Dimensions, StyleSheet } from 'react-native';

const { height } = Dimensions.get('window');

export const feedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  clip: {
    height: height,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    aspectRatio: 9 / 16,
  },
  actionsRow: {
    position: 'absolute',
    right: 20,
    bottom: 120,
    gap: 20,
    alignItems: 'center',
  },
  actionIcon: {
    marginVertical: 6,
  },
  actionText: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  uploadButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#1DB954',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingBottom: 80,
  },
  emptyText: {
    color: '#ccc',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubText: {
    color: '#888',
    fontSize: 16,
    marginTop: 6,
  },
  footerMessage: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  footerText: {
    color: '#ccc',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  modalSubText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 12,
  },
  commentInput: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
