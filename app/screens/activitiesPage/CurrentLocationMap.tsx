import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export const CurrentLocationMap: React.FC = () => {
  const mapHeight = 300;
  const mapWidth = Dimensions.get("window").width - 40;
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const generateMapHtml = (lat: number, lng: number) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
          <style>
            html, body {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
            }
            #map {
              width: 100%;
              height: 100%;
              background-color: #f8f8f8;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            window.onload = function() {
              try {
                const map = L.map('map', {
                  zoomControl: true,
                  attributionControl: false,
                  dragging: false,
                  touchZoom: false,
                  scrollWheelZoom: false,
                  doubleClickZoom: false,
                  boxZoom: false,
                  keyboard: false
                });

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: 19,
                  attribution: '© OpenStreetMap contributors'
                }).addTo(map);

                const currentLocation = [${lat}, ${lng}];
                const marker = L.marker(currentLocation, {
                  icon: L.divIcon({
                    className: 'current-location-icon',
                    html: '<div style="background-color: #A18AE6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>'
                  })
                }).addTo(map);

                map.setView(currentLocation, 15);
              } catch (error) {
                console.error('Error initializing map:', error);
              }
            };
          </script>
        </body>
      </html>
    `;
  };

  if (!currentLocation) {
    return null;
  }

  return (
    <WebView
      style={[styles.map, { height: mapHeight, width: mapWidth }]}
      source={{
        html: generateMapHtml(
          currentLocation.latitude,
          currentLocation.longitude
        ),
      }}
      scrollEnabled={false}
      zoomable={false}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      scalesPageToFit={false}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn("WebView error: ", nativeEvent);
      }}
    />
  );
};

const styles = StyleSheet.create({
  map: {
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 10,
    backgroundColor: "#f8f8f8",
  },
});
