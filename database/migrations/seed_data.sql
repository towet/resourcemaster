-- Example seed data for Supabase resource allocation app
-- Replace UUIDs with actual user UUIDs from your Supabase auth.users table as needed

-- Departments
INSERT INTO public.departments (id, name, description, created_at, created_by, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'IT', 'Information Technology', NOW(), NULL, NOW()),
  ('00000000-0000-0000-0000-000000000002', 'HR', 'Human Resources', NOW(), NULL, NOW()),
  ('00000000-0000-0000-0000-000000000003', 'Logistics', 'Logistics and Transport', NOW(), NULL, NOW());

-- Resources
INSERT INTO public.resources (id, name, description, status, department_id, quantity, location, created_at, created_by, updated_at)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'Laptop', 'Dell Latitude 5420', 'available', '00000000-0000-0000-0000-000000000001', 10, 'HQ', NOW(), NULL, NOW()),
  ('10000000-0000-0000-0000-000000000002', 'Projector', 'Epson XGA', 'available', '00000000-0000-0000-0000-000000000002', 3, 'Conference Room', NOW(), NULL, NOW()),
  ('10000000-0000-0000-0000-000000000003', 'Vehicle', 'Toyota Hiace', 'maintenance', '00000000-0000-0000-0000-000000000003', 2, 'Garage', NOW(), NULL, NOW());

-- Allocation Requests
INSERT INTO public.allocation_requests (id, resource_id, requesting_department_id, quantity, priority, status, notes, request_date, approval_date, created_by, updated_at)
VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 2, 'high', 'pending', 'For onboarding', NOW(), NULL, NULL, NOW()),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 1, 'medium', 'approved', 'Monthly meeting', NOW(), NOW(), NULL, NOW());

-- Transfer Requests
INSERT INTO public.transfer_requests (id, resource_id, from_department_id, to_department_id, quantity, status, notes, request_date, approval_date, created_by, updated_at)
VALUES
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 1, 'pending', 'Temporary use', NOW(), NULL, NULL, NOW());

-- Note: You may need to update created_by fields with valid user UUIDs from your auth.users table if RLS policies require it.
