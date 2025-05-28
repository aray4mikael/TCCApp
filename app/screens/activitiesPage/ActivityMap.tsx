import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { LocationPoint } from "./activitiesScript";

interface ActivityMapProps {
  locationPath: LocationPoint[];
}

export const ActivityMap: React.FC<ActivityMapProps> = ({ locationPath }) => {
  const mapHeight = 200;
  const mapWidth = Dimensions.get("window").width - 40;

  const generateMapHtml = (points: LocationPoint[]) => {
    const polylinePoints = points
      .map((point) => `[${point.latitude}, ${point.longitude}]`)
      .join(",");

    const bounds = points.reduce(
      (acc, point) => {
        return {
          minLat: Math.min(acc.minLat, point.latitude),
          maxLat: Math.max(acc.maxLat, point.latitude),
          minLng: Math.min(acc.minLng, point.longitude),
          maxLng: Math.max(acc.maxLng, point.longitude),
        };
      },
      {
        minLat: points[0]?.latitude || 0,
        maxLat: points[0]?.latitude || 0,
        minLng: points[0]?.longitude || 0,
        maxLng: points[0]?.longitude || 0,
      }
    );

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
            // Wait for the page to load
            window.onload = function() {
              try {
                // Initialize the map
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

                // Add the tile layer
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: 19,
                  attribution: '© OpenStreetMap contributors'
                }).addTo(map);

                // Add the route
                const points = [${polylinePoints}];
                if (points.length > 0) {
                  const polyline = L.polyline(points, {
                    color: '#A18AE6',
                    weight: 4,
                    opacity: 0.8
                  }).addTo(map);

                  // Add start marker
                  const startIcon = L.divIcon({
                    className: 'start-icon',
                    html: '<div style="background-color: #4CAF50; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>'
                  });
                  L.marker(points[0], { icon: startIcon })
                    .addTo(map)
                    .bindPopup('Início')
                    .openPopup();

                  // Add end marker
                  const endIcon = L.divIcon({
                    className: 'end-icon',
                    html: '<div style="background-color: #F44336; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>'
                  });
                  L.marker(points[points.length - 1], { icon: endIcon })
                    .addTo(map)
                    .bindPopup('Fim');

                  // Fit bounds with padding
                  const bounds = [
                    [${bounds.minLat}, ${bounds.minLng}],
                    [${bounds.maxLat}, ${bounds.maxLng}]
                  ];
                  map.fitBounds(bounds, { 
                    padding: [20, 20],
                    maxZoom: 15
                  });
                }
              } catch (error) {
                console.error('Error initializing map:', error);
              }
            };
          </script>
        </body>
      </html>
    `;
  };

  return (
    <WebView
      style={[styles.map, { height: mapHeight, width: mapWidth }]}
      source={{ html: generateMapHtml(locationPath) }}
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
