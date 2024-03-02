// ** MUI Imports
import Divider from '@mui/material/Divider'
import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'
import MuiListSubheader, { ListSubheaderProps } from '@mui/material/ListSubheader'

// ** Types
import { NavSectionTitle } from 'src/@core/layouts/types'
import { useState } from 'react'
import { checkAccessPermission } from 'src/@core/layouts/checkAccessPermission'

interface Props {
  item: NavSectionTitle
}

// ** Styled Components
const ListSubheader = styled((props: ListSubheaderProps) => <MuiListSubheader component='li' {...props} />)(
  ({ theme }) => ({
    lineHeight: 1,
    display: 'flex',
    position: 'relative',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(0),
    backgroundColor: 'transparent',
    transition: 'padding-left .25s ease-in-out'
  })
)

const TypographyHeaderText = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: '0.75rem',
  lineHeight: 'normal',
  letterSpacing: '0.21px',
  textTransform: 'uppercase',
  color: theme.palette.text.disabled,
  fontWeight: theme.typography.fontWeightMedium
}))

const VerticalNavSectionTitle = (props: Props) => {
  // ** Props
  const { item } = props

  // ** Hook
  const theme = useTheme()

  const [havePermit, setHavePermit] = useState<boolean | undefined>(false)
  async function getPermit() {
    setHavePermit(await checkAccessPermission(item.primaryPath, 'view'));
  }

  getPermit();

  return (
    <ListSubheader
      className='nav-section-title'
      sx={{
        display: havePermit ? 'block' : 'none',
        px: 0,
        py: 1.75,
        mb: '10px',
        color: theme.palette.text.disabled,
        '& .MuiDivider-root:before, & .MuiDivider-root:after, & hr': {
          borderColor: `rgba(${theme.palette.customColors.main}, 0.12)`
        },
        borderBottom: '2px double rgb(189 189 189 / 68%)'
      }}
    >
      <Divider
        textAlign='left'
        sx={{
          m: 0,
          width: '100%',
          lineHeight: 'normal',
          textTransform: 'uppercase',
          '&:before, &:after': { top: 7, transform: 'none' },
          '& .MuiDivider-wrapper': { px: 2.5, fontSize: '0.75rem', letterSpacing: '0.21px' }
        }}
      >
        <TypographyHeaderText sx={{ color: `#fff`, fontWeight: 'bold', letterSpacing: 3, fontSize: '.9rem' }} noWrap>{item.sectionTitle}</TypographyHeaderText>
      </Divider>
    </ListSubheader>
  )
}

export default VerticalNavSectionTitle
