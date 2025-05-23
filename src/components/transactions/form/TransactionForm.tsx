import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Transaction, Category } from '@/types';
import { getCategories } from '@/services/categories';
import DateField from './DateField';
import CategoryField from './CategoryField';
import TypeField from './TypeField';
import { formSchema, FormValues } from './schema';

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const TransactionForm = ({
  transaction,
  onSubmit,
  onCancel,
  isSubmitting,
}: TransactionFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>(
    transaction?.type || 'expense'
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: transaction?.description || '',
      amount: transaction?.amount || 0,
      date: transaction?.date ? new Date(transaction.date) : new Date(),
      type: transaction?.type || 'expense',
      categoryId: transaction?.categoryId?.toString() || '',
      note: transaction?.note || '',
    },
  });

  // Load categories based on selected transaction type
  useEffect(() => {
    const loadCategories = async () => {
      const allCategories = await getCategories();
      setCategories(allCategories.filter((c) => c.type === selectedType));
    };
    
    loadCategories();
  }, [selectedType]);

  // Update form when type changes
  const handleTypeChange = (value: 'income' | 'expense') => {
    setSelectedType(value);
    form.setValue('type', value);
    form.setValue('categoryId', ''); // Reset category when type changes
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Transaction description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TypeField form={form} onTypeChange={handleTypeChange} />
          <DateField form={form} />
        </div>
        
        <CategoryField form={form} categories={categories} />
        
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add additional details..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving...'
              : transaction
              ? 'Update Transaction'
              : 'Add Transaction'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransactionForm;
