import React, { useState, useEffect, useRef, FC } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Loader2 } from "lucide-react";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MarkerData {
  coordinates: [number, number];
  title: string;
}

const Loader = () => {
  return (
    <div className="h-16 w-full flex items-center justify-center">
      <Loader2 className="size-8 text-slate-300 animate-spin" />
    </div>
  );
};

const MapComponent: FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [markerData, setMarkerData] = useState<MarkerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);

  const mapRef = useRef<any | null>(null);

  const ZoomHandler: FC = () => {
    const map = useMap();

    const flyToMarker = (coordinates: [number, number], zoom: number) => {
      if (coordinates && typeof coordinates[0] !== "undefined") {
        map.flyTo(coordinates, zoom, { animate: true, duration: 1.5 });
      }
    };

    useMapEvents({
      zoomend: () => {
        setLoading(false);
      },
    });

    useEffect(() => {
      if (markerData) {
        if (
          markerData.coordinates &&
          typeof markerData.coordinates[0] !== "undefined"
        ) {
          flyToMarker(markerData.coordinates, 13);
        }
      }
    }, [markerData]);
    // return null as we're not rendering anything to the dom
    return null;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      setQuestion(inputValue);
      setInputValue("");
      // send question to api
      const response = await fetch("/api/coords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: inputValue }),
      });
      // parse the data
      const data = await response.json();
      setMarkerData(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {loading && <Loader />}
      {markerData && markerData.coordinates && (
        <div className="flex items-center justify-center absolute top-3 right-3 z-[11000]">
          <h1 className="text-3xl font-bold text-black p-2 bg-white rounded-md">
            {markerData.title}
          </h1>
        </div>
      )}

      <MapContainer
        style={{ height: "100vh", width: "100vw" }}
        center={[43.83798, -79.46201]}
        zoom={12}
        // boundsOptions={{
        //   center: [48.837, -79.462],
        //   zoom: 11,
        // }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {markerData && markerData.coordinates && (
          <Marker position={markerData?.coordinates}>
            <Popup>{markerData.title}</Popup>
          </Marker>
        )}
        <ZoomHandler />
      </MapContainer>
      {/* show the form with input */}
      <div className="absolute bottom-5 left-0 w-full z-[10000] p-3">
        <div className="flex justify-center">
          {question && (
            <div className="flex items-center justify-center bottom-16 absolute w-full z-[10000]">
              <h1 className="text-3xl font-bold text-black p-2 bg-white rounded-md">
                {question}
              </h1>
            </div>
          )}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow p-2 border border-gray-500 rounded-md text-black bg-white"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
          <button
            onClick={handleSubmit}
            className="p-2 ml-2 bg-blue-500 text-white rounded-md"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default MapComponent;
