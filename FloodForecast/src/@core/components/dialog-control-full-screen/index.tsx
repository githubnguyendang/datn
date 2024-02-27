import React, { useState } from 'react';
import { Dialog, DialogContent, Slide, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

interface DialogControlProps {
  children: (openDialogs: (content: React.ReactNode, title: React.ReactNode) => void, closeDialogs: () => void) => React.ReactNode;
}

const DialogsControlFullScreen = ({ children }: DialogControlProps) => {
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const [dialogTitle, setDialogTitle] = useState<React.ReactNode>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openDialogs = (content: React.ReactNode, title: React.ReactNode) => {
    setDialogContent(content);
    setDialogTitle(title);
    setIsOpen(true);
  };

  const closeDialogs = () => {
    setDialogContent(null);
    setDialogTitle(null);
    setIsOpen(false);
  };

  return (
    <>
      {children(openDialogs, closeDialogs)}
      <Dialog open={isOpen} onClose={closeDialogs} fullScreen TransitionComponent={Transition} sx={{ zIndex: 1201 }}>
        {dialogContent && (
          <>
            <AppBar sx={{ position: 'relative' }}>
              <Toolbar sx={{ maxHeight: 45, minHeight: 45 }}>
                <Typography sx={{ ml: 2, flex: 1, color: `#fff` }} variant="h6" component="div">
                  {dialogTitle}
                </Typography>
                <Button className='btn closeBtn' sx={{ p: 2, mr: -2 }} onClick={closeDialogs}>
                  <CloseIcon />
                </Button>
              </Toolbar>
            </AppBar>
            <DialogContent>
              {dialogContent}
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};

export default DialogsControlFullScreen;
