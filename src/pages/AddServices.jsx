import { GrAdd, GrClose } from "react-icons/Gr";
import { AiOutlineClose } from "react-icons/Ai";
import React, { useState, useEffect } from "react";
import PlaceOffers from "../components/offers";
import MapSection from "../components/maps";
import exifr from "exifr";
import axios from "axios";
import "./Addservices.css";

export default function AddServices() {
  const [showModal, setShowModal] = useState(false);
  const [legitChecked, setLegitChecked] = useState(false);
  const [images, setImages] = useState([]);
  const [positionMarked, setPositionMarked] = useState(false);
  const [photolat, setPhotolat] = useState(0);
  const [photolon, setPhotolon] = useState(0);
  const [maplat, setMaplat] = useState(null);
  const [maplon, setMaplon] = useState(null);
  const[offerlist,setOfferList]= useState({})
  const [offers, setOffers] = useState([
    { offer: "", rate: "" },
  ]);

  const handleOfferChange = (index, field, value) => {
    const updatedOffers = [...offers];
    updatedOffers[index][field] = value;
    setOffers(updatedOffers);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const handleInputChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const options = [
    "Room",
    "Restaurant",
    "Camping",
    "View Tower",
    "Boating",
    "Swimming Pool",
    "Bungee",
    "Rafting",
    "Travel Agency",
    "Tour Operators",
  ];

  const [servicedesc, setServicedesc] = useState({
    placeName: "",
    placeDescription: "",
    location:""
  });
  const handleChange = (e) => {
    setServicedesc({ ...servicedesc, [e.target.name]: e.target.value });
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
          let latitude, longitude;
          if (exifData && exifData.latitude && exifData.longitude) {
            setPhotolat(exifData.latitude);
            setPhotolon(exifData.longitude);
          }
          const metadata = {
            location: { latitude, longitude },
          };
          console.log([latitude, longitude]);
          const objectURL = URL.createObjectURL(file);
          const imageWithMetadata = { objectURL, metadata };
          setImages([...images, imageWithMetadata]);
        } catch (error) {
          console.error("Error extracting metadata:", error);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const Popup = () => {
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
          <p className="reward--text1">Congratulations</p>
          <p className="reward--text2">You successfully added a service</p>
        </div>
      </>
    );
  };
  const handleLocationSelect = (location) => {
    console.log("Selected Location:", location);
    setMaplat(location.latitude);
    setMaplon(location.longitude);
    setPositionMarked(true);
  };

  // const handleOffersSelected = (selectedOffers) => {
  //   console.log("offers:", selectedOffers);
  //   setOfferList(selectedOffers);
  // };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!location) {
      alert("Please select a location in the map");
      return;
    }
    // if (!selectedCategory) {
    //   alert("Please select a category");
    //   return;
    // }

    if (!legitChecked) {
      alert("Please confirm that the information you submitted is legit");
      return;
    }
    if (!images) {
      alert("Please select one or more images");
    }
    // setShowModal(true);

    // console.log("selectedcategory:", selectedCategory);
    // console.log("description:", placedesc);
    // handleOffersSelected;
    
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    };

    const body = JSON.stringify({
      name: servicedesc.placeName,
      location: servicedesc.location,
      description:servicedesc.placeDescription,
      // review: placedetails.review,
      latitude: maplat,
      longitude: maplon,
       offering:offerlist,
       category:selectedOption

      // metalongitude: photolon,
      // metalatitude: photolat,
      // rating: ratingValue
    });

    axios
    .post(`${process.env.REACT_APP_API_URL}/api/hotel/`, body, config)
    .then((res) =>{ console.log(res);
      setShowModal(true);
    })
    .catch((e) => {
      console.error(e);
      alert("Error sending details");
    });
 

   
  };

  return (
    <div className="contribute-container">
      <div className="left-part">
        <div className="contribute-text"><h4>Add a service</h4></div>
        <div className="contribute--add">
              <p>Add images</p>
            </div>
        <div className="services--image-container">
        <div className="services--places-container">
          <ul>
            {images.map((imageWithMetadata, index) => (
              <li key={index} className="services--imageContainer">
                <img src={imageWithMetadata.objectURL} alt={`image-${index}`} />
                <button
                  className="services--delete-button"
                  onClick={() => handleImageDelete(index)}
                >
                  <GrClose />
                </button>
              </li>
            ))}
            <li>
              <label htmlFor="image-upload" className="services--add-box">
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
        </div>

        <div className="maps-container">
        <p className="contribute--addmap">Add place on map</p>
          <MapSection onLocationSelect={handleLocationSelect} />
        </div>
      </div>
      <div className="right-part">
        <div className="services--place-info">
          <form onSubmit={submitHandler}>
            <input
              className="services--place-name1"
              type="text"
              name="placeName"
              placeholder="Name of the place"
              value={servicedesc.placeName}
              onChange={handleChange}
            />
              <input
               className="services--place-name2"
               type="text"
               name="location"
               placeholder="Location"
               value={servicedesc.location}
               onChange={handleChange}
             />
            <input
              className="services--place-name2"
              type="text"
              name="placeDescription"
              placeholder="Description of the place"
              value={servicedesc.placeDescription}
              onChange={handleChange}
            />
            {/* <div className="services--place-offers-text"><h3>Services provided</h3></div> */}
            {/* <div className="reviews">
              <PlaceOffers onOffersSelected={handleOffersSelected} />
            </div> */}

            <div className="dropdown-container">
              <h3 className="services--selectcategory">Select Category</h3>
              <input
              className="services--input"
                type="text"
                value={selectedOption}
                placeholder="Hover to select a category"
                onChange={handleInputChange}
                onMouseEnter={() => setIsDropdownOpen(true)}
                readOnly
              />
              {isDropdownOpen && (
                <ul
                  className="dropdown-list"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  {options.map((option) => (
                    <li key={option} onClick={() => handleOptionSelect(option)}>
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="pricing-container">
              <h3>Pricing</h3>
              {offers.map((offer, index) => (
                <div key={index} className="offer-row">
                  <input
                    type="text"
                    placeholder="Offer"
                    value={offer.name}
                    onChange={(e) =>
                      handleOfferChange(index, "name", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Rate (NRS)"
                    value={offer.rate}
                    onChange={(e) =>
                      handleOfferChange(index, "rate", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <div className="services--checkbox">
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
            <button className="services--submit" type="submit">
              Submit
            </button>
            {showModal && <Popup />}
          </form>
        </div>
      </div>
    </div>
  );
}
