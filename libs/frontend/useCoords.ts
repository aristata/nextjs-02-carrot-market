import { useEffect, useState } from "react";
/**
 * coord = coordination(좌표) 의 약어
 * longitude = 경도
 * latitude = 위도
 */
interface CoordState {
  longitude: number | null;
  latitude: number | null;
}

export default function useCoords() {
  const [coord, setCoord] = useState<CoordState>({
    longitude: null,
    latitude: null
  });

  const onSuccess = ({
    coords: { latitude, longitude }
  }: GeolocationPosition) => {
    setCoord({ latitude, longitude });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onSuccess);
  }, []);

  return coord;
}
