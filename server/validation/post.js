import Validator from "validator";
import isEmpty from "./is-empty.js";

const validatePostInput = (data) => {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }

  if (!Validator.isLength(data.text, { min: 1, max: 300 })) {
    errors.text = "Post must not be more than 300 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validatePostInput;
