import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    //originally uses fetch api, I changed to axios
    const response = await axios
      .post("api/user/login", {
        email,
        password,
      })
      .then(function (response) {
        //save user to local storage
        localStorage.setItem("user", JSON.stringify(response.data));

        //update auth context
        dispatch({ type: "LOGIN", payload: response.data });

        setIsLoading(false);
      })
      .catch(function (err) {
        setIsLoading(false);
        setError(err.response.data.error);
      });

    response.status(200);
  };

  return { login, isLoading, error };
};
