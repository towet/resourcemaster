-- Enable Row Level Security
ALTER TABLE IF EXISTS public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.allocation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.transfer_requests ENABLE ROW LEVEL SECURITY;

-- Create enum types
CREATE TYPE public.request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.resource_status AS ENUM ('available', 'in_use', 'maintenance');
CREATE TYPE public.request_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create departments table
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(name)
);

-- Create resources table
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status resource_status DEFAULT 'available' NOT NULL,
    department_id UUID REFERENCES public.departments(id),
    quantity INTEGER DEFAULT 1 NOT NULL,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(name)
);

-- Create allocation_requests table
CREATE TABLE IF NOT EXISTS public.allocation_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resource_id UUID REFERENCES public.resources(id) NOT NULL,
    requesting_department_id UUID REFERENCES public.departments(id) NOT NULL,
    quantity INTEGER NOT NULL,
    priority request_priority DEFAULT 'medium' NOT NULL,
    status request_status DEFAULT 'pending' NOT NULL,
    notes TEXT,
    request_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    approval_date TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create transfer_requests table
CREATE TABLE IF NOT EXISTS public.transfer_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resource_id UUID REFERENCES public.resources(id) NOT NULL,
    from_department_id UUID REFERENCES public.departments(id) NOT NULL,
    to_department_id UUID REFERENCES public.departments(id) NOT NULL,
    quantity INTEGER NOT NULL,
    status request_status DEFAULT 'pending' NOT NULL,
    notes TEXT,
    request_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    approval_date TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CHECK (from_department_id != to_department_id)
);

-- Create updated_at function for triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.departments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.resources
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.allocation_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.transfer_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create policies for departments
CREATE POLICY "Enable read access for authenticated users" ON public.departments
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON public.departments
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON public.departments
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policies for resources
CREATE POLICY "Enable read access for authenticated users" ON public.resources
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON public.resources
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON public.resources
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policies for allocation_requests
CREATE POLICY "Enable read access for authenticated users" ON public.allocation_requests
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON public.allocation_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON public.allocation_requests
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policies for transfer_requests
CREATE POLICY "Enable read access for authenticated users" ON public.transfer_requests
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON public.transfer_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON public.transfer_requests
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_departments_created_by ON public.departments(created_by);
CREATE INDEX IF NOT EXISTS idx_resources_department_id ON public.resources(department_id);
CREATE INDEX IF NOT EXISTS idx_resources_created_by ON public.resources(created_by);
CREATE INDEX IF NOT EXISTS idx_allocation_requests_resource_id ON public.allocation_requests(resource_id);
CREATE INDEX IF NOT EXISTS idx_allocation_requests_department_id ON public.allocation_requests(requesting_department_id);
CREATE INDEX IF NOT EXISTS idx_allocation_requests_created_by ON public.allocation_requests(created_by);
CREATE INDEX IF NOT EXISTS idx_allocation_requests_status ON public.allocation_requests(status);
CREATE INDEX IF NOT EXISTS idx_transfer_requests_resource_id ON public.transfer_requests(resource_id);
CREATE INDEX IF NOT EXISTS idx_transfer_requests_from_department_id ON public.transfer_requests(from_department_id);
CREATE INDEX IF NOT EXISTS idx_transfer_requests_to_department_id ON public.transfer_requests(to_department_id);
CREATE INDEX IF NOT EXISTS idx_transfer_requests_created_by ON public.transfer_requests(created_by);
CREATE INDEX IF NOT EXISTS idx_transfer_requests_status ON public.transfer_requests(status);

-- Add helpful comments to tables
COMMENT ON TABLE public.departments IS 'Stores department information';
COMMENT ON TABLE public.resources IS 'Stores resource information';
COMMENT ON TABLE public.allocation_requests IS 'Stores resource allocation requests';
COMMENT ON TABLE public.transfer_requests IS 'Stores resource transfer requests between departments';

-- Grant necessary permissions to authenticated users
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
