import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Clear from "../assets/Clear.png";
import Cloud from "../assets/Cloud.png";
import Rainy from "../assets/Rainy.png";
import Mist from "../assets/Mist.png";
import Error from "../assets/Error.png";

const Whather = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  /* get Weather image base on Condition */
  const getWeatherImage = (condition) => {
    switch (condition) {
      case "Clouds":
      case "Haze":
        return Cloud;
      case "Rain":
        return Rainy;
      case "Clear":
        return Clear;
      case "Mist":
        return Mist;
      default:
        return Error;
    }
  };
  // Show mood tip based on weather condition
  const getMoodTip = (condition) => {
    switch (condition) {
      case "Rain":
        return "Perfect day for a cup of coffee and a book ☕📖";
      case "Clear":
        return "Time to get some Vitamin D ☀️ Don't forget your shades!";
      case "Storm":
        return "Stay indoors and stay safe! How about a movie?";
      case "Clouds":
        return "A cloudy day to reflect and relax ☁️";
      case "Mist":
      case "Haze":
        return "Visibility is low – stay alert while traveling!";
      default:
        return "Have a great day no matter the weather!";
    }
  };

  // Handle input changes
  const handleinput = (event) => {
    setSearch(event.target.value);
    setError(""); // Clear error on input
  };

  // Fetch weather data on search
  const myFun = async () => {
    // Move the empty check before the fetch call to avoid unnecessary API call
    if (search == "") {
      setError("Please Enter City Name");
      setData(""); //clear Error
      return;
    }
    setLoading(true);
    try {
      const get = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${
          import.meta.env.VITE_API_KEY
        }&units=metric`
      );
      // Convert JSON Formate
      const jsondata = await get.json();
      if (jsondata.cod == "404") {
        setError("Invalid city name. Please try again.");
        setData(""); //clear Error
        setSearch("");
      } else {
        // console.log(jsondata);
        setData(jsondata);
        setSearch(""); // Clear input only on success
      }
    } catch (error) {
      setError("Something went wrong. Please check your internet connection.");
      // setSearch("");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="container">
        <div className="inputs">
          <input
            type="search"
            name="search"
            value={search}
            placeholder="Enter City or Country"
            onChange={handleinput}
          />
          <button onClick={myFun}>
            {/* <i className="fa-solid fa-magnifying-glass"></i> */}
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
        <div>
          {/* Show Loading State */}
          {loading && <p className="loading">Loading...</p>}
          {/* Show Error Image */}
          {error ? (
            <div className="errorPage">
              <p>{error}</p> <img src={Error} alt="Error Image" />
            </div>
          ) : (
            ""
          )}
        </div>

        {data && data.weather ? (
          <div className="weathers">
            <h2 className="cityName">{data.name}</h2>

            <img
              src={getWeatherImage(data.weather[0].main)}
              alt="Weather Image"
            />

            <h2 className="temprature">{`${Math.trunc(data.main.temp)}°C`}</h2>
            <p className="climate">{data.weather[0].description}</p>
            <span className="moodTip">{getMoodTip(data.weather[0].main)}</span>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};
export default Whather;
