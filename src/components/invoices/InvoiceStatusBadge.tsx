
import { cn } from "@/lib/utils";
import { InvoiceStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { invoiceStatusOptions } from "@/services/invoices";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus["value"];
  className?: string;
}

const InvoiceStatusBadge = ({ status, className }: InvoiceStatusBadgeProps) => {
  const statusOption = invoiceStatusOptions.find((option) => option.value === status);
  
  if (!statusOption) return null;
  
  return (
    <Badge className={cn(statusOption.color, "font-medium", className)}>
      {statusOption.label}
    </Badge>
  );
};

export default InvoiceStatusBadge;
