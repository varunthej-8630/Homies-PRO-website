-- ==============================================================================
-- 004_PROJECT_FILES_AND_IMAGES.SQL
-- Deliverables package (Private Storage) & Project Media Gallery (Public Storage)
-- ==============================================================================

CREATE TYPE project_file_type AS ENUM (
    'SOURCE_CODE_ZIP',
    'THESIS_REPORT_PDF',
    'PRESENTATION_PPTX',
    'CIRCUIT_DIAGRAM',
    'DATABASE_SEED_SQL',
    'ADDITIONAL_DOCS'
);

-- Private Digital Deliverables
CREATE TABLE IF NOT EXISTS public.project_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    file_type project_file_type NOT NULL,
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL, -- e.g. "project-deliverables/{project_id}/source_code.zip"
    file_size_bytes BIGINT NOT NULL,
    mime_type TEXT,
    sha256_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Public Gallery Images
CREATE TABLE IF NOT EXISTS public.project_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    storage_path TEXT,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    alt_text TEXT,
    is_cover BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON public.project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);
