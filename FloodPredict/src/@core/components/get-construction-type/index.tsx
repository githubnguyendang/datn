const GetConstructionTypeId = (router: any) => {
    const pathSegments = router.pathname.split('/');
    const section = pathSegments[2];
    const subsection = pathSegments[3];

    switch (section) {
        case "nuoc-mat":
            return 1;
        case "nuoc-duoi-dat":
            switch (subsection) {
                case "khai-thac-su-dung":
                    return 7;
                case "tham-do":
                    return 8;
                case "hanh-nghe-khoan":
                    return 9;
                default:
                    return 2;
            }
        case "xa-thai":
            return 3;
        default:
            return 0;
    }
}
export default GetConstructionTypeId;