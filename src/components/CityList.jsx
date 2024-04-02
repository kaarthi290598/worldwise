import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../contexts/CitiesContext";

function Citylist() {
  const { cities, isloading } = useCities();

  if (isloading) return <Spinner />;

  if (!cities.length)
    return <Message message={"Add cities by clicking the city on the map"} />;

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default Citylist;
