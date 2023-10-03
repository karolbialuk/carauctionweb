import { createContext, useContext, useState } from "react";

const NavbarContext = createContext();

export function useNavbarContext() {
  return useContext(NavbarContext);
}

export function NavbarProvider({ children }) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <NavbarContext.Provider value={{ searchValue, setSearchValue }}>
      {children}
    </NavbarContext.Provider>
  );
}
