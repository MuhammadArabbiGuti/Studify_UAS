import { createContext, useContext, useState } from "react";

const RoleContext = createContext();
export const useRole = () => useContext(RoleContext);

export function RoleProvider({ children }) {
  const [role, setRole] = useState(null);
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}
