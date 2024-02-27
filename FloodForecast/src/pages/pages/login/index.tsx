// ** React Imports
import { ChangeEvent, MouseEvent, ReactNode, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Alert from '@mui/material/Alert';
import loginApi from 'src/api/login'
import { Login } from '@mui/icons-material'
import { CircularProgress } from '@mui/material'

interface State {
  username: string
  password: string
  showPassword: boolean
  rememberMe: boolean
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LoginPage = () => {
  // ** State
  const [values, setValues] = useState<State>({
    username: '',
    password: '',
    showPassword: false,
    rememberMe: false
  })

  const [isError, setIsErrors] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // ** Hook
  const router = useRouter()

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setIsLoading(true)

      // Call the loginApi function with the entered username and password
      const success = await loginApi(values.username, values.password);

      if (success) {
        // Redirect the user to the desired page or perform any other necessary actions
        router.push('/');
      } else {
        setIsErrors(true);
      }

    } catch (error) {
      // Handle login errors
      setIsErrors(true);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <Box className="bg">
      <Box className='content-center'>
        <Card sx={{ zIndex: 1 }}>
          <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
            <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
              {/* <img src="/images/logos/logo_sotnmt.png" width={70} height={70} alt="logo-page" /> */}
              <Typography
                variant='h6'
                align='center'
                sx={{
                  color: '#dc3545 !important',
                  mt: 2,
                  mx: 3,
                  lineHeight: 1,
                  fontWeight: 600,
                  width: '100%',
                  textTransform: 'uppercase',
                  fontSize: '1.5rem !important'
                }}
              >
                {themeConfig.templateName}
              </Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant='overline' align='center' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                HỆ THỐNG QUẢN LÝ CƠ SỞ DỮ LIỆU TÀI NGUYÊN NƯỚC
              </Typography>
            </Box>
            {isError ? (<Box sx={{ mb: 3 }}> <Alert severity="error">Tài khoản hoặc mật khẩu không chính xác!</Alert> </Box>) : ""}
            <form noValidate autoComplete='off' onSubmit={handleSubmit}>
              <TextField autoFocus fullWidth
                id='username'
                label={<Typography variant='overline' sx={{ fontSize: 14, fontWeight: 600, lineHeight: 0, transformOrigin: 'center' }}>
                  Tài khoản
                </Typography>}
                sx={{ marginBottom: 4 }}
                value={values.username}
                onChange={handleChange('username')}
                inputProps={{
                  style: {
                    paddingTop: 10,
                    paddingBottom: 10,
                    fontSize: 15
                  }
                }}
              />
              <FormControl fullWidth>
                <InputLabel htmlFor='auth-login-password'>
                  <Typography variant='overline' sx={{ fontSize: 14, fontWeight: 600, lineHeight: 0, transformOrigin: 'center' }}>
                    Mật khẩu
                  </Typography>
                </InputLabel>
                <OutlinedInput
                  label={
                    <Typography variant='overline' sx={{ fontSize: 14, fontWeight: 600, lineHeight: 0, transformOrigin: 'center' }}>
                      Mật khẩu
                    </Typography>
                  }
                  value={values.password}
                  id='auth-login-password'
                  onChange={handleChange('password')}
                  type={values.showPassword ? 'text' : 'password'}
                  inputProps={{
                    style: {
                      paddingTop: 10,
                      paddingBottom: 10,
                      fontSize: 15
                    }
                  }}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle password visibility'
                      >
                        {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <Box
                sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
              >
                <FormControlLabel control={<Checkbox value={values.rememberMe} onChange={handleChange('rememberMe')} />} label='Lưu đăng nhập' />
                <Link passHref href='/'>
                  <LinkStyled onClick={e => e.preventDefault()}>Quên mật khẩu?</LinkStyled>
                </Link>
              </Box>
              <Button
                fullWidth
                size='large'
                variant='contained'
                sx={{ marginBottom: 7 }}
                type="submit"
                disabled={isLoading}
                endIcon={isLoading ? <CircularProgress color='inherit' size={20} /> : <Login />}
              >
                Đăng nhập
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
