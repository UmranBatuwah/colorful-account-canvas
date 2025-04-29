
import { Invoice, InvoiceItem, InvoiceStatus } from '@/types';
import { v4 as uuidv4 } from 'uuid';
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

// Sample mock data
const mockInvoices: Invoice[] = [
  {
    id: uuidv4(),
    invoiceNumber: 'INV-231001',
    customerName: 'Acme Corporation',
    customerEmail: 'billing@acmecorp.com',
    issueDate: new Date(2023, 9, 1),
    dueDate: new Date(2023, 9, 15),
    items: [
      {
        id: uuidv4(),
        description: 'Web Development Services',
        quantity: 40,
        unitPrice: 85,
        amount: 3400,
      },
      {
        id: uuidv4(),
        description: 'UI/UX Design',
        quantity: 20,
        unitPrice: 95,
        amount: 1900,
      },
    ],
    subtotal: 5300,
    taxRate: 10,
    taxAmount: 530,
    total: 5830,
    notes: 'Thank you for your business!',
    status: 'paid',
    createdAt: new Date(2023, 9, 1),
    updatedAt: new Date(2023, 9, 1),
  },
  {
    id: uuidv4(),
    invoiceNumber: 'INV-231002',
    customerName: 'Globex Industries',
    customerEmail: 'accounts@globex.com',
    issueDate: new Date(2023, 9, 5),
    dueDate: new Date(2023, 10, 5),
    items: [
      {
        id: uuidv4(),
        description: 'Monthly Maintenance',
        quantity: 1,
        unitPrice: 1500,
        amount: 1500,
      }
    ],
    subtotal: 1500,
    taxRate: 10,
    taxAmount: 150,
    total: 1650,
    status: 'sent',
    createdAt: new Date(2023, 9, 5),
    updatedAt: new Date(2023, 9, 5),
  },
  {
    id: uuidv4(),
    invoiceNumber: 'INV-231003',
    customerName: 'TechStart LLC',
    customerEmail: 'finance@techstart.io',
    issueDate: new Date(2023, 9, 10),
    dueDate: new Date(2023, 9, 25),
    items: [
      {
        id: uuidv4(),
        description: 'API Integration',
        quantity: 25,
        unitPrice: 110,
        amount: 2750,
      },
      {
        id: uuidv4(),
        description: 'Server Configuration',
        quantity: 10,
        unitPrice: 150,
        amount: 1500,
      }
    ],
    subtotal: 4250,
    taxRate: 10,
    taxAmount: 425,
    total: 4675,
    notes: 'Net 15 payment terms',
    status: 'overdue',
    createdAt: new Date(2023, 9, 10),
    updatedAt: new Date(2023, 9, 10),
  }
];

// Initialize local storage with mock data
const initializeInvoices = (): void => {
  if (!localStorage.getItem('invoices')) {
    localStorage.setItem('invoices', JSON.stringify(mockInvoices));
  }
};

