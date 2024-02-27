// ** React Imports
import { useState, SyntheticEvent, Fragment, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import AccountOutline from 'mdi-material-ui/AccountOutline'

import jwt_decode from 'jwt-decode';
import Link from 'next/link'

interface DecodedToken {
  [key: string]: any;
}

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = () => {

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [userName, setUserName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // ** Hooks
  const router = useRouter()

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const handleLogout = () => {
    sessionStorage.clear();
    router.push('/pages/login')
  }

  useEffect(() => {
    if (typeof sessionStorage !== 'undefined') {

      const token = sessionStorage.getItem('authToken') || '';

      if (token) {
        const decodedToken = jwt_decode(token) as DecodedToken;
        setUserName(decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'])
        setRole(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'].toUpperCase())
      }
    }
  }, [])

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }

  const avatarImg = <AccountOutline sx={{ marginRight: 2, width: 30, height: 30 }} onClick={handleDropdownOpen} />

  return (
    <Fragment>
      <Badge
        overlap='circular'

        // badgeContent={<BadgeContentSpan />}
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {avatarImg} <Typography sx={{ color: '#fff', fontSize: 12, display: 'flex', alignItems: 'center' }}> Xin chào {userName} !</Typography>
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              {avatarImg}
            </Badge>
            <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{userName}</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {role}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Link passHref href={'/user-info'}>
            <Box sx={styles}>
              <AccountOutline sx={{ marginRight: 2 }} />
              Thông tin
            </Box>
          </Link>
        </MenuItem>
        <Divider sx={{ mt: 0, mb: 1 }} />
        <MenuItem sx={{ py: 2, color: "red" }} onClick={() => handleLogout()}>
          <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem' }} />
          Đăng xuất
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
