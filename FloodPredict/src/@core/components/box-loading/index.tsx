import { Box, CircularProgress } from "@mui/material"

const BoxLoading = () => {

    return (
        <Box sx={{ py: 5, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center' }}>
            <CircularProgress size={20} /> <Box textAlign={'center'} width={'100%'}>Đang tải dữ liệu...</Box>
        </Box>
    )
}
export default BoxLoading