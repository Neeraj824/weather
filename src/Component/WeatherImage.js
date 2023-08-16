import React from 'react';

class WeatherImage extends React.Component {
  render() {
    const { forecast } = this.props;

   
    return (
      <div className="container">
        <h2>Weather Info:</h2>
        <p>{forecast}</p>
      </div>);
  }
}

export default WeatherImage;