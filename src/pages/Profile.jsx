import { CgProfile } from "react-icons/Cg";
import "./Profile.css"
import { Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { load_user, logout } from "../actions/auth";
import { useNavigate } from 'react-router-dom';


export default function Profile({}) {
  const isAuthenticated = useSelector(state=>state.auth.isAuthenticated)
  const contributions = useSelector(state=>state.auth.contriubtions)

  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()

  const navigate=useNavigate();
  const handleEdit=()=>{
    navigate('/editprofile');
  }
  useEffect(()=>{
    dispatch(load_user())
  }, [])
  const handleSubscribe = () => {}
  if(isAuthenticated)
    return (
 
      <div className="profile--container">
        <div className="profile--leftpart">
          <div className="profile--pic">
            <CgProfile /><br/>
            <label className="profile--name">{user?.fname + ' ' + user?.lname}</label>
            <br />
            <label className="profile--role">Hya role hala</label>
          </div>
          
          <div className="profile--level">
            <div className="profile--level-bar"></div>
            <label>Level 1</label>
            <br />
            <label>69/100</label>
          </div>
          <div className="profile--userinfo">
        <div><h5 className="p-userinfo--email">{user?.email}</h5></div>
        <div><h5 className="p-userinfo--email">{user?.number}</h5></div>
      </div>
      <button className="profile--edit-btn" onClick={handleEdit}>Edit Profile</button>
      <button className="profile--subscribe-btn" onClick={handleSubscribe}>Subscribe</button>
      <button onClick={() => dispatch(logout())} className="logout-btn">Logout</button>

        </div>
        <div className="profile--rightpart">
          <div className="profile--booking--list">
            <div><p>Booking List</p>
            
            </div>
            <button className="more-btn">More</button>
          </div>
          <div className="profile--contribution">
            <p>Recent Contributions</p>
            <div className="profile--contribution--list">
            <ul>
              {
                contributions?.length && contributions?.map(c=>{
                  return(<li>
                    <p>{c.title || "Title here"}</p>
                    <br />
                    <p>{c.address || "Address here"}</p>
                  </li>)
                })
              }
            </ul>
          </div>
            
            </div>
          
          
          <button className="cont--more--btn">More</button>
        </div>
        <div className="profile--saved">
          <h5>Saved</h5>
          //yeta saved map garne
        </div>
        <div className="Your hotel">
          //Your hotel here
        </div>
      </div>
      
    
    );
    else
      return <Navigate to='/'/>
}

