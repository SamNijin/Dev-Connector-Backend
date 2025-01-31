const validator = require("validator");
const { isNull } = require("./common_validation");

// Validate Registration
const validateRegistration = (data) => {
  let errors = {};

  if (!validator.isLength(data.name, { min: 5, max: 50 }))
    errors.name = "Name should be between 5 and 50 characters";
  if (data.name.trim().length === 0) errors.name = "Name can't be empty";
  if (!validator.isEmail(data.email)) errors.email = "Invalid email";
  if (!validator.isStrongPassword(data.password))
    errors.password = "Password does not met with required standards";
  if (data.password !== data.confirmPassword)
    errors.password = "Password and confirm password does not match";

  return {
    errors,
    isValid: isNull(errors),
  };
};

// Validate Login
const validateLogin = (data) => {
  let errors = {};

  if (!validator.isEmail(data.email)) errors.email = "Invalid email";
  if (isNull(data.password))
    errors.password = "Empty passwords are not allowed";

  return {
    errors,
    isValid: isNull(errors),
  };
};

module.exports = { validateRegistration, validateLogin };
