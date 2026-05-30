import { Badge } from '@/components/ui/badge';
import { LoanStatus } from '@/types';

const statusVariant: Record<LoanStatus, 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline'> = {
  [LoanStatus.PENDING]: 'warning',
  [LoanStatus.REJECTED]: 'destructive',
  [LoanStatus.SANCTIONED]: 'secondary',
  [LoanStatus.DISBURSED]: 'default',
  [LoanStatus.CLOSED]: 'success',
};

export function LoanStatusBadge({ status }: { status: LoanStatus }) {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
}
