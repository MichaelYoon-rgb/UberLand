import * as Location from 'expo-location';

export const calculateDistance = (coord1, coord2) => {
    lat1 = coord1.latitude
    lon1 = coord1.longitude

    lat2 = coord2.latitude
    lon2 = coord2.longitude

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

export const calculateDistancePercentage = (coords, location) => {
    const lat = location.latitude
    const lng = location.longitude

    const totalDistance = coords.reduce((acc, curr, index) => {
      if (index > 0) {
        const prevCoord = coords[index - 1];
        const distance = calculateDistance(
          prevCoord.latitude,
          prevCoord.longitude,
          curr.latitude,
          curr.longitude
        );
        return acc + distance;
      }
      return acc;
    }, 0);
  
    const customerDistance = calculateDistance(
      coords[0].latitude,
      coords[0].longitude,
      lat,
      lng
    );
  
    const percentage = (customerDistance / totalDistance) * 100;
    return percentage;
}

  
export const isThresholdDistance = (coords, location, threshold) => {
    let closest = Infinity;
    coords.forEach(coord => {
        let distance = calculateDistance(coord, location)
        if (distance < closest){
            closest = distance
        }
    });
    return closest > threshold
}

export const watchLocation = (updateLocation) => {
    Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 10000, distanceInterval: 10 }, 
        (loc) => {

            updateLocation(loc.coords)
            // setRouteAlert(isThresholdDistance(coords, loc.coords, threshold))
            // setSpeedAlert(loc.coords.speed > setSpeedThreshold)
        }
    );
}