"use client"

import { useEffect, useState } from "react"
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet"
import type L from "leaflet"
// leaflet.css is imported by the parent modal component

// Icons are initialized lazily inside the component (see useEffect below)
// to avoid Turbopack/Next.js running Leaflet code before the DOM is ready.

export interface BusinessMarker {
  name: string
  lat: number | null
  lng: number | null
  address?: string
}

interface Props {
  center: [number, number]
  radiusKm: number
  businesses?: BusinessMarker[]
  onMapClick?: (lat: number, lng: number) => void
}

// Syncs map view to center prop changes
function MapController({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1]])
  return null
}

// Handles click-to-pin
function ClickHandler({ onClick }: { onClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick?.(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function LocalBusinessesMap({ center, radiusKm, businesses = [], onMapClick }: Props) {
  const [icons, setIcons] = useState<{ default: InstanceType<typeof L.Icon>; result: InstanceType<typeof L.Icon> } | null>(null)

  // Initialize Leaflet icons client-side only — avoids Turbopack running Leaflet before the DOM exists
  useEffect(() => {
    import("leaflet").then((L) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      const defaultIcon = new L.Icon.Default()

      const resultIcon = new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [20, 33],
        iconAnchor: [10, 33],
        popupAnchor: [0, -33],
        shadowSize: [33, 33],
        className: "opacity-70",
      })

      setIcons({ default: defaultIcon, result: resultIcon })
    })
  }, [])

  // Don't render the map until icons are ready (prevents the appendChild TypeError)
  if (!icons) return null

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="h-full w-full"
      zoomControl={true}
      style={{ cursor: "crosshair" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
      />
      <MapController center={center} />
      <ClickHandler onClick={onMapClick} />

      {/* Radius circle */}
      <Circle
        center={center}
        radius={radiusKm * 1000}
        pathOptions={{
          color: "#6366f1",
          fillColor: "#6366f1",
          fillOpacity: 0.12,
          weight: 2,
        }}
      />

      {/* Center pin */}
      <Marker position={center} icon={icons.default} />

      {/* Result markers */}
      {businesses
        .filter((b) => b.lat !== null && b.lng !== null)
        .map((b, i) => (
          <Marker key={i} position={[b.lat!, b.lng!]} icon={icons.result}>
            <Popup>
              <strong>{b.name}</strong>
              {b.address && <><br /><span style={{ fontSize: 11, color: "#888" }}>{b.address}</span></>}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  )
}