// Get all invoices
export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Fall back to local storage if not authenticated
      initializeInvoices();
      const invoices = localStorage.getItem('invoices');
      return invoices ? JSON.parse(invoices) : [];
    }
    
    // Get invoices from Supabase
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching invoices:', error);
      // Fall back to local storage
      initializeInvoices();
      const invoices = localStorage.getItem('invoices');
      return invoices ? JSON.parse(invoices) : [];
    }
    
    // Get invoice items for each invoice
    const invoiceWithItems = await Promise.all(
      invoices.map(async (invoice) => {
        const { data: items, error: itemsError } = await supabase
          .from('invoice_items')
          .select('*')
          .eq('invoice_id', invoice.id);
        
        if (itemsError) {
          console.error('Error fetching invoice items:', itemsError);
          return {
            ...invoice,
            issue_date: new Date(invoice.issue_date),
            due_date: new Date(invoice.due_date),
            created_at: new Date(invoice.created_at),
            updated_at: new Date(invoice.updated_at),
            items: []
          };
        }
        
        return {
          ...invoice,
          invoiceNumber: invoice.invoice_number,
          issueDate: new Date(invoice.issue_date),
          dueDate: new Date(invoice.due_date),
          createdAt: new Date(invoice.created_at),
          updatedAt: new Date(invoice.updated_at),
          items: items.map(item => ({
            id: item.id,
            description: item.description,
            quantity: parseFloat(item.quantity),
            unitPrice: parseFloat(item.unit_price),
            amount: parseFloat(item.amount)
          }))
        };
      })
    );
    
    return invoiceWithItems;
  } catch (error) {
    console.error('Error in getInvoices:', error);
    // Fall back to local storage
    initializeInvoices();
    const invoices = localStorage.getItem('invoices');
    return invoices ? JSON.parse(invoices) : [];
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
    
    if (error) {
      console.error('Error fetching invoice by ID:', error);
      // Fall back to local storage
      initializeInvoices();
      const invoices = localStorage.getItem('invoices');
      const parsedInvoices = invoices ? JSON.parse(invoices) : [];
      return parsedInvoices.find((invoice: Invoice) => invoice.id === id);
    }
    
    if (!invoice) return undefined;
    
    // Get items for this invoice
    const { data: items, error: itemsError } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', id);
    
    if (itemsError) {
      console.error('Error fetching invoice items:', itemsError);
      return {
        ...invoice,
        invoiceNumber: invoice.invoice_number,
        issueDate: new Date(invoice.issue_date),
        dueDate: new Date(invoice.due_date),
        createdAt: new Date(invoice.created_at),
        updatedAt: new Date(invoice.updated_at),
        items: []
      };
    }
    
    return {
      ...invoice,
      invoiceNumber: invoice.invoice_number,
      issueDate: new Date(invoice.issue_date),
      dueDate: new Date(invoice.due_date),
      createdAt: new Date(invoice.created_at),
      updatedAt: new Date(invoice.updated_at),
      items: items.map(item => ({
        id: item.id,
        description: item.description,
        quantity: parseFloat(item.quantity),
        unitPrice: parseFloat(item.unit_price),
        amount: parseFloat(item.amount)
      }))
    };
  } catch (error) {
    console.error('Error in getInvoiceById:', error);
    // Fall back to local storage
    initializeInvoices();
    const invoices = localStorage.getItem('invoices');
    const parsedInvoices = invoices ? JSON.parse(invoices) : [];
    return parsedInvoices.find((invoice: Invoice) => invoice.id === id);
  }
};

