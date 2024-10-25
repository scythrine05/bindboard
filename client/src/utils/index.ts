export const generateUserId = () => {
  return Math.random().toString(36).substr(2, 9); // Generate a random ID
};


export const getOrCreateUserData = () => {
  let storedUserData = localStorage.getItem("userData");
  let userData;
  if (!storedUserData) {
    const userId = generateUserId();
    userData = {
      userId,
      displayName: null,
    };
    localStorage.setItem("userData", JSON.stringify(userData));
  } else {
    userData = JSON.parse(storedUserData);
  }
  return userData;
};

export const updateUserData = (displayName: String) => {
  const userData = getOrCreateUserData();
  userData.displayName = displayName;
  localStorage.setItem("userData", JSON.stringify(userData));
};
