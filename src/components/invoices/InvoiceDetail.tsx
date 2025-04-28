
import { format } from "date-fns";
import { FileText, Printer, Edit, ArrowLeft } from "lucide-react";
import { Invoice } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface InvoiceDetailProps {
  invoice: Invoice;
  onEdit: () => void;
  onBack: () => void;
}

const InvoiceDetail = ({ invoice, onEdit, onBack }: InvoiceDetailProps) => {
  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:p-10">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Invoices
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={printInvoice}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none print:border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Invoice {invoice.invoiceNumber}
            </CardTitle>
          </div>
          <InvoiceStatusBadge status={invoice.status} />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Invoice Header */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">Invoice To:</h3>
              <div className="text-lg font-semibold">{invoice.customerName}</div>
              <div>{invoice.customerEmail}</div>
            </div>
            <div className="space-y-1 text-right">
              <div>
                <span className="text-sm font-semibold text-muted-foreground">Issue Date: </span>
                <span>{format(new Date(invoice.issueDate), "MMMM d, yyyy")}</span>
              </div>
              <div>
                <span className="text-sm font-semibold text-muted-foreground">Due Date: </span>
                <span>{format(new Date(invoice.dueDate), "MMMM d, yyyy")}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Invoice Items */}
          <div>
            <h3 className="font-semibold mb-2">Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Description</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Invoice Totals */}
          <div className="flex flex-col items-end space-y-2">
            <div className="flex justify-between w-60">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-60">
              <span className="text-muted-foreground">Tax ({invoice.taxRate}%):</span>
              <span>${invoice.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-60 font-bold text-lg">
              <span>Total:</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-muted-foreground">{invoice.notes}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground border-t p-4">
          <div>Invoice created on {format(new Date(invoice.createdAt), "MMMM d, yyyy")}</div>
          {invoice.updatedAt !== invoice.createdAt && (
            <div>Last updated on {format(new Date(invoice.updatedAt), "MMMM d, yyyy")}</div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default InvoiceDetail;
