import { CircularProgress, Grid, Checkbox, Typography, FormControlLabel, Box } from '@mui/material'
import { useEffect, useState } from 'react'
import DialogsControlFullScreen from 'src/@core/components/dialog-control-full-screen'
import TableComponent from 'src/@core/components/table'
import { getData, saveData } from 'src/api/axios'

type DialogsControlCallback = (content: React.ReactNode, title: React.ReactNode) => void;

const Form = ({ data }: any) => {

  const userData = data;
  const [dashData, setDashData] = useState([]);
  const [postSuccess, setPostSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [switchLoadingMap, setSwitchLoadingMap] = useState<{ [key: string]: { [key: string]: boolean } }>({});
  const handlePostSuccess = () => {
    setPostSuccess(prevState => !prevState);
  };

  const userInfoColumn = [
    { id: 'userName', label: 'Tên', elm: (row: any) => (<Typography py={2}>{row.userName}</Typography>) },
    { id: 'fullName', label: 'Mô tả' },
  ];

  const permitColumn = [
    { id: 'name', label: 'Màn hình chức năng' },
    { id: 'path', label: 'URL' },
    {
      id: 'permitAccess',
      label: 'Được phép truy cập',
      elm: (dash: any) => (
        <div>
          {dash.functions.map((f: any) => {
            const key = `${dash.id}-${f.id}`;
            const isLoading = switchLoadingMap[key];

            return (
              <FormControlLabel key={f.id} control={
                isLoading ? (
                  <Box padding={'9px'}><CircularProgress size={20} /> </Box>
                ) : (
                  <Checkbox
                    name={f.path}
                    checked={f?.status}
                    onChange={handleCheckFunction(f, dash)}
                  />)
              } label={f.permitName} />
            );
          })}
        </div>
      ),
    },
  ];

  useEffect(() => {
    const getDataUser = async () => {
      try {
        setLoading(true)
        const rdash = await getData(`User/getuserinfo/${data.id}`);
        setDashData(rdash.dashboards);
      } catch (error) {
        setDashData([]);
      } finally {
        setLoading(false)
      }
    };
    getDataUser();

  }, [data.id, postSuccess]);

  const handleCheckFunction = (f: any, dash: any) => async () => {

    const key = `${dash.id}-${f.id}`;

    const item: any = {
      id: 0,
      userId: userData.id,
      userName: userData.userName,
      dashboardId: dash.id,
      functionId: f.id,
      functionName: f.permitName,
      functionCode: f.permitCode,
    }

    try {
      setSwitchLoadingMap((prevState: any) => ({ ...prevState, [key]: true, }));
      if (f.status == true) {
        await saveData('Permission/delete', item);
      } else {
        await saveData('Permission/save', item);
      }
    } catch (error) {
      console.error(error)
    } finally {
      setSwitchLoadingMap((prevState: any) => ({ ...prevState, [key]: false, }));
    }

    setPostSuccess(true);
    handlePostSuccess();
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12} pb={10}>
          <TableComponent columns={userInfoColumn} loading={loading} rows={[userData]} />
        </Grid>
      </Grid>
      <TableComponent columns={permitColumn} loading={loading} rows={dashData} pagination />
    </>
  );
}

const AssignFunction = ({ data }: any) => {
  const formTitle = 'Cấp phép người dùng'

  return (
    <DialogsControlFullScreen>
      {(openDialogs: DialogsControlCallback, closeDialogs: () => void) => (
        <Typography
          className='btnShowFilePdf'
          onClick={() => openDialogs(<Form data={data} closeDialogs={closeDialogs} />, formTitle)}
        >
          {data.userName}
        </Typography>
      )}
    </DialogsControlFullScreen>
  )
}

export default AssignFunction
