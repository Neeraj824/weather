import React from 'react';

class CameraImage extends React.Component {
  render() {
    const { imageUrl } = this.props;
    return (
        <div className="container">
        <h2>Traffic Image:</h2>
        <img height="240" width ="320" src={imageUrl} alt="Traffic" />
      </div>);
  }
}

export default CameraImage;