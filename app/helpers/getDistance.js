function degrees_to_radians(degrees) {
    return degrees * (Math.PI/180);
}

function getDistance(lat1, lon1, lat2, lon2) {  
    const earth_radius = 6371;

    const dLat = degrees_to_radians(lat2 - lat1);  
    const dLon = degrees_to_radians(lon2 - lon1);  

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                Math.cos(degrees_to_radians(lat1)) * Math.cos(degrees_to_radians(lat2)) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);  
    // const c = 2 * Math.asin(Math.sqrt(a));
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));   
    const d = earth_radius * c;  

    return d;  
}

module.exports = getDistance;