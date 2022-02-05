import { GET_ERRORS } from "./types";
import axios from "axios";

export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post("http://localhost:5555/api/users/register", userData)
    .then((res) => history.pussh("/login"))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
