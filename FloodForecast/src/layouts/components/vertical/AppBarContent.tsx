// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

import { useEffect, useState } from 'react';

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
  // ** Props
  props;
  const [pageTitle, setPageTitle] = useState("");
  useEffect(() => {
    setPageTitle(document.title);
  }, []);

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        <Typography sx={{color: `#fff`, textTransform: 'uppercase'}} variant='subtitle1'> {pageTitle} </Typography>
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        <UserDropdown />
      </Box>
    </Box>
  )
}

export default AppBarContent
