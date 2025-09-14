import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface Transfer {
  id: string;
  resource_id: string;
  from_department_id: string;
  to_department_id: string;
  quantity: number;
  status: 'pending' | 'approved' | 'rejected';
  request_date: string;
  approval_date?: string;
  resource?: {
    name: string;
    status: string;
  };
  from_department?: {
    name: string;
  };
  to_department?: {
    name: string;
  };
}

export const useTransfers = () => {
  return useQuery({
    queryKey: ['transfers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transfer_requests')
        .select(`
          *,
          resource:resources(name, status),
          from_department:departments!from_department_id(name),
          to_department:departments!to_department_id(name)
        `)
        .order('request_date', { ascending: false });

      if (error) throw error;
      return data as Transfer[];
    },
  });
};

export const useCreateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transfer: Omit<Transfer, 'id' | 'request_date' | 'resource' | 'from_department' | 'to_department'>) => {
      const { data, error } = await supabase
        .from('transfer_requests')
        .insert(transfer)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
    },
  });
};

export const useUpdateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...transfer }: Partial<Transfer> & { id: string }) => {
      const { data, error } = await supabase
        .from('transfer_requests')
        .update(transfer)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
    },
  });
};
