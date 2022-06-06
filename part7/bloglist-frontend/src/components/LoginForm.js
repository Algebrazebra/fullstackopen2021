import React from "react";
import Notification from "./Notification";

const LoginForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleLogin,
  notification,
}) => (
  <form onSubmit={handleLogin}>
    <h2>login to application</h2>
    <Notification message={notification} />
    <div>
      username
      <input
        id="username"
        type="text"
        value={username}
        name="Username"
        onChange={handleUsernameChange}
      />
    </div>
    <div>
      password
      <input
        id="password"
        type="password"
        value={password}
        name="Password"
        onChange={handlePasswordChange}
      />
    </div>
    <button id="login-button" type="submit">
      login
    </button>
  </form>
);

export default LoginForm;
