import React, { useState } from 'react';
import { Dialog, DialogContent, Slide, AppBar, Toolbar, Typography } from '@mui/material';
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

const DialogControlShowPDF = ({ children }: DialogControlProps) => {
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
      <Dialog open={isOpen} onClose={closeDialogs} fullScreen TransitionComponent={Transition} className='DialogControlShowPDF' sx={{ zIndex: 1201 }}>
        {dialogContent && (
          <>
            <AppBar sx={{ position: 'relative' }}>
              <Toolbar>
                <Typography sx={{ ml: 2, flex: 1, color: `#fff` }} variant="h6" component="div">
                  {dialogTitle}
                </Typography>
                <CloseIcon className='btn' onClick={closeDialogs} />
              </Toolbar>
            </AppBar>
            <DialogContent sx={{ p: 0 }}>
              {dialogContent}
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};

export default DialogControlShowPDF;
