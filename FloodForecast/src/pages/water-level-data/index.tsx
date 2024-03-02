import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { checkAccessPermission } from 'src/@core/layouts/checkAccessPermission';
import Error401 from "src/pages/401";
import WaterLevelData from "src/views/water-level-data"

const WaterLevelDataPages = () => {
    const router = useRouter();
    const routePath = router.pathname; // Use router.pathname to get the current pathname

    // Split the pathname and get the part you need (in this case, the first segment)
    const routeSegment = routePath.split('/')[1];

    const [access, setAccess] = useState(false);

    async function getAccess() {
        setAccess(await checkAccessPermission(routeSegment, 'view'));
    }

    useEffect(() => {
        getAccess()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Use routeSegment in your conditional rendering
    return access ? <WaterLevelData /> : <Error401 />;
}

export default WaterLevelDataPages;