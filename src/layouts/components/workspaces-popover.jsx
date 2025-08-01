'use client';

import { usePopover } from 'minimal-shared/hooks';
import { useState, useEffect, useContext, useCallback, createContext } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

// Workspace Context
const WorkspaceContext = createContext();

const WORKSPACE_STORAGE_KEY = 'selectedWorkspaceId';

export function WorkspaceProvider({ children, initialWorkspace }) {
  // Try to load from localStorage, fallback to initialWorkspace
  const [workspace, setWorkspace] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedId = localStorage.getItem(WORKSPACE_STORAGE_KEY);
        if (storedId && initialWorkspace && Array.isArray(initialWorkspace.options)) {
          // If initialWorkspace is an object with options array (not in this code, but for future-proof)
          const found = initialWorkspace.options.find((w) => w.id === storedId);
          if (found) return found;
        }
        if (storedId && Array.isArray(initialWorkspace)) {
          // If initialWorkspace is an array (not in this code, but for future-proof)
          const found = initialWorkspace.find((w) => w.id === storedId);
          if (found) return found;
        }
        if (storedId && initialWorkspace && initialWorkspace.id === storedId) {
          return initialWorkspace;
        }
      } catch (e) {
        // ignore
      }
    }
    return initialWorkspace;
  });

  // Save to localStorage on change
  useEffect(() => {
    if (workspace && workspace.id && typeof window !== 'undefined') {
      try {
        localStorage.setItem(WORKSPACE_STORAGE_KEY, workspace.id);
      } catch (e) {
        // ignore
      }
    }
  }, [workspace]);

  const changeWorkspace = useCallback((newWorkspace) => {
    setWorkspace(newWorkspace);
    // localStorage will be updated by useEffect
  }, []);

  return (
    <WorkspaceContext.Provider value={{ workspace, changeWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}

// ----------------------------------------------------------------------

export function WorkspacesPopover({ data = [], sx, ...other }) {
  const mediaQuery = 'sm';

  const { open, anchorEl, onClose, onOpen } = usePopover();

  const { workspace, changeWorkspace } = useWorkspace();

  // If workspace is not in data (e.g. after reload and data changes), fallback to first
  useEffect(() => {
    if (data.length > 0 && (!workspace || !data.some((w) => w.id === workspace.id))) {
      changeWorkspace(data[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleChangeWorkspace = useCallback(
    (newValue) => {
      changeWorkspace(newValue);
      onClose();
    },
    [changeWorkspace, onClose]
  );

  const buttonBg = {
    height: 1,
    zIndex: -1,
    opacity: 0,
    content: "''",
    borderRadius: 1,
    position: 'absolute',
    visibility: 'hidden',
    bgcolor: 'action.hover',
    width: 'calc(100% + 8px)',
    transition: (theme) =>
      theme.transitions.create(['opacity', 'visibility'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter,
      }),
    ...(open && {
      opacity: 1,
      visibility: 'visible',
    }),
  };

  const renderButton = () => (
    <ButtonBase
      disableRipple
      onClick={onOpen}
      sx={[
        {
          py: 0.5,
          gap: { xs: 0.5, [mediaQuery]: 1 },
          '&::before': buttonBg,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        component="img"
        alt={workspace?.name}
        src={workspace?.logo}
        sx={{ width: 24, height: 24, borderRadius: '50%' }}
      />

      <Box
        component="span"
        sx={{ typography: 'subtitle2', display: { xs: 'none', [mediaQuery]: 'inline-flex' } }}
      >
        {workspace?.name}
      </Box>

      <Iconify width={16} icon="carbon:chevron-sort" sx={{ color: 'text.disabled' }} />
    </ButtonBase>
  );

  const renderMenuList = () => (
    <CustomPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{
        arrow: { placement: 'top-left' },
        paper: { sx: { mt: 0.5, ml: -1.55, width: 240 } },
      }}
    >
      <Scrollbar sx={{ maxHeight: 240 }}>
        <MenuList>
          {data.map((option) => (
            <MenuItem
              key={option.id}
              selected={option.id === workspace?.id}
              onClick={() => handleChangeWorkspace(option)}
              sx={{ height: 48 }}
            >
              <Avatar alt={option.name} src={option.logo} sx={{ width: 24, height: 24 }} />

              <Typography
                noWrap
                component="span"
                variant="body2"
                sx={{ flexGrow: 1, fontWeight: 'fontWeightMedium' }}
              >
                {option.name}
              </Typography>
            </MenuItem>
          ))}
        </MenuList>
      </Scrollbar>
    </CustomPopover>
  );

  return (
    <>
      {renderButton()}
      {renderMenuList()}
    </>
  );
}
