import React from 'react';
import { FileCheck, Receipt } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';

interface InvoiceStatusProps {
  projectId: string;
  invoiceSent: boolean;
}

export function InvoiceStatus({ projectId, invoiceSent }: InvoiceStatusProps) {
  const { updateProject } = useFirestore();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleToggleInvoice = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await updateProject(projectId, { invoiceSent: !invoiceSent });
    } catch (error) {
      console.error('Failed to update invoice status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleToggleInvoice}
      disabled={isUpdating}
      className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-medium transition-colors ${
        invoiceSent
          ? 'bg-green-500 bg-opacity-20 text-green-400'
          : 'bg-yellow-500 bg-opacity-20 text-yellow-400'
      } hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {invoiceSent ? (
        <>
          <FileCheck className="w-3 h-3" />
          Invoice Sent
        </>
      ) : (
        <>
          <Receipt className="w-3 h-3" />
          Send Invoice
        </>
      )}
    </button>
  );
}