import React from "react";

const LogoutForm = ({ user, handleLogout }) => {
  return (
    <p>
      {user.name} logged in
      <button type="button" onClick={handleLogout}>
        logout
      </button>
    </p>
  );
};

export default LogoutForm;
