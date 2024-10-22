// styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  currentLoc: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 20,
  },
  currentLocation: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  destinationLocation: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  destinationLoc: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 20,
  },
  locationInfo: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    width: 320,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderRadius: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#956AF1',
    marginRight: 10,
  },
  locationContainer: {
    marginHorizontal: 20,
    flexGrow: 1, // Allow the container to grow based on its content
  },
  locationsubContainer:{
    top: 5,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainerWrapper: {
    position: 'absolute',
    top: 50,
    width: '90%',
    alignSelf: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 30,
    paddingLeft: 10,
    fontSize: 15,
  },
  icon: {
    marginLeft: 5,
    marginRight: 5,
  },
  item: {
    padding: 10,
    marginVertical: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fareContainer: {
    position: 'absolute',
    bottom: 80,
    borderRadius: 10,
    width: '60%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    elevation: 5,
  },
  fareText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  confirmButton: {
    position: 'absolute',
    width: '80%',
    alignSelf: 'center',
    bottom: 25,
    marginTop: 20,
    backgroundColor: '#956AF1',  // Set background color
    borderRadius: 10,
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
  },
  confirmText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14,
  },
});

export default styles;
