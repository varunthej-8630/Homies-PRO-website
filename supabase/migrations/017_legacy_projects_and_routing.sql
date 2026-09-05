-- ==============================================================================
-- 017_LEGACY_PROJECTS_AND_ROUTING.SQL
-- Schema enhancement and seeding for 7 canonical Homies Studio legacy projects.
-- Preserves existing routing: /projects/project1 through /projects/project7
-- ==============================================================================

-- 1. Ensure projects table has legacy_id column with unique constraint
ALTER TABLE public.projects 
    ADD COLUMN IF NOT EXISTS legacy_id TEXT UNIQUE;

-- Allow studio-managed projects to have optional creator_id
ALTER TABLE public.projects 
    ALTER COLUMN creator_id DROP NOT NULL;

-- Create index on legacy_id for fast O(1) slug and route lookups
CREATE INDEX IF NOT EXISTS idx_projects_legacy_id ON public.projects(legacy_id);

-- 2. Seed / Upsert the 7 Canonical Real Projects
DO $$
DECLARE
    homies_creator_id UUID;
    cat_ai_id UUID;
    cat_web_id UUID;
    cat_iot_id UUID;
    cat_vlsi_id UUID;
    cat_auto_id UUID;
    cat_mob_id UUID;
    
    p1_id UUID := '10000000-0000-0000-0000-000000000001';
    p2_id UUID := '10000000-0000-0000-0000-000000000002';
    p3_id UUID := '10000000-0000-0000-0000-000000000003';
    p4_id UUID := '10000000-0000-0000-0000-000000000004';
    p5_id UUID := '10000000-0000-0000-0000-000000000005';
    p6_id UUID := '10000000-0000-0000-0000-000000000006';
    p7_id UUID := '10000000-0000-0000-0000-000000000007';
