import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface AllocationRequest {
  id: string;
  resource_id: string;
  requesting_department_id: string;
  quantity: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected';
  request_date: string;
  approval_date?: string;
  created_at: string;
  updated_at?: string;
  resource?: {
    name: string;
    status: string;
  };
  requesting_department?: {
    name: string;
  };
}

export const useAllocationRequests = () => {
  return useQuery({
    queryKey: ['allocation_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('allocation_requests')
        .select(`
          *,
          resource:resources(name, status),
          requesting_department:departments!requesting_department_id(name)
        `)
        .order('request_date', { ascending: false });

      if (error) {
        console.error('Error fetching allocation requests:', error);
        throw error;
      }
      return data as AllocationRequest[];
    },
  });
};

export const useCreateAllocationRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: Omit<AllocationRequest, 'id' | 'created_at' | 'request_date' | 'updated_at' | 'resource' | 'requesting_department'>) => {
      const { data, error } = await supabase
        .from('allocation_requests')
        .insert({
          ...request,
          request_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating allocation request:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocation_requests'] });
    },
  });
};

export const useUpdateAllocationRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...request }: Partial<AllocationRequest> & { id: string }) => {
      const { data, error } = await supabase
        .from('allocation_requests')
        .update({
          ...request,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating allocation request:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocation_requests'] });
    },
  });
};
