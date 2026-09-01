-- ==============================================================================
-- 002_CATEGORIES.SQL
-- Project taxonomies and marketplace domain categories
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Seed Default Marketplace Categories
INSERT INTO public.categories (name, slug, description, icon, sort_order) VALUES
('AI & Machine Learning', 'ai-ml', 'Deep neural networks, computer vision pipelines, NLP transformers, and predictive models.', '🤖', 1),
('Web & Full Stack', 'web-dev', 'Modern Next.js, React, Node.js, and cloud database applications engineered to scale.', '🌐', 2),
('IoT & Robotics', 'iot-robotics', 'Hardware prototypes, ESP32/Arduino integration, telemetry sensors, and automation systems.', '⚡', 3),
('Embedded & VLSI Design', 'embedded-vlsi', 'Microcontroller firmware, Verilog/VHDL RTL designs, and custom PCB architectures.', '🔬', 4),
('Automation & SaaS', 'automation-saas', 'Enterprise workflow bots, scraping engines, multi-tenant portals, and micro-SaaS builds.', '⚙️', 5),
('Mobile Applications', 'mobile-apps', 'Cross-platform React Native and Flutter applications with offline sync and cloud backends.', '📱', 6)
ON CONFLICT (slug) DO NOTHING;
