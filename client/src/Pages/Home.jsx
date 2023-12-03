import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success('Created a new Room')
  };
  const joinRoom = () => {
    if(!roomId || !userName){
      toast.error('ROOM ID & username is required');
      return;
    }
    //Redirect
    navigate(`/editor/${roomId}`, {
      state:{
        userName,
      }
    });
  }

  const handleInputEnter = (e) =>{
    if(e.code === 'Enter'){
      joinRoom();
    }
  }

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img src="/connect-logo2.png" alt="code-sync-logo" />
        <h4 className="mainLable1">Connect With Coders</h4>
        <h4 className="mainLable">Through ROOM-ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            placeholder="ROOM ID"
            value={roomId}
            className="inputBox"
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            placeholder="USERNAME"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="inputBox"
            onKeyUp={handleInputEnter}
          />
          <button className="btn joinBtn" onClick={joinRoom}>Join</button>
          <span className="createInfo">
            If you don't have an invite then create &nbsp;{" "}
            <div>
              <a onClick={createNewRoom} href="">
                new room
              </a>
            </div>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Built with 💛 by <a href={"https://github.com/ashusatp"}>Ashu</a>
        </h4>
      </footer>
    </div>
  );
};

export default Home;
