import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

interface DialogControlProps {
  children: (openDialogs: (content: React.ReactNode, title: React.ReactNode) => void, closeDialogs: () => void) => React.ReactNode;
}

const DialogsControl = ({ children }: DialogControlProps) => {
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
      <Dialog open={isOpen} onClose={closeDialogs}>
        {dialogContent && (
          <>
            <DialogTitle sx={{ textAlign: 'center', textTransform: 'uppercase' }}>{dialogTitle}</DialogTitle>
            <DialogContent>
              {dialogContent}
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};

export default DialogsControl;
