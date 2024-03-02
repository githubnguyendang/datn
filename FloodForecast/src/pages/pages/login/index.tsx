// ** React Imports
import { ChangeEvent, MouseEvent, ReactNode, useState } from 'react'

// ** Next Imports
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
import { AppRegistration, Login } from '@mui/icons-material'
import { CircularProgress, Divider } from '@mui/material'
import { saveData } from 'src/api/axios'

interface State {
  username: string
  password: string
  showPassword: boolean
  rememberMe: boolean
}

interface RegUser {
  username: string
  password: string
  confirmPassword: string
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
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

  const [regUser, setRegUser] = useState<RegUser>({
    username: '',
    password: '',
    confirmPassword: '',
  })

  const [isError, setIsErrors] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [isLoginPage, setIsLoginPage] = useState(true)

  // ** Hook
  const router = useRouter()

  const handleChange = (prop: keyof State | keyof RegUser) => (event: ChangeEvent<HTMLInputElement>) => {
    if (isLoginPage) {
      setValues({ ...values, [prop]: event.target.value });
    } else {
      setRegUser({ ...regUser, [prop]: event.target.value });
    }
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

  const handleRegister = async (e: any) => {
    e.preventDefault();

    try {
      setIsLoading(true)

      // Call the loginApi function with the entered username and password
      const success = await saveData('Auth/register', regUser);

      if (success) {
        // Redirect the user to the desired page or perform any other necessary actions
        router.push('/pages/login');
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
          <CardContent sx={{ padding: theme => `${theme.spacing(3, 7, 9)} !important`, textAlign: 'center' }}>
            <Typography gutterBottom variant="overline" component="div" sx={{ fontSize: 20, m: 0, fontWeight: 600, lineHeight: 2 }}>
              {isLoginPage ? "Đăng Nhập" : "Đăng Ký"}
            </Typography>
            <Divider variant='middle' />
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
                HỆ THỐNG GIÁM SÁT VÀ CẢNH BÁO LŨ LỤT
              </Typography>
            </Box>
            {
              isLoginPage ?
                (
                  <form noValidate autoComplete='off' onSubmit={handleSubmit}>
                    {isError ? (<Box sx={{ mb: 3 }}> <Alert severity="error">Tài khoản hoặc mật khẩu không chính xác!</Alert> </Box>) : ""}
                    <TextField autoFocus fullWidth
                      id='username'
                      label={<Typography variant='overline' sx={{ fontSize: 14, fontWeight: 600, lineHeight: 0, transformOrigin: 'center' }}>
                        Tài khoản
                      </Typography>}
                      sx={{ marginBottom: 4 }}
                      value={values.username}
                      onChange={handleChange('username')}
                      inputProps={{
                        sx: {
                          p: '10px',
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
                          sx: {
                            p: '10px',
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
                    </Box>
                    <Divider variant='middle' />
                    <Box display={'flex'}>
                      <Button
                        fullWidth
                        size='large'
                        variant='contained'
                        type="submit"
                        disabled={isLoading}
                        endIcon={isLoading ? <CircularProgress color='inherit' size={20} /> : <Login />}
                      >
                        Đăng nhập
                      </Button>
                      <Button
                        sx={{ width: "50%" }}
                        size='small'
                        type="button"
                        onClick={() => {
                          setIsLoginPage(false); setRegUser({
                            username: '',
                            password: '',
                            confirmPassword: '',
                          })
                        }}
                        endIcon={<AppRegistration />}
                      >
                        Đăng Ký
                      </Button>
                    </Box>
                  </form>
                )
                :
                (
                  <form noValidate autoComplete='off' onSubmit={handleRegister} >
                    <TextField autoFocus fullWidth
                      id='username'
                      label={<Typography variant='overline' sx={{ fontSize: 14, fontWeight: 600, lineHeight: 0, transformOrigin: 'center' }}>
                        Tài khoản
                      </Typography>}
                      sx={{ marginBottom: 10 }}
                      value={regUser.username}
                      onChange={handleChange('username')}
                      inputProps={{
                        sx: {
                          p: '10px',
                          fontSize: 15
                        }
                      }}
                    />
                    <FormControl fullWidth required={regUser.password !== regUser.confirmPassword}>
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
                        sx={{ marginBottom: 10 }}
                        value={regUser.password}
                        id='auth-login-password'
                        onChange={handleChange('password')}
                        type={values.showPassword ? 'text' : 'password'}
                        inputProps={{
                          sx: {
                            p: '10px',
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
                    {regUser.password !== regUser.confirmPassword ? (<Box sx={{ mb: 3 }}> <Alert sx={{ py: 0.5 }} severity="error">Mật khẩu xác nhận không chính xác!</Alert></Box>) : ""}
                    <FormControl fullWidth>
                      <InputLabel htmlFor='auth-login-password'>
                        <Typography variant='overline' sx={{ fontSize: 14, fontWeight: 600, lineHeight: 0, transformOrigin: 'center' }}>
                          Xác nhận mật khẩu
                        </Typography>
                      </InputLabel>
                      <OutlinedInput
                        sx={{ marginBottom: 10 }}
                        error={regUser.password !== regUser.confirmPassword}
                        label={
                          <Typography variant='overline' sx={{ fontSize: 14, fontWeight: 600, lineHeight: 0, transformOrigin: 'center' }}>
                            Xác nhận mật khẩu
                          </Typography>
                        }
                        value={regUser.confirmPassword}
                        id='auth-login-confirmPassword'
                        onChange={handleChange('confirmPassword')}
                        type={values.showPassword ? 'text' : 'password'}
                        inputProps={{
                          sx: {
                            p: '10px',
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
                    <Divider variant='middle' />
                    <Box display={'flex'}>
                      <Button
                        fullWidth
                        size='large'
                        variant='contained'
                        type="submit"
                        disabled={regUser.password !== regUser.confirmPassword}
                        endIcon={isLoading ? <CircularProgress color='inherit' size={20} /> : <AppRegistration />}
                      >
                        Đăng Ký
                      </Button>
                      <Button
                        sx={{ width: "50%" }}
                        size='small'
                        type="button"
                        onClick={() => {
                          setIsLoginPage(true)
                        }}
                        endIcon={<Login />}
                      >
                        Đăng nhập
                      </Button>
                    </Box>
                  </form>
                )
            }
          </CardContent>
        </Card>
      </Box>
    </Box >
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
