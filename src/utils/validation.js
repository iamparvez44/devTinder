function validateEditProfileData(req) {

  const allowedField = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const isEditallowed = Object.keys(req.body).every((field) =>
    allowedField.includes(field),
  );

  return isEditallowed;
}

module.exports = {
    validateEditProfileData
}
