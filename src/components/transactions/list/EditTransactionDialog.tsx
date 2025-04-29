
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Transaction } from '@/types';
import TransactionForm from '../TransactionForm';

interface EditTransactionDialogProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onSubmit: (values: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const EditTransactionDialog = ({
  isOpen,
  transaction,
  onSubmit,
  onCancel,
  isSubmitting,
}: EditTransactionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && onCancel()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Make changes to your transaction details below.
          </DialogDescription>
        </DialogHeader>
        {transaction && (
          <TransactionForm
            transaction={transaction}
            onSubmit={onSubmit}
            onCancel={onCancel}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionDialog;
