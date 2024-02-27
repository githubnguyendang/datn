import axios from 'axios';
import apiUrl from '../config';
import { enqueueSnackbar } from 'notistack';

export async function getData(url: string, params?: any) {
    const token = sessionStorage.getItem('authToken');
    try {
        const response = await axios.get(`${apiUrl}/${url}`, {
            params,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export async function saveData(url: string, data: any) {
    const token = sessionStorage.getItem('authToken');
    const filteredData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value === "" ? null : value])
    );
    
    try {
        const response = await axios.post(`${apiUrl}/${url}`, filteredData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        enqueueSnackbar(`${response.data.message}`, { variant: 'success' });

        return response.data;
    } catch (error) {
        enqueueSnackbar('Lỗi lưu dữ liệu', { variant: 'error' });
        console.error('Error posting data:', error);
        throw error;
    }
}

export async function deleteData(url: string, resourceId: any) {
    const token = sessionStorage.getItem('authToken');
    try {
        const response = await axios.get(`${apiUrl}/${url}/${resourceId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        enqueueSnackbar(`${response.data.message}`, { variant: 'success' });

        return response.data;
    } catch (error) {
        enqueueSnackbar('Lỗi xóa dữ liệu', { variant: 'error' });
        console.error('Error deleting data:', error);
        throw error;
    }
}

export async function uploadFile(postData: any) {
    const token = sessionStorage.getItem('authToken');

    if (!token) {
        enqueueSnackbar('Lỗi authToken', { variant: 'error' });

        return false;
    }

    try {
        const formData = new FormData();
        formData.append('filePath', postData.filePath);
        formData.append('fileName', `${postData.fileName}`);
        formData.append('file', postData.file);

        const response = await axios.post(`${apiUrl}/file/upload`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status === 200) {
            enqueueSnackbar('File upload thành công', { variant: 'success' });

            const resData = response.data;

            return resData?.id || true;
        } else {
            enqueueSnackbar('File upload thất bại', { variant: 'error' });
            console.error('Error:', response);

            return false;
        }
    } catch (error) {
        enqueueSnackbar('File upload thất bại', { variant: 'error' });
        console.error('Error:', error);

        return false;
    }
}