// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'

// ** Icons Imports
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import RolePermit from 'src/views/manage/role-permit'

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const RoleSettings = () => {
  // ** State
  const [value, setValue] = useState<string>('roles')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Card>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label='roles-settings tabs'
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Tab
            value='roles'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LockOpenOutline />
                <TabName>Nhóm người dùng(Roles)</TabName>
              </Box>
            }
          />
        </TabList>
        <TabPanel sx={{ p: 0 }} value='roles'>
          <RolePermit />
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default RoleSettings
