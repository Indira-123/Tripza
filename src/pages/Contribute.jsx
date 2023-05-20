import { GrAdd, GrClose } from "react-icons/Gr";
import { AiOutlineClose } from "react-icons/Ai";
import React, { useState, useEffect } from "react";
import RatingStars from "../components/ratings";
import PlaceOffers from "../components/offers";
import MapSection from "../components/maps";
import exifr from "exifr";
import axios from "axios";
import "./Contribute.css";

export default function Contribute() {
  const [imageAdded, setImageAdded] = useState(false);
  const [ratingValue, setRatingValue] = useState(null);
  const [positionMarked, setPositionMarked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [legitChecked, setLegitChecked] = useState(false);
  const [images, setImages] = useState([]);
  const [photolat, setPhotolat] = useState(0);
  const [photolon, setPhotolon] = useState(0);
  const [maplat, setMaplat] = useState(null);
  const [maplon, setMaplon] = useState(null);
  // const [isWithinCircle,setIsWithinCircle]=useState(false);

  const [placedetails, setPlacedetails] = useState({
    name: "",
    description: "",
    // selectedOffers:"",
    //rating:"",
    // latitude:"",
    // longitude:"",
    // isVerified:""
  });

  const handleChange = (e) => {
    setPlacedetails({ ...placedetails, [e.target.name]: e.target.value });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = async () => {
        const imageData = reader.result;

        try {
          const exifData = await exifr.gps(imageData);
          if (exifData && exifData.latitude && exifData.longitude) {
            setPhotolat(exifData.latitude);
            setPhotolon(exifData.longitude);

            //   // Check if the photo's location falls within the circular area
            //   const circleCenterLat = maplat; // Latitude of the circle center
            //   const circleCenterLng =maplon ; // Longitude of the circle center
            //   const circleRadius = 5; // Radius of the circle in kilometers

            //   const isWithinCurrentCircle = isPhotoInCircle(
            //     photolat,
            //     photolon,
            //     circleCenterLat,
            //     circleCenterLng,
            //     circleRadius
            //   );
            //   console.log("Is within circle:", isWithinCurrentCircle);

            //   // Update the flag variable if any photo is within the circle
            //   if (isWithinCurrentCircle) {
            //     setIsWithinCircle(true);
            //   }
          }

          const metadata = {
            location: { photolat, photolon },
          };

          console.log("image location:", [photolat, photolon]);
          const objectURL = URL.createObjectURL(file);
          const imageWithMetadata = { objectURL, metadata };
          setImages([...images, imageWithMetadata]);
        } catch (error) {
          console.error("Error extracting metadata:", error);
        }
      };
      setImageAdded(true);
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    console.log(index);
    if (index == 0) {
      setImageAdded(false);
    } else {
      setImageAdded(true);
    }
  };

  const Popup = () => {
    // const [level, setLevel] = useState(0);
    // const handleIncreaseLevel = () => {
    //   setLevel((prevLevel) => prevLevel + 1);
    // };
    // useEffect(() => {
    //   handleIncreaseLevel();
    // }, []);
    return (
      <>
        <div className="reward-wrapper" onClick={handleCloseModal}></div>
        <div className="reward-container">
          <div
            className="reward--close-btnn"
            onClick={() => setShowModal(false)}
          >
            <AiOutlineClose />
          </div>
          <p className="reward--text1">Congratulations!</p>
          <p className="reward--text2">You contributed a place</p>
        </div>
      </>
    );
  };

  const handleLocationSelect = (position) => {
    console.log("Selected Location:", position);
    setMaplat(position.latitude);
    setMaplon(position.longitude);
    // const circleCenterLat = maplat; // Latitude of the circle center
    // const circleCenterLng = maplon; // Longitude of the circle center
    // const circleRadius = 5; // Radius of the circle in kilometers
    // console.log('photo latitude:',photolat);
    // if(photolat && photolon){
    // const isWithinCurrentCircle = isPhotoInCircle(
    //   photolat,
    //   photolon,
    //   circleCenterLat,
    //   circleCenterLng,
    //   circleRadius
    // );
    // console.log("Is within circle:", isWithinCurrentCircle);
    // if (isWithinCurrentCircle) {
    //   setIsWithinCircle(true);
    // }
    // else{
    //   setIsWithinCircle(false);
    // }
    //}
    setPositionMarked(true);
  };
  const handleOffersSelected = (selectedOffers) => {
    console.log("offers:", selectedOffers);
  };
  const handleRating = (rating) => {
    console.log("rating:", rating);
    setRatingValue(rating);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // const circleCenterLat = maplat; // Latitude of the circle center
    //  const circleCenterLng = maplon; // Longitude of the circle center
    //  console.log(circleCenterLat);
    //  console.log(circleCenterLng);
    //  const circleRadius = 5; // Radius of the circle in kilometers
    //  console.log('photo latitude:',photolat);
    //  if(photolat && photolon){
    //  const isWithinCurrentCircle = isPhotoInCircle(
    //    photolat,
    //    photolon,
    //    circleCenterLat,
    //    circleCenterLng,
    //    circleRadius
    //  );
    //  console.log("Is within circle:", isWithinCurrentCircle);
    //  if (isWithinCurrentCircle=='true') {
    //    setIsWithinCircle(true);
    //  }
    //  else{
    //    setIsWithinCircle(false);
    //  }
    //}

    if (!positionMarked) {
      alert("Please select a location in the map");
      return;
    }
    if (!legitChecked) {
      alert("Please confirm that the information you submitted is legit");
      return;
    }
    if (!imageAdded) {
      alert("Please select one or more images");
      return;
    }
    if (!ratingValue) {
      alert("Please give your ratings");
      return;
    }
    setShowModal(true);

    // console.log("description:", placedesc);
    // handleOffersSelected;
    // handleRating;
    // console.log('correct metadata:',isWithinCircle);

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    };
    const body = JSON.stringify({
      name: placedetails.name,
      location: placedetails.location,
      description: placedetails.description,
      latitude: maplat,
      longitude: maplon,
      metalatitude: photolat,
      metalongitude: photolon,
      rating: ratingValue,
    });
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/place/`, body, config)
      .catch((e) => {
        console.error(e);
        alert("Error sending details");
      });
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="contribute-container">
        <div className="left-part">
          <div className="contribute-text"><h4>Contribute a place</h4></div>
          <div className="contribute--add"><p>Add images</p></div>
          <div className="places-container">
            <ul>
              {images.map((imageWithMetadata, index) => (
                <li key={index} className="contribute--imageContainer">
                  <img
                    src={imageWithMetadata.objectURL}
                    alt={`image-${index}`}
                  />
                  <button
                    className="delete-button"
                    onClick={() => handleImageDelete(index)}
                  >
                    <GrClose />
                  </button>
                </li>
              ))}
              <li>
                <label htmlFor="image-upload" className="add-box">
                  <GrAdd className="image-add" />
                </label>
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </li>
            </ul>
          </div>
          <div className="maps-container">
          <p className="contribute--addmap">Add place on map</p>
            <MapSection className="contribute--map" onLocationSelect={handleLocationSelect} />
          </div>
        </div>
        <div className="right-part">
          <div className="place-info">
            <input
              className="place-name1"
              type="text"
              name="name"
              placeholder="Name of the place"
              value={placedetails.name}
              onChange={handleChange}
              required
            />
            <input
              className="place-location"
              type="text"
              name="location"
              placeholder="Location"
              value={placedetails.location}
              onChange={handleChange}
              required
            />
            <input
              className="place-name2"
              type="text"
              name="description"
              placeholder="Description of the place"
              value={placedetails.description}
              onChange={handleChange}
              required
            />
            <div className="place-offers-text">What this place offers</div>
            <div className="reviews">
              <PlaceOffers onOffersSelected={handleOffersSelected} />
            </div>

            <div className="review-text">Your review of the place</div>

            <div className="review">
              <RatingStars sendRating={handleRating} />
            </div>

            <div className="review-box">
              <input
                type="text"
                name="review"
                placeholder="Review Here"
                onChange={handleChange}
                value={placedetails.review}
              />
            </div>
            <div className="checkbox">
              <label required>
                <input
                  type="checkbox"
                  checked={legitChecked}
                  onChange={() => setLegitChecked(!legitChecked)}
                />
                The information I submitted here is legit.
              </label>
            </div>
            <br />
            <button className="submit" type="submit">
              Submit
            </button>
            {showModal && <Popup />}
          </div>
        </div>
      </div>
    </form>
  );
}
