import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, LayersControl, useMap, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { BingLayer } from 'src/@core/components/bingmap';
import ReactLeafletKml from "react-leaflet-kml";
import MapPopup from './pop-up';
import { Box } from '@mui/material';
import { ConverterCood } from './convert-coord';
import BoxLoading from '../box-loading';

const { BaseLayer } = LayersControl;

const SetViewOnClick = ({ coords, zoom }: any) => {
	const map = useMap();
	map.flyTo(coords, zoom, {
		duration: 1
	});

	return null;
}

// Create icon for map marker
const createIcon = (data: any) => {
	return new L.Icon({
		iconUrl: data.id == 1 ? '/images/icon/hochua.png' : '/images/icon/live.gif',
		iconSize: [18, 18],
		iconAnchor: [18, 18],
		popupAnchor: [-9, -18]
	});
}

export default function Map({ center, zoom, mapData, loading }: any) {
	const [bing_key, setBingKey] = useState("AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L")
	const [kml, setKml] = useState<any>(null);

	useEffect(() => {
		setBingKey("AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L")
		fetch(
			"/kml/tinh-quangngai.kml"
		)
			.then((res) => res.text())
			.then((kmlText) => {
				const parser = new DOMParser();
				const kml = parser.parseFromString(kmlText, "text/xml");
				setKml(kml);
			});
	}, []);

	return (
		loading ? (
			<Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<BoxLoading />
			</Box>
		) : (
			<>
				<MapContainer attributionControl={false} center={center} zoom={zoom} style={{ height: '100%' }}>
					<LayersControl position='bottomright'>
						<BaseLayer name='Bản đồ hành chính'>
							<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
						</BaseLayer>
						<BaseLayer name='Bản đồ đường'>
							<BingLayer bingkey={bing_key} type="Road" />
						</BaseLayer>
						<BaseLayer name="Bản đồ vệ tinh 1">
							<TileLayer url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' />
						</BaseLayer>
						<BaseLayer checked name='Bản đồ vệ tinh 2'>
							<BingLayer bingkey={bing_key} type="AerialWithLabels" />
						</BaseLayer>
					</LayersControl>
					{mapData && mapData.map((data: any) => {
						if (data.x !== null || data.y !== null) {
							return (
								<Marker icon={createIcon(data)} key={data.id} position={[ConverterCood(data.y, data.x)[0], ConverterCood(data.y, data.x)[1]]}>
									<Tooltip direction="top" offset={[-10, -18]} opacity={1} permanent>{data.name}</Tooltip>
									<Popup>
										<MapPopup popupData={data} />
									</Popup>
								</Marker>
							)
						} else return null;
					})}
					<SetViewOnClick coords={center} zoom={zoom} />
					{kml && <ReactLeafletKml kml={kml} />}
				</MapContainer>
			</>
		)
	);
}