BEGIN
    -- Dynamically obtain existing Admin Creator Profile if available
    SELECT id INTO homies_creator_id 
    FROM public.creator_profiles 
    ORDER BY (handle = 'varunthejparimihere') DESC 
    LIMIT 1;

    -- Look up category IDs by slug
    SELECT id INTO cat_ai_id FROM public.categories WHERE slug = 'ai-ml' LIMIT 1;
    SELECT id INTO cat_web_id FROM public.categories WHERE slug = 'web-dev' LIMIT 1;
    SELECT id INTO cat_iot_id FROM public.categories WHERE slug = 'iot-robotics' LIMIT 1;
    SELECT id INTO cat_vlsi_id FROM public.categories WHERE slug = 'embedded-vlsi' LIMIT 1;
    SELECT id INTO cat_auto_id FROM public.categories WHERE slug = 'automation-saas' LIMIT 1;
    SELECT id INTO cat_mob_id FROM public.categories WHERE slug = 'mobile-apps' LIMIT 1;

    -- Fallback category assignment if not matched
    IF cat_ai_id IS NULL THEN SELECT id INTO cat_ai_id FROM public.categories LIMIT 1; END IF;
    IF cat_web_id IS NULL THEN SELECT id INTO cat_web_id FROM public.categories LIMIT 1; END IF;
    IF cat_iot_id IS NULL THEN SELECT id INTO cat_iot_id FROM public.categories LIMIT 1; END IF;
    IF cat_vlsi_id IS NULL THEN SELECT id INTO cat_vlsi_id FROM public.categories LIMIT 1; END IF;
    IF cat_auto_id IS NULL THEN SELECT id INTO cat_auto_id FROM public.categories LIMIT 1; END IF;
    IF cat_mob_id IS NULL THEN SELECT id INTO cat_mob_id FROM public.categories LIMIT 1; END IF;

    -- Upsert Project 1
    INSERT INTO public.projects (
        id, legacy_id, creator_id, category_id, title, slug, tagline, handwriting_note,
        description, project_type, difficulty, platform, language, tech_stack,
        academic_price, commercial_price, original_price, status, is_featured, is_bestseller, is_trending,
        sales_count, rating, review_count, cover_image_url, live_demo_url, published_at
    ) VALUES (
        p1_id, 'project1', homies_creator_id, cat_ai_id,
        'AI & ML Solutions', 'ai-ml-solutions',
        'End-to-end edge AI pipeline with real-time classification, quantized weights & ONNX runtime.',
        'Precision inference running directly on low-power silicon.',
        '["Autonomous Edge AI pipeline engineered for real-time computer vision inference on constrained hardware.", "Includes custom YOLOv8 backbone, INT8 quantization benchmarks, and TensorRT runtime optimization."]'::jsonb,
        'Edge AI & Computer Vision', 'Advanced', 'Linux / Jetson / Raspberry Pi', 'Python / C++',
        ARRAY['PyTorch', 'TensorRT', 'OpenCV', 'FastAPI', 'ONNX', 'Python', 'C++'],
        2999.00, 4999.00, 5999.00, 'PUBLISHED', TRUE, TRUE, FALSE,
        185, 4.96, 42, '/project1/project1.webp', 'https://demo-ai.homiesstudio.com', NOW()
    ) ON CONFLICT (legacy_id) DO UPDATE SET
        title = EXCLUDED.title,
        status = 'PUBLISHED',
        cover_image_url = EXCLUDED.cover_image_url;

    -- Upsert Project 2
    INSERT INTO public.projects (
        id, legacy_id, creator_id, category_id, title, slug, tagline, handwriting_note,
        description, project_type, difficulty, platform, language, tech_stack,
        academic_price, commercial_price, original_price, status, is_featured, is_bestseller, is_trending,
        sales_count, rating, review_count, cover_image_url, live_demo_url, published_at
    ) VALUES (
        p2_id, 'project2', homies_creator_id, cat_web_id,
        'Web & Full-Stack Development', 'web-full-stack',
        'Multi-tenant SaaS with real-time sync, role-based access & automated invoice generation.',
        'Production-ready boilerplate crafted for enterprise reliability.',
        '["Comprehensive full-stack enterprise web application built with modern architecture and rich aesthetics.", "Equipped with secure authentication, RBAC authorization, and automated analytics dashboards."]'::jsonb,
        'Full-Stack Web Application', 'Intermediate', 'Web Application', 'TypeScript / Node.js',
        ARRAY['Next.js', 'React', 'Node.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Socket.io'],
        2499.00, 4499.00, 4999.00, 'PUBLISHED', TRUE, FALSE, TRUE,
        142, 4.92, 38, '/project2/project2.webp', 'https://demo-hub.homiesstudio.com', NOW()
    ) ON CONFLICT (legacy_id) DO UPDATE SET
        title = EXCLUDED.title,
        status = 'PUBLISHED',
        cover_image_url = EXCLUDED.cover_image_url;

    -- Upsert Project 3
    INSERT INTO public.projects (
        id, legacy_id, creator_id, category_id, title, slug, tagline, handwriting_note,
        description, project_type, difficulty, platform, language, tech_stack,
        academic_price, commercial_price, original_price, status, is_featured, is_bestseller, is_trending,
        sales_count, rating, review_count, cover_image_url, live_demo_url, published_at
    ) VALUES (
        p3_id, 'project3', homies_creator_id, cat_iot_id,
        'IoT & Robotics Systems', 'iot-robotics-systems',
        'Hardware sensor nodes, telemetry dashboard & automated moisture-triggered pumps.',
        'Bridging firmware logic with cloud intelligence for zero crop loss.',
        '["Hardware-integrated smart farming ecosystem utilizing ESP32 microcontrollers, multi-sensor soil probes, and automated cloud telemetry.", "Features automated water valves, solar charge controllers, and weather forecast integration."]'::jsonb,
        'IoT Hardware & Cloud Platform', 'Beginner Friendly', 'Hardware + Cloud Dashboard', 'C++ / Python',
        ARRAY['ESP32', 'Arduino C++', 'MQTT', 'Node-RED', 'InfluxDB', 'Grafana', 'Python'],
        3499.00, 5999.00, 6999.00, 'PUBLISHED', TRUE, TRUE, FALSE,
        210, 4.98, 56, '/project3/project3.webp', 'https://demo-iot.homiesstudio.com', NOW()
    ) ON CONFLICT (legacy_id) DO UPDATE SET
        title = EXCLUDED.title,
        status = 'PUBLISHED',
        cover_image_url = EXCLUDED.cover_image_url;

    -- Upsert Project 4
    INSERT INTO public.projects (
        id, legacy_id, creator_id, category_id, title, slug, tagline, handwriting_note,
        description, project_type, difficulty, platform, language, tech_stack,
        academic_price, commercial_price, original_price, status, is_featured, is_bestseller, is_trending,
        sales_count, rating, review_count, cover_image_url, live_demo_url, published_at
    ) VALUES (
        p4_id, 'project4', homies_creator_id, cat_vlsi_id,
        'Embedded & VLSI Design', 'embedded-vlsi-design',
        'LiDAR mapping, path planning & obstacle avoidance for differential drive robots.',
        'Real-world spatial mapping with millimetre-grade accuracy.',
        '["Autonomous mobile robot navigation stack built on Robot Operating System (ROS 2) with 2D LiDAR SLAM, Cartographer mapping, and Nav2 costmap path planners.", "Includes complete Gazebo simulation environments, URDF models, and hardware wiring schematics."]'::jsonb,
        'Robotics & Embedded Software', 'Advanced', 'ROS 2 / Embedded Hardware', 'C++ / Python / ROS',
        ARRAY['ROS 2', 'C++', 'Python', 'Gazebo', 'Rviz', 'OpenCV', 'LiDAR SLAM'],
        3999.00, 6999.00, 7999.00, 'PUBLISHED', FALSE, FALSE, TRUE,
        94, 4.89, 27, '/project4/project4.webp', 'https://demo-robotics.homiesstudio.com', NOW()
    ) ON CONFLICT (legacy_id) DO UPDATE SET
        title = EXCLUDED.title,
        status = 'PUBLISHED',
        cover_image_url = EXCLUDED.cover_image_url;

    -- Upsert Project 5
    INSERT INTO public.projects (
        id, legacy_id, creator_id, category_id, title, slug, tagline, handwriting_note,
        description, project_type, difficulty, platform, language, tech_stack,
        academic_price, commercial_price, original_price, status, is_featured, is_bestseller, is_trending,
        sales_count, rating, review_count, cover_image_url, live_demo_url, published_at
    ) VALUES (
        p5_id, 'project5', homies_creator_id, cat_auto_id,
        'Automation & Custom Software', 'automation-custom-software',
        'Event-driven architecture with Kafka, Kubernetes orchestration & zero-downtime CI/CD.',
        'Engineered for 99.99% uptime and horizontal cloud elasticity.',
        '["Enterprise-grade cloud microservices backend leveraging Apache Kafka event streaming, Docker containerization, and Kubernetes cluster orchestration.", "Includes distributed tracing with Prometheus & Jaeger, JWT security boundaries, and automated Stripe/Razorpay webhooks."]'::jsonb,
        'Cloud Infrastructure & Backend', 'Industry Grade', 'Kubernetes / AWS / GCP', 'Go / TypeScript',
        ARRAY['Go', 'Kubernetes', 'Apache Kafka', 'Docker', 'PostgreSQL', 'Redis', 'Terraform'],
        3299.00, 5499.00, 6499.00, 'PUBLISHED', FALSE, TRUE, FALSE,
        118, 4.94, 31, '/project5/project5.webp', 'https://demo-saas.homiesstudio.com', NOW()
    ) ON CONFLICT (legacy_id) DO UPDATE SET
        title = EXCLUDED.title,
        status = 'PUBLISHED',
        cover_image_url = EXCLUDED.cover_image_url;

    -- Upsert Project 6
    INSERT INTO public.projects (
        id, legacy_id, creator_id, category_id, title, slug, tagline, handwriting_note,
        description, project_type, difficulty, platform, language, tech_stack,
        academic_price, commercial_price, original_price, status, is_featured, is_bestseller, is_trending,
        sales_count, rating, review_count, cover_image_url, live_demo_url, published_at
    ) VALUES (
        p6_id, 'project6', homies_creator_id, cat_mob_id,
        'Cross-Platform Mobile App Suite', 'cross-platform-mobile-app',
        'STM32-based flight stabilization, PID tuning, GPS tracking & 2.4GHz RF downlink.',
        'Zero latency, sub-microsecond sensor polling for aerial safety.',
        '["Custom-built STM32 ARM Cortex-M4 flight controller and telemetry downlink system featuring hardware timer interrupts, complementary sensor fusion, and real-time ground station visualization."]'::jsonb,
        'Embedded Firmware & Hardware', 'Advanced', 'STM32 / Bare-Metal C', 'C / C++',
        ARRAY['STM32', 'C', 'FreeRTOS', 'I2C/SPI', 'PID Control', 'GPS', 'NRF24L01'],
        2899.00, 4999.00, 5499.00, 'PUBLISHED', FALSE, FALSE, TRUE,
        86, 4.91, 22, '/project1/project1.webp', 'https://demo-drone.homiesstudio.com', NOW()
    ) ON CONFLICT (legacy_id) DO UPDATE SET
        title = EXCLUDED.title,
        status = 'PUBLISHED',
        cover_image_url = EXCLUDED.cover_image_url;

    -- Upsert Project 7
    INSERT INTO public.projects (
        id, legacy_id, creator_id, category_id, title, slug, tagline, handwriting_note,
        description, project_type, difficulty, platform, language, tech_stack,
        academic_price, commercial_price, original_price, status, is_featured, is_bestseller, is_trending,
        sales_count, rating, review_count, cover_image_url, live_demo_url, published_at
    ) VALUES (
        p7_id, 'project7', homies_creator_id, cat_auto_id,
        'Zero-Trust Cybersecurity & Cloud Sentinel', 'cybersecurity-cloud-sentinel',
        'Automated packet analysis, signature intrusion detection & MITRE ATT&CK dashboard.',
        'Defending the perimeter with continuous threat intelligence.',
        '["Proactive cybersecurity defense system combining packet capture analysis, Snort rule parsing, and automated SIEM threat intelligence visualization."]'::jsonb,
        'Cybersecurity & Network Defense', 'Intermediate', 'Linux Server / Web GUI', 'Python / Bash',
        ARRAY['Python', 'Scapy', 'Snort', 'Elasticsearch', 'Kibana', 'FastAPI', 'Docker'],
        2799.00, 4799.00, 5299.00, 'PUBLISHED', TRUE, FALSE, FALSE,
        105, 4.95, 34, '/project2/project2.webp', 'https://demo-security.homiesstudio.com', NOW()
    ) ON CONFLICT (legacy_id) DO UPDATE SET
        title = EXCLUDED.title,
        status = 'PUBLISHED',
        cover_image_url = EXCLUDED.cover_image_url;

END $$;
