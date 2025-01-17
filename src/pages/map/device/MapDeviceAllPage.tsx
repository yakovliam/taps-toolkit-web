import { Device, useListDevices } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { Skeleton } from "@/components/ui/skeleton";
import { Map, Marker, Popup } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useState } from "react";

const MapDeviecAllPage = () => {
  const config = useAuthenticatedClientConfig();
  const { data, isPending } = useListDevices(config);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <div className="text-lg font-semibold">All Devices</div>
          <p className="text-sm text-muted-foreground">View all devices.</p>
        </div>
        {isPending && <Skeleton className="w-full h-40" />}
        {data && <MapView devices={data.data} />}
      </div>
    </div>
  );
};

type MapViewProps = {
  devices: Device[];
};

type PopupState = {
  deviceUid: string;
  isOpen: boolean;
};

const MapView = ({ devices }: MapViewProps) => {
  const [popupState, setPopupState] = useState<PopupState[]>([]);

  const togglePopup = (deviceUid: string) => {
    setPopupState((prevState) => {
      if (prevState.find((state) => state.deviceUid === deviceUid)) {
        return prevState.map((state) => {
          if (state.deviceUid === deviceUid) {
            return {
              deviceUid,
              isOpen: !state.isOpen,
            };
          }

          return state;
        });
      }

      return [
        ...prevState,
        {
          deviceUid,
          isOpen: true,
        },
      ];
    });
  };

  const closePopup = (deviceUid: string) => {
    setPopupState((prevState) => {
      return prevState.map((state) => {
        if (state.deviceUid === deviceUid) {
          return {
            deviceUid,
            isOpen: false,
          };
        }

        return state;
      });
    });
  };

  return (
    <div>
      <Map
        initialViewState={{
          zoom: 2,
          latitude: 39.8283,
          longitude: -98.5795,
        }}
        style={{ width: "100%", height: "500px" }}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
      >
        {devices.map((device) => (
          <Marker
            key={device.uid}
            longitude={device.longitude}
            latitude={device.latitude}
            anchor="bottom"
            color="red"
            onClick={() => {
              togglePopup(device.uid);
            }}
          >
            {popupState.find((state) => state.deviceUid === device.uid)
              ?.isOpen && (
              <Popup
                longitude={device.longitude}
                latitude={device.latitude}
                closeButton={true}
                closeOnClick={false}
                onClose={() => closePopup(device.uid)}
                offset={50}
              >
                <div className="flex flex-col gap-2 w-40 h-20 opacity-50">
                  <div className="text-xs font-semibold">Device</div>
                  <div className="text-xs">{device.uid}</div>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </Map>
    </div>
  );
};

export default MapDeviecAllPage;
