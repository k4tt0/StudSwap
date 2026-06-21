import { StyleSheet } from 'react-native';

export const getSavedStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: colors.textDark,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120, 
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 15,
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: 'center',
  },
  itemImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.accent,
  },
  removeBtn: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: colors.muted,
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  }
});