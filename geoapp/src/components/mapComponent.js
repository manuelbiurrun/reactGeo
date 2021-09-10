import React from "react";
import {useQuery, useMutation, queryCache} from "react-query";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { formatRelative } from "date-fns";

import mapStyles from "./mapStyles";

const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: -34.901112,
  lng: -56.164532,
};

async function fetchMonks() {
    const response = await fetch("");
    const {monks} = await response.json();
    return monks;
}

async function createMonks(newMonk) {
    const response = await fetch("", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({monk: newMonk}),
    });
    const {monk} = await response.json();
    return monk;
}

export default function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const {data: monks, error} = useQuery("monks", fetchMonks);
  const [mutate] = useMutation(createMonks, {
      onSuccess: (newMonk) => {
          queryCache.setQueryData("monks", (current) => [...current, newMonk])
      },
  });

  const [selected, setSelected] = React.useState(null);

  const onMapClick = React.useCallback((e) => {
    mutate({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
    })
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return <span>Load Error</span>;
  if(error) return <span>Query Error</span>;  
  if (!isLoaded) return <span>...Loading...</span>;

  return (
    <div>
      <h1>
        FoodMonks{" "}
        <span role="img" aria-label="tent">
          ⛺️
        </span>
      </h1>

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {monks.map((monk) => (
          <Marker
            key={`${monk.lat}-${monk.lng}`}
            position={{ lat: monk.lat, lng: monk.lng }}
            onClick={() => {
              setSelected(monk);
            }}
            icon={{
              url: `/bear.svg`,
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        ))}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <h2>
                <span role="img" aria-label="bear">
                  🐻
                </span>{" "}
                Alert
              </h2>
              <p>Spotted {formatRelative(selected.time, new Date())}</p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}