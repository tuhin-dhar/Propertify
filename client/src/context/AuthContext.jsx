import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [currentUser, setCurrrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  console.log(currentUser);

  function updateUser(data) {
    setCurrrentUser(data);
  }

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
