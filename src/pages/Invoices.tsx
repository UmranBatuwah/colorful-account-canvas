
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

import { Invoice } from "@/types";
import { getInvoices, getInvoiceById, createInvoice, updateInvoice } from "@/services/invoices";
import InvoiceList from "@/components/invoices/InvoiceList";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import InvoiceDetail from "@/components/invoices/InvoiceDetail";

type ViewMode = "list" | "create" | "edit" | "view";

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const navigate = useNavigate();
  const location = useLocation();

  // Load invoices
  useEffect(() => {
    const loadInvoices = () => {
      const data = getInvoices();
      setInvoices(data);
    };

    loadInvoices();
  }, []);

  // Check for invoice ID in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const invoiceId = params.get("id");
    
    if (invoiceId) {
      const invoice = getInvoiceById(invoiceId);
      if (invoice) {
        setCurrentInvoice(invoice);
        setViewMode("view");
      }
    }
  }, [location.search]);

  const handleCreateInvoice = (data: Omit<Invoice, "id" | "invoiceNumber" | "createdAt" | "updatedAt">) => {
    const newInvoice = createInvoice(data);
    setInvoices([newInvoice, ...invoices]);
    setCurrentInvoice(newInvoice);
    setViewMode("view");
    toast({
      title: "Invoice created",
      description: "Your invoice has been created successfully.",
    });
  };

  const handleUpdateInvoice = (data: Invoice) => {
    const updatedInvoice = updateInvoice(data);
    setInvoices(invoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
    setCurrentInvoice(updatedInvoice);
    setViewMode("view");
    toast({
      title: "Invoice updated",
      description: "Your invoice has been updated successfully.",
    });
  };

  const handleEditInvoice = (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (invoice) {
      setCurrentInvoice(invoice);
      setViewMode("edit");
      navigate(`/invoices?id=${id}`);
    }
  };

  const handleViewInvoice = (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (invoice) {
      setCurrentInvoice(invoice);
      setViewMode("view");
      navigate(`/invoices?id=${id}`);
    }
  };

  const handleBack = () => {
    setViewMode("list");
    setCurrentInvoice(null);
    navigate("/invoices");
  };

  return (
    <DashboardLayout title="Invoices">
      {viewMode === "list" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Invoices</h1>
            <Button onClick={() => setViewMode("create")}>
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </div>
          <InvoiceList
            invoices={invoices}
            onEdit={handleEditInvoice}
          />
        </div>
      )}

      {viewMode === "create" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Create Invoice</h1>
          </div>
          <InvoiceForm 
            onSubmit={handleCreateInvoice}
            onCancel={handleBack}
          />
        </div>
      )}

      {viewMode === "edit" && currentInvoice && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Edit Invoice</h1>
          </div>
          <InvoiceForm 
            invoice={currentInvoice}
            onSubmit={handleUpdateInvoice}
            onCancel={handleBack}
          />
        </div>
      )}

      {viewMode === "view" && currentInvoice && (
        <InvoiceDetail 
          invoice={currentInvoice} 
          onEdit={() => setViewMode("edit")}
          onBack={handleBack}
        />
      )}
    </DashboardLayout>
  );
};

export default Invoices;
