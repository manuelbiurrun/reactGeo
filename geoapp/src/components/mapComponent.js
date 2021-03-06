import React from "react";
import {useQuery, useMutation, queryCache, QueryCache} from "react-query";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { formatRelative } from "date-fns";

import * as clave from "./clave"

import mapStyles from "./mapStyles";

import logo from "./logo.png";

import bowl from "./foodMonks3.jpg"

const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

async function fetchMonks() {
    const response = await fetch("http://localhost:8080/api/v1/todas");
    const monks = await response.json();
    return monks;
}

async function createMonks(newMonk) {
    const response = await fetch("http://localhost:8080/api/v1/agregar", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({monk: newMonk}),
    });
    const monk = await response.json();
    return monk;
}

export default function App() {
  const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: clave.clave });
  const {data: monks, error} = useQuery("monks", fetchMonks);
//  const [mutate] = useMutation(createMonks, {
//       onMutate: (newMonk) => {
//         queryCache.cancelQueries("monks");
//  
//         var snapshot = queryCache.getQueryData("monks");
//
//         snapshot = [...snapshot, newMonk];
//  
//        // queryCache.setQueryData("monks", snapshot => [...snapshot, newMonk]);
//  
//         return () => queryCache.setQueryData("monks", snapshot);
//       },
//       onSettled: () => queryCache.refetchQueries("monks"),
//  });

  const [selected, setSelected] = React.useState(null);

  const onMapClick = React.useCallback((e) => {
    createMonks({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
    }).then(queryCache.refetchQueries("monks"));
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
          <img src={logo} alt="logo" width="200px" />
      </h1>

      <Locate panTo={panTo}/>

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        )}
       
        {monks != null ? monks.map((monk) => (
          <Marker
            key={`${monk.latitud}-${monk.longitud}`}
            position={{ lat: monk.latitud, lng: monk.longitud }}
            onClick={() => {
              setSelected(monk);
            }}
            icon={{
              url: bowl ,
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        )): null}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.latitud, lng: selected.longitud }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <h2>
                <span role="img" aria-label="steaming-bowl">
                ????
                </span>{" "}
                Alert
              </h2>
              <p>Food Munks</p>
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
    <span id="brujula" role="img" aria-label="mosque">
    ????
    </span>  
    </button>
  );
}