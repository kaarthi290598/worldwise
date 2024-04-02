import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isloading: false,
  currentCity: "",
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isloading: true,
      };
    case "error":
      return {
        ...state,
        isloading: false,
        error: action.payload,
      };

    case "cities/loaded":
      return {
        ...state,
        isloading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return {
        ...state,
        isloading: false,
        currentCity: action.payload,
      };
    case "cities/created":
      return {
        ...state,
        isloading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "cities/deleted":
      return {
        ...state,
        isloading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };

    default:
      throw new Error("Invalid Action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isloading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8000/cities");
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({ type: "error", payload: "There is a error loading data" });
      }
    }

    fetchData();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`http://localhost:8000/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch {
        dispatch({ type: "error", payload: "There is a error loading data" });
      }
    },
    [currentCity.q]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`http://localhost:8000/cities/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "cities/created", payload: data });
    } catch {
      dispatch({ type: "error", payload: "There is a error creating city" });
    }
  }

  async function deleteCity(cityId) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`http://localhost:8000/cities/${cityId}/`, {
        method: "DELETE",
      });

      if (res.ok) {
        dispatch({ type: "cities/deleted", payload: cityId });
      } else {
        throw new Error(`Failed to delete city: ${res.status}`);
      }
    } catch {
      dispatch({ type: "error", payload: "There is a error deleting city" });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isloading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Cities context is used out of scope");
  return context;
}

export { CitiesProvider, useCities };
