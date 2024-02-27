// ** MUI Imports
import { Theme } from '@mui/material/styles'

const GlobalStyles = (theme: Theme) => {
  return {
    '.ps__rail-y': {
      zIndex: 1,
      right: '0 !important',
      left: 'auto !important',
      '&:hover, &:focus, &.ps--clicking': {
        backgroundColor: theme.palette.mode === 'light' ? '#E4E5EB !important' : '#423D5D !important'
      },
      '& .ps__thumb-y': {
        right: '3px !important',
        left: 'auto !important',
        backgroundColor: theme.palette.mode === 'light' ? '#C2C4D1 !important' : '#504B6D !important'
      },
      '.layout-vertical-nav &': {
        '& .ps__thumb-y': {
          width: 4,
          backgroundColor: theme.palette.mode === 'light' ? '#C2C4D1 !important' : '#504B6D !important'
        },
        '&:hover, &:focus, &.ps--clicking': {
          backgroundColor: 'transparent !important',
          '& .ps__thumb-y': {
            width: 6
          }
        }
      }
    },

    '&.MuiDataGrid-columnHeader': {
      whiteSpace: 'break-spaces !important',
      backgroundColor: 'rgb(21 83 143) !important',
      color: '#fff !important'
    },

    '&.MuiDataGrid-cell': {
      color: '#2f2f2f',
    },

    '#nprogress': {
      pointerEvents: 'none',
      '& .bar': {
        left: 0,
        top: 0,
        height: 3,
        width: '100%',
        zIndex: 2000,
        position: 'fixed',
        backgroundColor: theme.palette.primary.main
      }
    },

    '&.sub__nav &.menu__item::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: 2,
      height: '100%',
      backgroundColor: `#fff`,
    },
    '&.sub__nav &.active::before': {
      content: '""',
      position: 'absolute',
      left: -1,
      top: 0,
      width: 4,
      borderRadius: 4,
      height: '100%',
      backgroundColor: `${theme.palette.customColors.primaryGradient}`,
      zIndex: 1,
    }
  }
}

export default GlobalStyles
