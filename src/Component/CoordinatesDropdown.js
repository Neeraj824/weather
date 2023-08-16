import React from 'react';
// import axios from 'axios'; // Import axios if not already imported


class CoordinatesDropdown extends React.Component {
  render() {
    const { coordinates, onChange } = this.props;
  return (
    <div className="container">
      <h2>Location:</h2>
      <select className="responsive-select" onChange={onChange}>
         <option value="">Select...</option>
          {coordinates.map((coord, index) => (
            <option key={index} value={`${coord.latitude},${coord.longitude}`}>
            {/* {`Lat: ${coord.latitude}, Long: ${coord.longitude}`} */}
            {/* {`${locationNames[coord.camera_id] || 'Loading...'} (Lat: ${coord.latitude}, Long: ${coord.longitude})`} */}
            {`${coord.address || 'Loading...'}`}
          </option>
          ))}
      </select>
    </div>
  );
}
}

export default CoordinatesDropdown;