// Create a new invoice
export const createInvoice = async (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): Promise<Invoice> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const invoiceNumber = generateInvoiceNumber();
    
    // Create invoice in Supabase
    const { data: newInvoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert([{
        invoice_number: invoiceNumber,
        customer_name: invoice.customerName,
        customer_email: invoice.customerEmail,
        issue_date: invoice.issueDate,
        due_date: invoice.dueDate,
        subtotal: invoice.subtotal,
        tax_rate: invoice.taxRate,
        tax_amount: invoice.taxAmount,
        total: invoice.total,
        notes: invoice.notes,
        status: invoice.status,
        user_id: user.id
      }])
      .select()
      .single();
    
    if (invoiceError) {
      console.error('Error creating invoice:', invoiceError);
      // Fall back to local storage
      initializeInvoices();
      const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      
      const localNewInvoice: Invoice = {
        ...invoice,
        id: uuidv4(),
        invoiceNumber: generateInvoiceNumber(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      invoices.push(localNewInvoice);
      localStorage.setItem('invoices', JSON.stringify(invoices));
      
      return localNewInvoice;
    }
    
    // Add items to the invoice
    const itemsToInsert = invoice.items.map(item => ({
      invoice_id: newInvoice.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      amount: item.amount
    }));
    
    const { data: items, error: itemsError } = await supabase
      .from('invoice_items')
      .insert(itemsToInsert)
      .select();
    
    if (itemsError) {
      console.error('Error creating invoice items:', itemsError);
    }
    
    return {
      ...newInvoice,
      id: newInvoice.id,
      invoiceNumber: newInvoice.invoice_number,
      customerName: newInvoice.customer_name,
      customerEmail: newInvoice.customer_email,
      issueDate: new Date(newInvoice.issue_date),
      dueDate: new Date(newInvoice.due_date),
      createdAt: new Date(newInvoice.created_at),
      updatedAt: new Date(newInvoice.updated_at),
      items: items ? items.map(item => ({
        id: item.id,
        description: item.description,
        quantity: parseFloat(item.quantity),
        unitPrice: parseFloat(item.unit_price),
        amount: parseFloat(item.amount)
      })) : invoice.items
    };
  } catch (error) {
    console.error('Error in createInvoice:', error);
    // Fall back to local storage
    initializeInvoices();
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    
    const localNewInvoice: Invoice = {
      ...invoice,
      id: uuidv4(),
      invoiceNumber: generateInvoiceNumber(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    invoices.push(localNewInvoice);
    localStorage.setItem('invoices', JSON.stringify(invoices));
    
    return localNewInvoice;
  }
};

// Update an existing invoice
export const updateInvoice = async (invoice: Invoice): Promise<Invoice> => {
  try {
    // Update invoice in Supabase
    const { error: invoiceError } = await supabase
      .from('invoices')
      .update({
        invoice_number: invoice.invoiceNumber,
        customer_name: invoice.customerName,
        customer_email: invoice.customerEmail,
        issue_date: invoice.issueDate,
        due_date: invoice.dueDate,
        subtotal: invoice.subtotal,
        tax_rate: invoice.taxRate,
        tax_amount: invoice.taxAmount,
        total: invoice.total,
        notes: invoice.notes,
        status: invoice.status
      })
      .eq('id', invoice.id);
    
    if (invoiceError) {
      console.error('Error updating invoice:', invoiceError);
      // Fall back to local storage
      initializeInvoices();
      const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      const index = invoices.findIndex((inv: Invoice) => inv.id === invoice.id);
      
      if (index !== -1) {
        invoices[index] = {
          ...invoice,
          updatedAt: new Date(),
        };
        localStorage.setItem('invoices', JSON.stringify(invoices));
      }
      
      return {
        ...invoice,
        updatedAt: new Date(),
      };
    }
    
    // Delete existing items for this invoice
    const { error: deleteError } = await supabase
      .from('invoice_items')
      .delete()
      .eq('invoice_id', invoice.id);
    
    if (deleteError) {
      console.error('Error deleting invoice items:', deleteError);
    }
    
    // Add updated items to the invoice
    const itemsToInsert = invoice.items.map(item => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      amount: item.amount
    }));
    
    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(itemsToInsert);
    
    if (itemsError) {
      console.error('Error updating invoice items:', itemsError);
    }
    
    // Get the updated invoice with its new timestamp
    const { data: updatedInvoice, error: fetchError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoice.id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching updated invoice:', fetchError);
      // Return invoice with updated date
      return {
        ...invoice,
        updatedAt: new Date()
      };
    }
    
    return {
      ...invoice,
      updatedAt: new Date(updatedInvoice.updated_at)
    };
  } catch (error) {
    console.error('Error in updateInvoice:', error);
    // Fall back to local storage
    initializeInvoices();
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const index = invoices.findIndex((inv: Invoice) => inv.id === invoice.id);
    
    if (index !== -1) {
      invoices[index] = {
        ...invoice,
        updatedAt: new Date(),
      };
      localStorage.setItem('invoices', JSON.stringify(invoices));
    }
    
    return {
      ...invoice,
      updatedAt: new Date(),
    };
  }
};

// Delete an invoice
export const deleteInvoice = async (id: string): Promise<void> => {
  try {
    // Delete invoice from Supabase (cascade will automatically delete items)
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting invoice:', error);
      // Fall back to local storage
      initializeInvoices();
      let invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      invoices = invoices.filter((invoice: Invoice) => invoice.id !== id);
      localStorage.setItem('invoices', JSON.stringify(invoices));
    }
  } catch (error) {
    console.error('Error in deleteInvoice:', error);
    // Fall back to local storage
    initializeInvoices();
    let invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    invoices = invoices.filter((invoice: Invoice) => invoice.id !== id);
    localStorage.setItem('invoices', JSON.stringify(invoices));
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
