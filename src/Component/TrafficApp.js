import '../App.css';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import WeatherImage from './WeatherImage';
import CameraImage from './CameraImage';
import {fetchLocations} from './api/Location';
import CoordinatesDropdown from './CoordinatesDropdown';
class TrafficApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinates: [],
      selectedDate: new Date(),
      trafficImage: null,
      imageUrl:'',
      weatherInfo: null,
      selectedImages: [],
      locationNames: {}
    };
  }

  fetchLatitudeLongitude = async () => {
    const { selectedDate } = this.state;
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    console.log(apiKey);
    try {
      const locations = await fetchLocations(selectedDate);
      const coordinates = locations.data.items[0].cameras.map(camera => ({
        latitude: camera.location.latitude,
        longitude: camera.location.longitude,
        camera_id: camera.camera_id
      }));
      const addressPromises = coordinates.map(coord => {
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coord.latitude},${coord.longitude}&key=${apiKey}`;
        // console.log(geocodingUrl);
        return fetch(geocodingUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            // console.log(data);
            // const coordinates = data.results[0]?.geometry?.location;
            // console.log("coordinates",coordinates);

            const address = data.results[0]?.formatted_address || 'Unknown Address';
            return { ...coord, address };
          })
          .catch(error => {
            console.error('Error fetching geocoding data:', error);
            return { ...coord, address: 'Error Fetching Address' };
          });
      });
      try {
        // console.log("addressPromises",addressPromises);
        const addressesWithCoordinates = await Promise.all(addressPromises);
        // console.log("addressesWithCoordinates",addressesWithCoordinates);
        this.setState({ coordinates: addressesWithCoordinates, traficData: locations.data });
      } catch (error) {
        console.error('Error resolving promises:', error);
      }

    } catch (error) {
      console.error('Error fetching traffic image:', error);
    }
  };
  handleDateSelect = (date) => {
    this.setState({ selectedDate: date }, () => {
      this.fetchLatitudeLongitude();
    });
  };

  handleCoordinatesChange = event => {
    const selectedValue = event.target.value;
    const [selectedLatitude, selectedLongitude] = selectedValue.split(',');
    const { traficData } = this.state;
    // console.log(traficData.items[0].cameras);
    const selectedImages = traficData.items[0].cameras.filter(coords =>
      parseFloat(coords.location.latitude) === parseFloat(selectedLatitude) &&
      parseFloat(coords.location.longitude) === parseFloat(selectedLongitude)
    );
    this.fetchWeatherInfo(event);
    this.setState({ selectedImages });
  };


  fetchWeatherInfo = async (event) => {
    const selectedValue = event.target.value;
    const [selectedLatitude, selectedLongitude] = selectedValue.split(',');
  
    try {
      const areaMetadata = await this.fetchAreaMetadata();
      const matchingArea = this.findMatchingArea(
        areaMetadata.area_metadata,
        selectedLatitude,
        selectedLongitude
      );
  
      if (matchingArea) {
        const forecast = this.getForecastForArea(
          areaMetadata.items[0].forecasts,
          matchingArea.name
        );
        this.setState({ forecastDisplay: forecast });
      } else {
        this.setState({ forecastDisplay: "No matching area found" });
        // console.log("No matching area found.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  fetchAreaMetadata = async () => {
    const response = await fetch(
      "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast"
    );
    return response.json();
  };
  
  findMatchingArea = (areaMetadata, selectedLatitude, selectedLongitude) => {
    return areaMetadata.find((area) => {
      const areaLatitude = parseFloat(area.label_location.latitude).toFixed(2);
      const areaLongitude = parseFloat(area.label_location.longitude).toFixed(2);

      // console.log(areaLatitude,"====",parseFloat(selectedLatitude).toFixed(2));
      // console.log(areaLongitude,"====",parseFloat(selectedLongitude).toFixed(2));
      return (
        areaLatitude === parseFloat(selectedLatitude).toFixed(2) &&
        areaLongitude === parseFloat(selectedLongitude).toFixed(2)
      );
    });
  };
  
  getForecastForArea = (forecasts, areaName) => {
    const matchingForecast = forecasts.find((forecast) => forecast.area === areaName);
    return matchingForecast ? matchingForecast.forecast : "No forecast available";
  };

  render() {
    const { selectedDate, coordinates, selectedImages,forecastDisplay} = this.state;
    // console.log(forecastDisplay);
    return (
      <div className="responsive-container">
        <h1>Traffic App</h1>
        <div className="container">
          <h2>Date and Time:</h2>
          <DatePicker
              selected={selectedDate}
              onChange={this.handleDateSelect}
              showTimeSelect
              timeFormat="HH:mm"
              dateFormat="MMMM d, yyyy HH:mm"
              className="responsive-datepicker"
              wrapperClassName="datepicker-wrapper"
              popperClassName="datepicker-popper"
              responsive                   
              withPortal                   
            />
        </div>
          <CoordinatesDropdown
              coordinates={coordinates}
              onChange={this.handleCoordinatesChange}
            />
          {forecastDisplay && (
              <WeatherImage forecast={forecastDisplay}/>
          )}
          {selectedImages.length > 0 &&
          selectedImages.map((image, index) => (
            <CameraImage key={index} imageUrl={image.image} />
          ))}
      </div>
    );
  }
}

export default TrafficApp;