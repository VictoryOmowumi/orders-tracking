import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToStaticMarkup } from "react-dom/server";
import { Store, Truck, Warehouse } from "lucide-react";

type LatLng = [number, number];

const routePointsRaw: LatLng[] = [
  [6.600498067824902, 3.3754599656425066],
  [6.593991256317812, 3.38238099512706],
  [6.595784413067102, 3.3829919857273616],
  [6.598870027474937, 3.3862964357331933],
  [6.603826665692039, 3.3902617757401923],
  [6.6107199210756615, 3.3953506287491724],
  [6.613777506816921, 3.398740777810212],
  [6.61683509255818, 3.4021309268712517],
  [6.619892678299439, 3.4055210759322914],
  [6.622950264040698, 3.408911224993331],
  [6.626007849781957, 3.4123013740543707],
  [6.629065435523216, 3.4156915231154104],
  [6.632123021264475, 3.41908167217645],
  [6.635180607005734, 3.4224718212374897],
];

const deliveryPoint: LatLng = routePointsRaw[routePointsRaw.length - 1];

const densifyRoute = (points: LatLng[], stepsPerLeg = 6): LatLng[] => {
  if (points.length <= 1) return points;
  const result: LatLng[] = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const [lat1, lng1] = points[i];
    const [lat2, lng2] = points[i + 1];
    for (let step = 0; step < stepsPerLeg; step += 1) {
      const t = step / stepsPerLeg;
      result.push([lat1 + (lat2 - lat1) * t, lng1 + (lng2 - lng1) * t]);
    }
  }
  result.push(points[points.length - 1]);
  return result;
};

export function LiveMap() {
  const mapRef = useRef<any>(null);
  const truckMarkerRef = useRef<any>(null);
  const deliveryMarkerRef = useRef<any>(null);
  const routeRef = useRef<any>(null);
  const progressRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const truckIcon = useMemo(() => {
    const svg = renderToStaticMarkup(<Truck size={20} className="text-primary" />);
    return L.divIcon({
      className: "truck-pin",
      html: `
        <div class="relative">
          <div class="absolute inset-0 w-16 h-16 bg-primary/20 rounded-full animate-ping"></div>
          <div class="relative w-10 h-10 bg-foreground text-primary rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
            ${svg}
          </div>
        </div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 25],
    });
  }, []);

  const deliveryIcon = useMemo(
    () => {
      const svg = renderToStaticMarkup(<Store size={18} className="text-foreground" />);
      return L.divIcon({
        className: "delivery-pin",
        html: `
          <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-primary">
            ${svg}
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
    },
    []
  );

  const warehouseIcon = useMemo(
    () => {
      const svg = renderToStaticMarkup(<Warehouse size={18} className="text-foreground" />);
      return L.divIcon({
        className: "warehouse-pin",
        html: `
          <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-foreground">
            ${svg}
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
    },
    []
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const routePoints = densifyRoute(routePointsRaw, 8);
    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(routePoints[0], 13);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    const truckMarker = L.marker(routePoints[0], { icon: truckIcon }).addTo(map);
    L.marker(routePoints[0], { icon: warehouseIcon }).addTo(map);
    const deliveryMarker = L.marker(deliveryPoint, { icon: deliveryIcon }).addTo(map);
    const fullRoute = L.polyline(routePoints, {
      color: "#94a3b8",
      weight: 5,
      opacity: 1,
    }).addTo(map);
    const progressRoute = L.polyline([routePoints[0]], {
      color: "#16a34a",
      weight: 4,
    }).addTo(map);

    truckMarkerRef.current = truckMarker;
    deliveryMarkerRef.current = deliveryMarker;
    routeRef.current = fullRoute;
    progressRef.current = progressRoute;

    let index = 0;
    const timer = window.setInterval(() => {
      index = (index + 1) % routePoints.length;
      const point = routePoints[index];
      truckMarker.setLatLng(point);
      progressRoute.setLatLngs(routePoints.slice(0, index + 1));
      map.panTo(point, { animate: true, duration: 0.6 });
    }, 1800);

    return () => {
      window.clearInterval(timer);
      map.remove();
      mapRef.current = null;
      truckMarkerRef.current = null;
      deliveryMarkerRef.current = null;
      routeRef.current = null;
      progressRef.current = null;
    };
  }, [truckIcon, deliveryIcon]);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
}
