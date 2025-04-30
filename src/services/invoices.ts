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

// Initialize local storage with empty data (no mock data)
const initializeInvoices = (): void => {
  if (!localStorage.getItem('invoices')) {
    localStorage.setItem('invoices', JSON.stringify([]));
  }
};

// Get all invoices
export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    // Initialize with empty data instead of mock data
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
