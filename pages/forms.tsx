import React, { useState } from "react";
import { useForm } from "react-hook-form";

/**
 * 일반적인 폼 =>
 * 1. 인풋마다 스테이트를 가진다
 * 2. 인풋마다 이벤트 리스너를 정의해야 한다
 * 3. 서브밋을 할 때 밸리데이션을 인풋마다 구현해야 한다
 * 
 * react-hook-form =>
 * 1. 폼보다 적은 코드로 같은 기능을 구현할 수 있다
 * 2. 인풋에 적용하기 쉽다
 * 3. 이벤트를 신경쓰지 않아도 된다 
 */
// 더 나은 밸리데이션
// 더 나은 에러
// 인풋 컨트롤 유지

export default function Forms() {
  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const onUsernameChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
  //   const {
  //     currentTarget: { value },
  //   } = event;
  //   setUsername(value);
  // };
  // const onEmailChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
  //   const {
  //     currentTarget: { value },
  //   } = event;
  //   setEmail(value);
  // };
  // const onPasswordChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
  //   const {
  //     currentTarget: { value },
  //   } = event;
  //   setPassword(value);
  // };
  // const onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   console.log(username, email, password);
  // }
  const { register, watch } = useForm();
  console.log(watch());
  return (
    <form>
      <input type={"text"} placeholder="Username" {...register("username")} />
      <input type={"email"} placeholder="Email" {...register("email")} />
      <input type={"password"} placeholder="password" {...register("password")} />
      <input type={"submit"} value="Create Account" />
    </form>
  );
}
