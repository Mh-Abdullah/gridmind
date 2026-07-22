"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { createLeafletContext, LeafletContext, type LeafletContextInterface } from "@react-leaflet/core"
import {
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet"
import { Map as LeafletMap, type MapOptions } from "leaflet"
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

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

interface Props {
  center: [number, number]
  businesses?: BusinessMarker[]
  onMapClick?: (lat: number, lng: number) => void
  onBoundsChange?: (bounds: MapBounds) => void
}

interface StableMapContainerProps extends MapOptions {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

// React 19 replays effects in development. React-Leaflet's MapContainer can
// remove its Leaflet instance during that replay, before its child layers mount.
function StableMapContainer({
  center,
  zoom,
  children,
  className,
  style,
  ...options
}: StableMapContainerProps) {
  const mapInstanceRef = useRef<LeafletMap | null>(null)
  const [context, setContext] = useState<LeafletContextInterface | null>(null)

  const mapRef = useCallback((node: HTMLDivElement | null) => {
    if (!node || mapInstanceRef.current) return

    const map = new LeafletMap(node, options)
    mapInstanceRef.current = map
    if (center != null && zoom != null) map.setView(center, zoom)
    setContext(createLeafletContext(map))
  // Map creation options are intentionally immutable after the first mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    return () => {
      const map = mapInstanceRef.current
      if (!map) return

      // Strict-mode effect replay leaves the container connected. A real
      // unmount disconnects it, at which point Leaflet can be safely removed.
      queueMicrotask(() => {
        if (mapInstanceRef.current === map && !map.getContainer().isConnected) {
          map.remove()
          mapInstanceRef.current = null
        }
      })
    }
  }, [])

  return (
    <div ref={mapRef} className={className} style={style}>
      {context ? <LeafletContext value={context}>{children}</LeafletContext> : null}
    </div>
  )
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

// Emits viewport bounds on pan/zoom and on first mount
function BoundsTracker({ onChange }: { onChange: (b: MapBounds) => void }) {
  const map = useMap()
  useEffect(() => {
    const emit = () => {
      const b = map.getBounds()
      onChange({ north: b.getNorth(), south: b.getSouth(), east: b.getEast(), west: b.getWest() })
    }
    emit()
    map.on("moveend zoomend", emit)
    return () => { map.off("moveend zoomend", emit) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])
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

export default function LocalBusinessesMap({ center, businesses = [], onMapClick, onBoundsChange }: Props) {
  const [icons, setIcons] = useState<{ default: InstanceType<typeof L.Icon>; result: InstanceType<typeof L.Icon> } | null>(null)

  // Initialize Leaflet icons client-side only — avoids Turbopack running Leaflet before the DOM exists
  useEffect(() => {
    let active = true

    import("leaflet").then((L) => {
      if (!active) return

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

    return () => {
      active = false
    }
  }, [])

  // Don't render the map until icons are ready (prevents the appendChild TypeError)
  if (!icons) return null

  return (
    <StableMapContainer
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
      {onBoundsChange && <BoundsTracker onChange={onBoundsChange} />}

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
    </StableMapContainer>
  )
}
