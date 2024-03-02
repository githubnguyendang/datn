import axios from 'axios';
import jwt_decode from 'jwt-decode';
import apiUrl from 'src/api/config';

interface DecodedToken {
    [key: string]: any;
}

export const checkAccessPermission = async (linkControl: string | undefined, action: string | undefined) => {
    if (typeof sessionStorage !== 'undefined') {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            const decodedToken: DecodedToken = jwt_decode(token) as DecodedToken;
            const user = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
            try {
                const response = await axios.post(`${apiUrl}/Auth/check-access-permission?userName=${user}&linkControl=${linkControl}&action=${action}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                return response.data;
            } catch (error) {
                console.error('Error posting data:', error);
                throw error;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
};

export const getRole = () => {

    if (typeof sessionStorage !== 'undefined') {

        const token = sessionStorage.getItem('authToken') || '';

        if (token) {
            const decodedToken: DecodedToken = jwt_decode(token) as DecodedToken;

            const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

            return role
        }
    }
};