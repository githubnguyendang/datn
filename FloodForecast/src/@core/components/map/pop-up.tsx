import { Typography } from "@mui/material";

const MapPopup = ({ popupData }: any) => {
    return (
        <>
            <Typography sx={{ color: '#035291', textAlign: 'center', fontWeight: 'bold', margin: '0 !important' }}>{popupData.name}</Typography>
        </>
    )
}

export default MapPopup;