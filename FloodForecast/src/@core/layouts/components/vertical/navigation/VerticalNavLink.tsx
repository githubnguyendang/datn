// ** React Imports
import { ElementType, ReactNode, useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Chip from '@mui/material/Chip'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import ListItemIcon from '@mui/material/ListItemIcon'
import ExpandIcon from 'mdi-material-ui/ChevronRight'
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton'
import { List } from '@mui/material'

// ** Configs Import
import themeConfig from 'src/configs/themeConfig'

// ** Types
import { NavLink, NavSectionTitle } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'

// ** Custom Components Imports
import UserIcon from 'src/layouts/components/UserIcon'

// ** Utils
import { handleURLQueries } from 'src/@core/layouts/utils'
import { checkAccessPermission } from '../../../checkAccessPermission'

interface Props {
  item: NavLink
  settings: Settings
  navVisible?: boolean
  toggleNavVisibility: () => void
}

// ** Styled Components
const MenuNavLink = styled(ListItemButton)<ListItemButtonProps & { component?: ElementType; target?: '_blank' | undefined }>(({ theme }) => ({
  width: '100%',
  borderTopRightRadius: 100,
  borderBottomRightRadius: 100,
  padding: theme.spacing(2.25, 3.5),
  color: `#fff`,
  fontSize: 14,
  transition: 'opacity .25s ease-in-out',
  '&.active, &.active:hover': {
    boxShadow: theme.shadows[3],
    backgroundImage: `linear-gradient(270deg, ${theme.palette.customColors.primaryGradient}, ${theme.palette.primary.dark} 94%)`,
    borderRadius: '0 100px 100px 0',
  },
  '&.menu__item: hover': {
    boxShadow: theme.shadows[3],
    backgroundImage: `linear-gradient(270deg, ${theme.palette.customColors.primaryGradient}, ${theme.palette.primary.dark} 94%)`,
  },
  '&.active .MuiTypography-root, &.active .MuiSvgIcon-root': {
    color: `${theme.palette.common.white} !important`
  },
  '&.collapse-nav-btn:hover': {
    backgroundColor: '#0b629959'
  },
  '&.collapse-nav-opened': {
    backgroundColor: '#0b629959'
  }
}))

const MenuNavSection = styled(ListItemButton)<ListItemButtonProps & { component?: ElementType; target?: '_blank' | undefined }>(({ theme }) => ({
  width: '100%',
  color: `#fff !important`,
  fontSize: 14,
  textTransform: 'uppercase',
  cursor: "default",
  fontWeight: 'bold',
  padding: theme.spacing(2.25, 3.5),
  '&.nav-section::after': {
    content: '""',
    position: 'absolute',
    top: 'calc(50% - 5px)',
    left: -4,
    transform: 'translate(-50 %, -50 %)',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: `#fff`,
  },
  '&.nav-section::before': {
    content: '""',
    position: 'absolute',
    top: 'calc(50%)',
    left: 0,
    width: 2,
    height: '50%',
    backgroundColor: `#fff`,
  },
}))

const MenuItemTextMetaWrapper = styled(Box)<BoxProps>({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
})

const VerticalNavLink = ({ item, settings, navVisible, toggleNavVisibility }: Props) => {

  // ** Hooks
  const router = useRouter()

  const IconTag: ReactNode = item.icon

  const [open, setOpen] = useState(false)
  const [havePermit, setHavePermit] = useState<boolean | undefined>(false)

  // Define a type guard for NavLink
  const isNavLink = (item: NavLink | NavSectionTitle): item is NavLink => {
    return 'children' in item && Array.isArray((item as NavLink).children);
  };

  const handleClick = () => {

    if (item.children && item.children.length > 0) {
      setOpen(!open);
    } else {
      const isNavLinkItem = isNavLink(item) ? item : null;

      // If it's a leaf node (no children), close the collapse if the item is already active
      setOpen(
        !(
          isNavLinkActive(item.path) ||
          (isNavLinkItem && isNavLinkActive(isNavLinkItem.path))
        )
      );
    }
  };


  const isNavLinkActive = (itemPath: string | undefined) => {
    if (router.pathname === itemPath || handleURLQueries(router, itemPath)) {
      return true
    } else {
      return false
    }
  }

  async function getPermit() {
    setHavePermit(await checkAccessPermission(item.primaryPath, 'view'));
  }

  useEffect(() => {
    getPermit()

    // Check if any child is active
    const isAnyChildActive = item.children && Array.isArray(item.children) && item.children.some((child): child is NavLink => {
      return 'path' in child && isNavLinkActive(child.path);
    });

    // Set the initial state of 'open' based on whether any child is active
    setOpen((prevOpen) => (isAnyChildActive !== undefined ? isAnyChildActive : prevOpen));

    // If there are more levels, recursively check for active children
    const checkActiveInChildren = (children: (NavLink | NavSectionTitle)[] | undefined): boolean => {
      if (!children) {
        return false;
      }

      return children.some(child => {
        if (isNavLink(child) && child.children && child.children.length > 0) {
          return checkActiveInChildren(child.children as NavLink[]);
        } else {
          return isNavLink(child) && 'path' in child && isNavLinkActive(child.path);
        }
      });
    };
    setOpen(prevOpen => checkActiveInChildren(item.children) || prevOpen);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.primaryPath, item.children]);

  if (item.children && item.children.length > 0) {

    // Level 1 Menu Item with children
    return (
      <ListItem disablePadding className='nav-link' disabled={item.disabled || false} sx={{ px: '0 !important', display: `${!item.primaryPath || havePermit ? 'block' : 'none'}` }}>
        <Link passHref href={item.path === undefined ? '#' : havePermit ? `${item.path}` : '#'}>
          <MenuNavLink
            component={'a'}
            onMouseDown={handleClick}
            className={`${open ? 'collapse-nav-opened' : ''} collapse-nav-btn`}
            {...(item.openInNewTab ? { target: '_blank' } : null)}
            onClick={(e) => {
              if (item.path === undefined) {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
            sx={{
              ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' })
            }}
          >
            {item.icon ? <ListItemIcon
              sx={{
                mr: 2.5,
                transition: 'margin .25s ease-in-out',
                color: `#fff`
              }}
            >
              <UserIcon icon={IconTag} />
            </ListItemIcon> : ''}
            <MenuItemTextMetaWrapper>
              {item.title}
              {item.badgeContent ? (
                <Chip
                  label={item.badgeContent}
                  color={item.badgeColor || 'primary'}
                  sx={{
                    height: 20,
                    fontWeight: 500,
                    marginLeft: 1.25,
                    '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                  }}
                />
              ) : null}
            </MenuItemTextMetaWrapper>
            {open || (isNavLink(item) && item.children && item.children.some(
              (child): child is NavLink => isNavLink(child) && isNavLinkActive(child.path)
            )) ? (
              <ExpandIcon className='is-opened-children' sx={{ color: `#fff` }} />
            ) : (
              <ExpandIcon className='is-not-opened-children' sx={{ color: `#fff` }} />
            )}
          </MenuNavLink>
        </Link>
        <Collapse in={open} timeout='auto' unmountOnExit>
          <List className='sub__nav' sx={{ pl: 5, py: 2 }}>
            {item.children.map((child: NavLink | NavSectionTitle, index: number) => {
              // Check if the current child is a NavLink
              if ('title' in child) {
                // Level 2 Menu Items
                return (
                  <VerticalNavLink
                    key={index}
                    item={child as NavLink} // Cast child to NavLink
                    settings={settings}
                    navVisible={navVisible}
                    toggleNavVisibility={toggleNavVisibility}
                  />
                );
              } else {
                // Handle NavSectionTitle separately if needed
                return (
                  <MenuNavSection key={index} className='nav-section'>
                    {child.sectionTitle}
                  </MenuNavSection>
                );
              }
            })}
          </List>
        </Collapse>

      </ListItem>
    )
  } else {

    // Level 1 Menu Item without children
    return (
      <ListItem disablePadding className='nav-link' disabled={item.disabled || false} sx={{ px: '0 !important', display: `${item.path == '/' || havePermit ? 'block' : 'none'}` }}>
        <Link passHref href={item.path === undefined ? '#' : item.path == '/' || havePermit ? `${item.path}` : '#'}>
          <MenuNavLink
            component={'a'}
            className={`${isNavLinkActive(item.path) ? 'active' : ''} menu__item`}
            {...(item.openInNewTab ? { target: '_blank' } : null)}
            onClick={(e) => {
              if (item.path === undefined) {
                e.preventDefault()
                e.stopPropagation()
              }
              if (navVisible) {
                toggleNavVisibility()
              }
            }}
            sx={{
              ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' })
            }}
          >
            {item.icon ? <ListItemIcon
              sx={{
                mr: 2.5,
                transition: 'margin .25s ease-in-out',
                color: `#fff`
              }}
            >
              <UserIcon icon={IconTag} />
            </ListItemIcon> : ''}

            <MenuItemTextMetaWrapper>
              {item.title}
              {item.badgeContent ? (
                <Chip
                  label={item.badgeContent}
                  color={item.badgeColor || 'primary'}
                  sx={{
                    height: 20,
                    fontWeight: 500,
                    marginLeft: 1.25,
                    '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                  }}
                />
              ) : null}
            </MenuItemTextMetaWrapper>
          </MenuNavLink>
        </Link>
      </ListItem>
    )
  }
}

export default VerticalNavLink
