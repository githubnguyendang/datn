// ** MUI Imports
import { Theme } from '@mui/material/styles'

const input = (theme: Theme) => {
  return {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.text.primary,
          fontSize: '12px',
          borderRadius: 3,
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: {
          '&:before': {
            borderBottom: `1px solid rgba(${theme.palette.customColors.main}, 0.22)`
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: `1px solid rgba(${theme.palette.customColors.main}, 0.32)`
          },
          '&.Mui-disabled:before': {
            borderBottom: `1px solid ${theme.palette.text.disabled}`
          },
          fontSize: '12px',
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&:before': {
            borderBottom: `1px solid rgba(${theme.palette.customColors.main}, 0.22)`
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: `1px solid rgba(${theme.palette.customColors.main}, 0.32)`
          },
          '&.Mui-disabled:before': {
            borderBottom: `1px solid ${theme.palette.text.disabled}`
          },
          fontSize: '11px',
        }
      }
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: `rgba(${theme.palette.customColors.main}, 0.04)`,
          '&:hover:not(.Mui-disabled)': {
            backgroundColor: `rgba(${theme.palette.customColors.main}, 0.08)`
          },
          '&:before': {
            borderBottom: `1px solid rgba(${theme.palette.customColors.main}, 0.22)`
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: `1px solid rgba(${theme.palette.customColors.main}, 0.32)`
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
            borderColor: `rgba(${theme.palette.customColors.main}, 0.32)`
          },
          '&:hover.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.error.main
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: `${theme.palette.primary.light}66`,
            borderRadius: 3,
          },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.disabled
          }
        }
      }
    }
  }
}

export default input
