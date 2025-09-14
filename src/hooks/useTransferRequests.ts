import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface TransferRequest {
  id: string;
  resource_id: string;
  from_department_id: string;
  to_department_id: string;
  quantity: number;
  status: 'pending' | 'approved' | 'rejected';
  request_date: string;
  approval_date?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
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

export const useTransferRequests = () => {
  return useQuery({
    queryKey: ['transfer_requests'],
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

      if (error) {
        console.error('Error fetching transfer requests:', error);
        throw error;
      }
      return data as TransferRequest[];
    },
  });
};

export const useCreateTransferRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: Omit<TransferRequest, 'id' | 'created_at' | 'request_date' | 'updated_at' | 'resource' | 'from_department' | 'to_department'>) => {
      const { data, error } = await supabase
        .from('transfer_requests')
        .insert({
          ...request,
          request_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating transfer request:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfer_requests'] });
    },
  });
};

export const useUpdateTransferRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...request }: Partial<TransferRequest> & { id: string }) => {
      const { data, error } = await supabase
        .from('transfer_requests')
        .update({
          ...request,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating transfer request:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfer_requests'] });
    },
  });
};
