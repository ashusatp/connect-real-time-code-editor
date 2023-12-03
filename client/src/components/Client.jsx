import React from "react";
import Avatar from 'react-avatar';
const Client = ({ userName }) => {
  return (
    <div className="client">
      <Avatar name={userName} size={50} round="14px" />
      <span className="userName">{userName.length >= 9 ? `${userName.slice(0,6)}...` : userName}</span>
    </div>
  );
};

export default Client;
