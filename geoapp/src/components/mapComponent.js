import React from "react";
import {useQuery, useMutation, queryCache} from "react-query";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { formatRelative } from "date-fns";

import * as clave from "./clave"

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
const center = {//coordenadas de montevideo
  lat: -34.901112,
  lng: -56.164532,
};

async function fetchMonks() {
    const response = await fetch("http://localhost:8080/api/v1/todas");
    const {monks} = await response.json();
    return monks;
}

async function createMonks(newMonk) {
    const response = await fetch("http://localhost:8080/api/v1/agregar", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({monk: newMonk}),
    });
    const {monk} = await response.json();
    return monk;
}

export default function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: clave.clave
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

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  if (loadError) return <span>Load Error</span>;
  if(error) return <span>Query Error</span>;  
  if (!isLoaded) return <span>...Loading...</span>;

  return (
    <div>
      <h1>
        FoodMonks{" "}
        <span role="img" aria-label="mosque">
          🕌 
        </span>
      </h1>

      <Locate panTo={panTo}/>

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
              url: `./src/steaming-bowl.svg`,
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
                <span role="img" aria-label="steaming-bowl">
                🍜
                </span>{" "}
                Alert
              </h2>
              <p>Food Munks {formatRelative(selected.time, new Date())}</p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}

function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <img src="./src/compass.svg" alt="compass" />
    </button>
  );
}