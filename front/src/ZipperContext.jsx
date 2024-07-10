import React, { createContext, useContext, useState } from 'react';

// Context 생성
const ZipperContext = createContext();

// Provider 컴포넌트
export const ZipperProvider = ({ children }) => {
  const [zipperOn, setZipperOn] = useState(true);
  const [zipperClosing, setZipperClosing] = useState(false);

  const closeZipper = () => {
    setZipperClosing(true);
    window.scrollTo(0, 0);
    setTimeout(() => {
      setZipperOn(false);
    }, 500);
  };

  return (
    <ZipperContext.Provider value={{ zipperOn, zipperClosing, setZipperClosing, closeZipper }}>
      {children}
    </ZipperContext.Provider>
  );
};

// Custom Hook
export const useZipper = () => useContext(ZipperContext);
