import { Tv } from '@mui/icons-material'
import { Checkbox, Grid, Typography, CircularProgress, FormControlLabel, Box } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'

import DialogsControlFullScreen from 'src/@core/components/dialog-control-full-screen'
import TableComponent from 'src/@core/components/table'
import { getData, saveData } from 'src/api/axios'

const Form = ({ data }: any) => {

  const roleData = [data]; // Use the updated `values` state here
  const [resData, setResData] = useState([]);
  const [postSuccess, setPostSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [switchLoadingMap, setSwitchLoadingMap] = useState<{ [key: string]: boolean }>({});
  const handlePostSuccess = () => {
    setPostSuccess(prevState => !prevState);
  };

  useEffect(() => {
    const getDataDashboard = async () => {
      try {
        setLoading(true)
        const resData = await getData(`Dashboard/listbyrole/${data.name}`);
        setResData(resData);
      } catch (error) {
        setResData([]);
      } finally {
        setLoading(false)
      }

    };

    getDataDashboard();
  }, [data.name, postSuccess]);

  const handleCheckPermit = (row: any, roleData: any) => async () => {
    const permitAccess = row.permitAccess;

    const item: any = {
      id: row.id ? row.id : 0,
      roleId: roleData.id,
      roleName: roleData.name,
      dashboardId: row.dashboardId,
      fileControl: row.fileControl,
      permitAccess: row.permitAccess == true ? false : true,
    };

    try {
      setSwitchLoadingMap((prevState) => ({ ...prevState, [row.id]: true }));
      if (permitAccess === true) {
        await saveData('RoleDashboard/delete', item);
      } else {
        await saveData('RoleDashboard/save', item);
      }
    } catch (error) {
      console.error(error)
    } finally {
      setSwitchLoadingMap((prevState) => ({ ...prevState, [row.id]: false }));
    }

    setPostSuccess(true);
    handlePostSuccess();
  };


  const roleInfoColumn = [
    { id: 'name', label: 'Tên', elm: (row: any) => (<Typography py={2}>{row.name}</Typography>) },
    { id: 'description', label: 'Mô tả' },
  ];

  const permitColumn = [
    { id: 'dashboardName', label: 'Màn hình chức năng', },
    { id: 'fileControl', label: 'URL' },
    {
      id: 'permitAccess',
      label: 'Được phép truy cập',
      elm: (row: any) => {
        const isSwitchLoading = switchLoadingMap[row.id];
        const isCheckboxChecked = !!row?.permitAccess;
        const checkAccessPermissionLoading = isSwitchLoading && isCheckboxChecked;

        return (
          <FormControlLabel
            key={row.id}
            control={
              checkAccessPermissionLoading ? (
                <Box padding={'9px'}>
                  <CircularProgress size={20} />
                </Box>
              ) : (
                <Checkbox
                  name={row.path}
                  checked={isCheckboxChecked}
                  onChange={handleCheckPermit(row, data)}
                />
              )
            }
            label={''}
          />
        );
      },
    },
  ];

  return (
    <>
      <Grid container>
        <Grid item xs={12} pb={10}>
          <TableComponent columns={roleInfoColumn} loading={loading} rows={roleData} />
        </Grid>
      </Grid>

      <TableComponent columns={permitColumn} loading={loading} rows={resData} pagination />
    </>
  );
}

const AssignPermit = ({ data }: any) => {
  const formTitle = 'Cấp phép nhóm người dùng'

  return (
    <DialogsControlFullScreen>
      {(openDialogs: (content: React.ReactNode, title: React.ReactNode) => void, closeDialogs: () => void) => (
        <Tv
          className='tableActionBtn'
          onClick={() => openDialogs(<Form data={data} closeDialogs={closeDialogs} />, formTitle)}
        />
      )}
    </DialogsControlFullScreen>
  )
}

export default AssignPermit
