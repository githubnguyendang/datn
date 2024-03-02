import { Tv } from '@mui/icons-material'
import { Checkbox, Grid, Typography, CircularProgress, FormControlLabel, Box } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'

import DialogsControlFullScreen from 'src/@core/components/dialog-control-full-screen'
import TableComponent from 'src/@core/components/table'
import { getData, saveData } from 'src/api/axios'

const Form = ({ data }: any) => {
  const userData = [data];
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
        const resData = await getData(`Dashboard/listbyuser/${data.userName}`);
        setResData(resData);
      } catch (error) {
        setResData([]);
      } finally {
        setLoading(false)
      }
    };

    getDataDashboard();
  }, [data.userName, postSuccess]);

  const handleCheckPermit = (row: any, userData: any) => async () => {
    const permitAccess = row.permitAccess;

    const item: any = {
      id: row.id ? row.id : 0,
      userId: userData.id,
      userName: userData.userName,
      dashboardId: row.dashboardId,
      fileControl: row.fileControl,
      permitAccess: row.permitAccess == true ? false : true,
    };

    try {
      setSwitchLoadingMap((prevState) => ({ ...prevState, [row.id]: true }));
      if (permitAccess === true) {
        await saveData('UserDashboard/delete', item);
      } else {
        await saveData('UserDashboard/save', item);
      }
    } catch (error) {
      console.error(error)
    } finally {
      setSwitchLoadingMap((prevState) => ({ ...prevState, [row.id]: false }));
    }

    setPostSuccess(true);
    handlePostSuccess();
  };

  const userInfoColumn = [
    { id: 'userName', label: 'Tên', elm: (row: any) => (<Typography py={2}>{row.userName}</Typography>) },
    { id: 'fullName', label: 'Mô tả' },
  ];

  const permitColumn = [
    { id: 'dashboardName', label: 'Màn hình chức năng', },
    { id: 'fileControl', label: 'URL' },
    { id: 'description', label: 'Chú thích' },
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
    }
  ];

  return (
    <>
      <Grid container>
        <Grid item xs={12} pb={10}>
          <TableComponent columns={userInfoColumn} rows={userData} loading={loading} />
        </Grid>
      </Grid>

      <TableComponent columns={permitColumn} rows={resData} loading={loading} pagination />
    </>
  );
}

const AssignPermit = ({ data }: any) => {
  const formTitle = 'Cấp phép người dùng'

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
