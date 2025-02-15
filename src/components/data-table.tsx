// components/data-table.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User } from '@/types/user';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/app/contexts/LoadingContext';


interface DataTableProps {
  data: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const roleColors = {
  admin: 'bg-red-100 text-red-800',
  sales: 'bg-blue-100 text-blue-800',
  optometrist: 'bg-green-100 text-green-800',
  customer: 'bg-gray-100 text-gray-800',
};

export function DataTable({ data, onEdit, onDelete }: DataTableProps) {


  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.first_name}</TableCell>
            <TableCell>{user.last_name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge className={roleColors[user.role || 'customer']}>
                {user.role || 'customer'}
              </Badge>
            </TableCell>
            <TableCell>{user.created_at}</TableCell>
            <TableCell>{user.updated_at}</TableCell>
            <TableCell className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(user.id)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}