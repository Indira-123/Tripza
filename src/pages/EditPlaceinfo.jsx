import { GrAdd, GrClose } from "react-icons/Gr";
import { AiOutlineClose } from "react-icons/Ai";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RatingStars from "../components/ratings";
import MapSection from "../components/maps";
import exifr from "exifr";
import axios from "axios";
import "./Contribute.css";

const EditPlace = () => {
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

  const { slug } = useParams();

  const [placedetails, setPlacedetails] = useState({
    name: "",
    description: "",
    location: "",
    review: "",
    rating: "",
  });

  useEffect(() => {
    const fetchImage = async (imageURL) => {
      try {
        const response = await fetch(imageURL);
        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: blob.type });
        return file;
      } catch (error) {
        console.error("Error fetching image:", error);
        return null;
      }
    };

    const fetchPlaceData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/place/${slug}`);
        const data = await response.json();
        console.log("data:", data);

        const imagesData = await Promise.all(
          data.images.map(async (image) => {
            const file = await fetchImage(
              `http://localhost:8000${image.image}`
            );
            return {
              id: image.id,
              file,
              imageData: URL.createObjectURL(file),
            };
          })
        );

        setImages(imagesData);
        setImageAdded(true);
        setMaplat(data.latitude);
        setMaplon(data.longitude);
        setPlacedetails({
          name: data.name,
          description: data.description,
          location: data.location,
          review: data.c_review,
        });
      } catch (error) {
        console.error("Error fetching place data:", error);
      }
    };
    fetchPlaceData();
  }, [slug]);

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
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const imageData = reader.result;

        try {
          const exifData = await exifr.gps(imageData);
          if (exifData && exifData.latitude && exifData.longitude) {
            setPhotolat(exifData.latitude);
            setPhotolon(exifData.longitude);
          }

          setImages([...images, { file, imageData }]);
        } catch (error) {
          console.error("Error extracting metadata:", error);
        }
      };
      setImageAdded(true);
    }
  };

  const handleImageDelete = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    if (index === 0) {
      setImageAdded(false);
    } else {
      setImageAdded(true);
    }
  };

  const handleLocationSelect = (position) => {
    setMaplat(position.latitude);
    setMaplon(position.longitude);
    setPositionMarked(true);
  };

  const handleRating = (rating) => {
    setRatingValue(rating);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!positionMarked) {
      alert("Please select a location on the map");
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
      alert("Please give your rating");
      return;
    }

    const formData = new FormData();
    formData.append("name", placedetails.name);
    formData.append("location", placedetails.location);
    formData.append("description", placedetails.description);
    formData.append("latitude", maplat);
    formData.append("longitude", maplon);
    formData.append("metalatitude", photolat);
    formData.append("metalongitude", photolon);
    formData.append("rating", ratingValue);
    formData.append("c_review", placedetails.review);

    images.forEach((image) => {
      formData.append("images", image.file);
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_URL}/api/place/${slug}/`,
        formData,
        config
      )
      .then((res) => {
        console.log(res);
        setShowModal(true);
      })
      .catch((e) => {
        console.error(e);
        alert("Error sending details");
      });
  };

  const Popup = () => (
    <>
      <div className="reward-wrapper" onClick={handleCloseModal}></div>
      <div className="reward-container">
        <div className="reward--close-btnn" onClick={() => setShowModal(false)}>
          <AiOutlineClose />
        </div>
        <p className="reward--text1">Congratulations!</p>
        <p className="reward--text2">You have successfully edited this place</p>
      </div>
    </>
  );

  return (
    <form onSubmit={submitHandler}>
      <div className="contribute-container">
        <div className="left-part">
          <div className="contribute-text">
            <h4>Contribute a place</h4>
          </div>
          <div className="contribute--add">
            <p>Add images</p>
          </div>
          <div className="places-container">
            <ul>
              {images.map((imageWithMetadata, index) => (
                <li key={index} className="contribute--imageContainer">
                  <img src={images[index].imageData} alt={`image-${index}`} />
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
            <MapSection
              className="contribute--map"
              onLocationSelect={handleLocationSelect}
              initialLatitude={maplat} // Add initial latitude
              initialLongitude={maplon} // Add initial longitude
            />
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
            <div className="reviews">
              {/* <PlaceOffers onOffersSelected={handleOffersSelected} /> */}
            </div>
            <div className="review-text">Your review of the place</div>
            <div className="review">
              <RatingStars
                sendRating={handleRating}
                initialValue={placedetails.rating}
              />{" "}
              {/* Set initial rating */}
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
};

export default EditPlace;
