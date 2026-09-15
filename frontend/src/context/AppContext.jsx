import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const FAVS_KEY = "aulp_favs";
const GARAGE_KEY = "aulp_garage";

export function AppProvider({ children }) {
  // navigation stack of screens
  const [stack, setStack] = useState([{ screen: "home" }]);
  const current = stack[stack.length - 1];

  const push = useCallback((s) => setStack((st) => [...st, s]), []);
  const back = useCallback(() => setStack((st) => (st.length > 1 ? st.slice(0, -1) : st)), []);
  const goHome = useCallback(() => setStack([{ screen: "home" }]), []);

  // modals
  const [modal, setModal] = useState(null); // {type, props}
  const openModal = useCallback((type, props = {}) => setModal({ type, props }), []);
  const closeModal = useCallback(() => setModal(null), []);

  // favorites
  const [favs, setFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(FAVS_KEY)) || []; } catch { return []; }
  });
  const toggleFav = useCallback((id) => {
    setFavs((f) => {
      const next = f.includes(id) ? f.filter((x) => x !== id) : [...f, id];
      localStorage.setItem(FAVS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  const isFav = useCallback((id) => favs.includes(id), [favs]);

  // garage (vehicles)
  const [garage, setGarage] = useState(() => {
    try { return JSON.parse(localStorage.getItem(GARAGE_KEY)) || []; } catch { return []; }
  });
  const addVehicle = useCallback((v) => {
    setGarage((g) => {
      const next = [...g, { ...v, id: Date.now().toString() }];
      localStorage.setItem(GARAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  const removeVehicle = useCallback((id) => {
    setGarage((g) => {
      const next = g.filter((x) => x.id !== id);
      localStorage.setItem(GARAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // geo / near me
  const [nearMe, setNearMe] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const enableNearMe = useCallback(() => {
    if (!navigator.geolocation) { setNearMe(true); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserCoords([pos.coords.latitude, pos.coords.longitude]); setNearMe(true); },
      () => { setUserCoords([-34.9214, -57.9544]); setNearMe(true); }
    );
  }, []);
  const toggleNearMe = useCallback(() => {
    if (nearMe) setNearMe(false);
    else enableNearMe();
  }, [nearMe, enableNearMe]);

  const [motoIntro, setMotoIntro] = useState(false);

  const value = {
    current, push, back, goHome, stackDepth: stack.length,
    modal, openModal, closeModal,
    favs, toggleFav, isFav,
    garage, addVehicle, removeVehicle,
    nearMe, userCoords, toggleNearMe,
    motoIntro, setMotoIntro,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
