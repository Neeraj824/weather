import React from 'react';
const LocationSelect = ({ trafficImage, locationNames, selectedLocation, handleLocationSelect }) => {
  return (
    <div className="container">
      <h2>Location:</h2>
      <select className="responsive-select" onChange={handleLocationSelect} value={selectedLocation}>
        <option value="">Select an option</option>
        {trafficImage.map((traffic) => {
          const locationKey = `${parseFloat(traffic.location.latitude).toFixed(2)}_${parseFloat(
            traffic.location.longitude
          ).toFixed(2)}`;

          if (locationNames[locationKey]) {
            return (
              <option key={traffic.camera_id} data-key={traffic.image} value={locationNames[locationKey]}>
                {locationNames[locationKey]}
              </option>
            );
          }

          return null;
        })}
      </select>
      {!locationNames[selectedLocation] && <p className="error-message">Please select an option</p>}
    </div>
  );
};

export default LocationSelect;