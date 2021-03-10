import { useRef, useState } from "react";
import Link from "next/link";
import { Image } from "cloudinary-react";
import ReactMapGL, { Marker, Popup, ViewportProps, ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// import { useLocalState } from "src/utils/useLocalState";
// import { HousesQuery_houses } from "src/generated/HousesQuery";
// import { SearchBox } from "./searchBox";

interface MapProps {
    
}

export default function Map(props: MapProps) {
    const mapref = useRef<ReactMapGL | null>(null)
    const [viewPort, setViewPort] = useState<ViewState>({
        latitude: 45,
        longitude: -65,
        zoom: 10
    })

    function handleViewPort(viewPort: ViewportProps): void {
        setViewPort(viewPort)
    }

    return (
        <div className='text-black relative'>
            <ReactMapGL
                {...viewPort}
                width= '100%'
                height= 'calc(100vh - 64px)'
                mapboxApiAccessToken= {process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
                onViewportChange={viewPort => handleViewPort(viewPort)}
            >

            </ReactMapGL>
        </div>
    )
}
