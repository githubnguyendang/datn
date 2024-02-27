import jwt_decode from 'jwt-decode';

interface DecodedToken {
    [key: string]: any;
}

export const checkAccessPermission = (linkControl: string | undefined, action: string | undefined) => {
    if (typeof sessionStorage !== 'undefined') {

        const token = sessionStorage.getItem('authToken') || '';

        if (token) {
            const decodedToken: DecodedToken = jwt_decode(token) as DecodedToken;

            let permits: any[] = [];
            if (Array.isArray(decodedToken['Permission'])) {
                permits = decodedToken['Permission'].map((e: any) => {
                    return JSON.parse(e);
                });
            } else if (decodedToken['Permission']) {
                // If it's not an array, assume it's a single object
                permits = [JSON.parse(decodedToken['Permission'])];
            }

            const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

            if (role == "Administrator") {
                return true;
            } else {

                // Use Array.prototype.some to check if any permit matches the condition
                return permits?.some((permit: any) => {
                    return linkControl === undefined || (linkControl === permit.dashSrc && permit.funcCode.toLowerCase() === action?.toLocaleLowerCase());
                });
            }
        }
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