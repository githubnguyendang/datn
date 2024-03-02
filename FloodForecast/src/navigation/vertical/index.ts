// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { PeopleAltOutlined, Tv } from '@mui/icons-material';

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'TRANG CHỦ',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'Quản lý trạm quan trắc',
      primaryPath: 'station',
      path: '/station'
    },
    {
      sectionTitle: 'Quản lý',
      primaryPath: 'manage'
    },
    {
      title: 'Hệ thống',
      primaryPath: 'system',
      children: [
        {
          title: 'Nhóm người dùng',
          icon: PeopleAltOutlined,
          primaryPath: 'role',
          path: '/system/role'
        },
        {
          title: 'Người dùng',
          icon: AccountCogOutline,
          primaryPath: 'user',
          path: '/system/user'
        },
        {
          title: 'Trang truy cập',
          icon: Tv,
          primaryPath: 'dashboard',
          path: '/system/dashboard'
        }
      ]
    },
    {
      title: 'Phân quyền',
      primaryPath: 'permission',
      children: [
        {
          title: 'Nhóm người dùng',
          icon: PeopleAltOutlined,
          primaryPath: 'role',
          path: '/permission/role'
        },
        {
          title: 'Người dùng',
          icon: AccountCogOutline,
          primaryPath: 'user',
          path: '/permission/user'
        }
      ]
    },
  ]
}

export default navigation
