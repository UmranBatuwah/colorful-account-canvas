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
    // Since we're having issues with the Supabase tables, we'll use local storage
    // until the database tables are properly created
    initializeInvoices();
    const invoices = localStorage.getItem('invoices');
    return invoices ? JSON.parse(invoices) : [];
  } catch (error) {
    console.error('Error in getInvoices:', error);
    initializeInvoices();
    const invoices = localStorage.getItem('invoices');
    return invoices ? JSON.parse(invoices) : [];
  }
};

// Get invoice by ID
export const getInvoiceById = async (id: string): Promise<Invoice | undefined> => {
  try {
    // Use local storage for now
    initializeInvoices();
    const invoices = localStorage.getItem('invoices');
    const parsedInvoices = invoices ? JSON.parse(invoices) : [];
    return parsedInvoices.find((invoice: Invoice) => invoice.id === id);
  } catch (error) {
    console.error('Error in getInvoiceById:', error);
    initializeInvoices();
    const invoices = localStorage.getItem('invoices');
    const parsedInvoices = invoices ? JSON.parse(invoices) : [];
    return parsedInvoices.find((invoice: Invoice) => invoice.id === id);
  }
};

// Create a new invoice
export const createInvoice = async (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): Promise<Invoice> => {
  try {
    // Use local storage for now
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
  } catch (error) {
    console.error('Error in createInvoice:', error);
    // Fall back to creating locally
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
    // Use local storage for now
    initializeInvoices();
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const index = invoices.findIndex((inv: Invoice) => inv.id === invoice.id);
    
    if (index !== -1) {
      const updatedInvoice = {
        ...invoice,
        updatedAt: new Date(),
      };
      invoices[index] = updatedInvoice;
      localStorage.setItem('invoices', JSON.stringify(invoices));
      return updatedInvoice;
    }
    
    throw new Error(`Invoice with id ${invoice.id} not found`);
  } catch (error) {
    console.error('Error in updateInvoice:', error);
    // Fall back to updating locally
    initializeInvoices();
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const index = invoices.findIndex((inv: Invoice) => inv.id === invoice.id);
    
    if (index !== -1) {
      const updatedInvoice = {
        ...invoice,
        updatedAt: new Date(),
      };
      invoices[index] = updatedInvoice;
      localStorage.setItem('invoices', JSON.stringify(invoices));
      return updatedInvoice;
    }
    
    throw new Error(`Invoice with id ${invoice.id} not found`);
  }
};

// Delete an invoice
export const deleteInvoice = async (id: string): Promise<void> => {
  try {
    // Use local storage for now
    initializeInvoices();
    let invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    invoices = invoices.filter((invoice: Invoice) => invoice.id !== id);
    localStorage.setItem('invoices', JSON.stringify(invoices));
  } catch (error) {
    console.error('Error in deleteInvoice:', error);
    // Fall back to deleting locally
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
