import React, { useState } from 'react';
import './ReviewComponentko.css';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
function ReviewComponent(props) {
    const [likesCount, setLikesCount] = useState(props.likesCount);
    const [dislikesCount, setDislikesCount] = useState(props.dislikesCount);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
   
    const handleLikeClick = () => {
        if (!liked) {
          setLikesCount(likesCount + 1);
          setLiked(true);
          if (disliked) {
            setDisliked(false);
            setDislikesCount(dislikesCount - 1);
          }
        } else {
          setLikesCount(likesCount - 1);
          setLiked(false);
        }
      };
    
      const handleDislikeClick = () => {
        if (!disliked) {
          setDislikesCount(dislikesCount + 1);
          setDisliked(true);
          if (liked) {
            setLiked(false);
            setLikesCount(likesCount - 1);
          }
        } else {
          setDislikesCount(dislikesCount - 1);
          setDisliked(false);
        }
      };
  
    return (
      <div className='reviews-section'>
        <div className='review-card'>
          <div className='review--profile'>
            <img className='review--image' src={props.Img} alt='img' />
            <span className='reviewer--name'>{props.name}</span>
            <br />
            <span className='ratings'>{props.ratings}</span>
          </div>
          <div className='review--text'>{props.review}</div>
          <div className='like-section'>
            <button className={`like-button ${liked ? "liked" : ""}`} onClick={handleLikeClick}>
              <FaThumbsUp />
            </button>
            <span>{likesCount}</span>
            <button className={`like-button ${disliked ? "disliked" : ""}`} onClick={handleDislikeClick}>
              <FaThumbsDown />
            </button>
            <span>{dislikesCount}</span>
          </div>
        </div>
      </div>
    );
  }

export default ReviewComponent