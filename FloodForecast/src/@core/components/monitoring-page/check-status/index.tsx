import React from "react";

const DisplayOperatingStatus = ({ data }: any) => {
    let licenseStatusComponent;
    if (data.IsError || data.thongso?.hThuongLuu < data.hThuongLuuTT || data.thongso?.qmaxNM < data.qMaxTT || data.thongso?.qXaTran < data.qXaTranTT || data.thongso?.qtt < data.qMinTT) {
        licenseStatusComponent = <div className="license_status hsd-warning">Vận hành chưa đúng</div>;
      } else if (data.IsDisconnect)
          {
          licenseStatusComponent = <div className="license_status hsd-danger">Không có số liệu</div>;
        } 
    else {
      licenseStatusComponent = <div className="license_status hsd-success">Đang vận hành</div>;
    }
    
    return <>{licenseStatusComponent}</>;
};

export default DisplayOperatingStatus;