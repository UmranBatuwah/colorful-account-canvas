import { Invoice, InvoiceItem, InvoiceStatus } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Status options with colors
export const invoiceStatusOptions: InvoiceStatus[] = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-200 text-gray-800' },
  { value: 'sent', label: 'Sent', color: 'bg-blue-100 text-blue-800' },
  { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
  { value: 'overdue', label: 'Overdue', color: 'bg-red-100 text-red-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
];

// Generate a random invoice number
const generateInvoiceNumber = (): string => {
  const prefix = 'INV';
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}${random}`;
};

// Map Supabase invoice to application invoice
const mapSupabaseInvoice = (invoice: any): Invoice => ({
  id: invoice.id,
  invoiceNumber: invoice.invoice_number,
  customerName: invoice.customer_name,
  customerEmail: invoice.customer_email,
  issueDate: new Date(invoice.issue_date),
  dueDate: new Date(invoice.due_date),
  items: invoice.items as InvoiceItem[],
  subtotal: invoice.subtotal,
  taxRate: invoice.tax_rate,
  taxAmount: invoice.tax_amount,
  total: invoice.total,
  notes: invoice.notes,
  status: invoice.status,
  createdAt: new Date(invoice.created_at),
  updatedAt: new Date(invoice.updated_at)
});

// Map application invoice to Supabase invoice
const mapToSupabaseInvoice = (invoice: Partial<Invoice>): any => ({
  invoice_number: invoice.invoiceNumber,
  customer_name: invoice.customerName,
  customer_email: invoice.customerEmail,
  issue_date: invoice.issueDate?.toISOString(),
  due_date: invoice.dueDate?.toISOString(),
  items: invoice.items,
  subtotal: invoice.subtotal,
  tax_rate: invoice.taxRate,
  tax_amount: invoice.taxAmount,
  total: invoice.total,
  notes: invoice.notes,
  status: invoice.status,
  user_id: supabase.auth.getUser().then(({ data }) => data.user?.id)
});

// Get all invoices
export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return invoices.map(mapSupabaseInvoice);
  } catch (error) {
    console.error('Error in getInvoices:', error);
    throw error;
  }
};

// Get invoice by ID
export const getInvoiceById = async (id: string): Promise<Invoice | undefined> => {
  try {
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!invoice) return undefined;

    return mapSupabaseInvoice(invoice);
  } catch (error) {
    console.error('Error in getInvoiceById:', error);
    throw error;
  }
};

// Create a new invoice
export const createInvoice = async (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): Promise<Invoice> => {
  try {
    const newInvoice = {
      ...mapToSupabaseInvoice(invoice),
      invoice_number: generateInvoiceNumber(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('invoices')
      .insert([newInvoice])
      .select()
      .single();

    if (error) throw error;

    return mapSupabaseInvoice(data);
  } catch (error) {
    console.error('Error in createInvoice:', error);
    throw error;
  }
};

// Update an existing invoice
export const updateInvoice = async (invoice: Invoice): Promise<Invoice> => {
  try {
    const updatedInvoice = {
      ...mapToSupabaseInvoice(invoice),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('invoices')
      .update(updatedInvoice)
      .eq('id', invoice.id)
      .select()
      .single();

    if (error) throw error;

    return mapSupabaseInvoice(data);
  } catch (error) {
    console.error('Error in updateInvoice:', error);
    throw error;
  }
};

// Delete an invoice
export const deleteInvoice = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error in deleteInvoice:', error);
    throw error;
  }
};

// Calculate totals for an invoice
export const calculateInvoiceTotals = (items: InvoiceItem[], taxRate: number) => {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;
  
  return {
    subtotal,
    taxAmount,
    total
  };
};
