import React, { useState } from "react";

export default function Forms() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onUsernameChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setUsername(value);
  };
  const onEmailChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setEmail(value);
  };
  const onPasswordChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setPassword(value);
  };
  const onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(username, email, password);
  }
  return (
    <form onSubmit={onSubmit}>
      <input type={"text"} placeholder="Username" value={username} onChange={onUsernameChange}/>
      <input type={"email"} placeholder="Email" value={email} onChange={onEmailChange}/>
      <input type={"password"} placeholder="password" value={password} onChange={onPasswordChange}/>
      <input type={"submit"} value="Create Account" />
    </form>
  );
}
