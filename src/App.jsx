import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Suspense, lazy } from "react";

//context
import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/FakeAuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

//pages
import Citylist from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import SpinnerFullPage from "./components/SpinnerFullPage";

// import Product from "./pages/Product";
// import Homepage from "./pages/Homepage";
// import Pricing from "./pages/Pricing";
// import AppLayout from "./pages/AppLayout";
// import PageNotFound from "./pages/AppLayout";
// import Login from "./pages/Login";

const Product = lazy(() => import("./pages/Product"));
const Homepage = lazy(() => import("./pages/Homepage"));
const Pricing = lazy(() => import("./pages/Pricing"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Login = lazy(() => import("./pages/Login"));

// dist/assets/index-7a98a6af.css   31.91 kB │ gzip:   5.28 kB
// dist/assets/index-776ae48b.js   532.92 kB │ gzip: 150.57 kB

function App() {
  // const [countries, setCountries] = useState([]);

  // function uniqueCount(data) {
  //   const uniqueCountries = new Set();

  //   // Iterate over the cities and add their countries to the set
  //   data.forEach((city) => uniqueCountries.add(city.country));

  //   // Create an empty array to store the objects with unique countries
  //   const uniqueCities = [];

  //   // Iterate over the cities again and add them to the list if their country is unique
  //   data.forEach((city) => {
  //     if (uniqueCountries.has(city.country)) {
  //       uniqueCities.push(city);
  //       uniqueCountries.delete(city.country);
  //     }
  //   });

  //   setCountries(uniqueCities);
  // }

  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route index element={<Homepage />} />
              <Route path="Pricing" element={<Pricing />} />
              <Route path="Product" element={<Product />} />

              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to={"cities"} />} />
                <Route path="cities" element={<Citylist />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>

              <Route path="*" element={<PageNotFound />} />
              <Route path="login" element={<Login />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
