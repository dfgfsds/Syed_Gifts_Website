import React, { createContext, useContext, useState, ReactNode } from 'react';
// import { PaymentDialog } from '../components/dialogs/PaymentDialog';

interface DialogContextType {
  showPaymentDialog: (status: 'success' | 'failed', error?: string) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | null>(null);
  const [paymentError, setPaymentError] = useState<string>();

  const showPaymentDialog = (status: 'success' | 'failed', error?: string) => {
    setPaymentStatus(status);
    setPaymentError(error);
  };

  const closeDialog = () => {
    setPaymentStatus(null);
    setPaymentError(undefined);
  };

  return (
    <DialogContext.Provider value={{ showPaymentDialog, closeDialog }}>
      {children}
      {paymentStatus && (""
        // <PaymentDialog
        //   status={paymentStatus}
        //   error={paymentError}
        //   onClose={closeDialog}
        // />
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}