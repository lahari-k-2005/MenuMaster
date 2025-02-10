import React, { createContext, useState } from 'react';

const RegNoContext = createContext();

export const RegNoProvider = ({ children }) => {
  const [regNo, setRegNo] = useState(null);
  const [stallName, setStallName] = useState(null);

  return (
    <RegNoContext.Provider value={{ regNo, setRegNo, stallName, setStallName }}>
      {children}
    </RegNoContext.Provider>
  );
};

export default RegNoContext;
