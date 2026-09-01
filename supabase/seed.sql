-- ==============================================================================
-- SEED.SQL — DEVELOPMENT & TEST DATA
-- Realistic marketplace seed records for local testing and demonstration
-- ==============================================================================

-- 1. Create Demo Admin and Creator Profiles (Mock User UUIDs)
DO $$
DECLARE
    creator_user_id UUID := '11111111-1111-1111-1111-111111111111';
    creator_prof_id UUID := '22222222-2222-2222-2222-222222222222';
    buyer_user_id UUID := '33333333-3333-3333-3333-333333333333';
    cat_ai_id UUID;
    cat_web_id UUID;
    cat_iot_id UUID;
    cat_vlsi_id UUID;
    cat_auto_id UUID;
    
    proj1_id UUID := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    proj2_id UUID := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
    proj3_id UUID := 'cccccccc-cccc-cccc-cccc-cccccccccccc';
    proj4_id UUID := 'dddddddd-dddd-dddd-dddd-dddddddddddd';
    proj5_id UUID := 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
BEGIN
    -- Fetch category IDs
    SELECT id INTO cat_ai_id FROM public.categories WHERE slug = 'ai-ml';
    SELECT id INTO cat_web_id FROM public.categories WHERE slug = 'web-dev';
    SELECT id INTO cat_iot_id FROM public.categories WHERE slug = 'iot-robotics';
    SELECT id INTO cat_vlsi_id FROM public.categories WHERE slug = 'embedded-vlsi';
    SELECT id INTO cat_auto_id FROM public.categories WHERE slug = 'automation-saas';

    -- Insert Creator Profile
    INSERT INTO public.creator_profiles (
        id, user_id, display_name, handle, bio, avatar_url, role_title, upi_id,
        rating, review_count, sales_count, total_earnings, available_balance, pending_balance, is_approved
    ) VALUES (
        creator_prof_id, creator_user_id, 'Karthik Raja & Team', '@karthik_builds',
        'Senior AI Systems & Embedded Hardware Architect with 50+ published builds.',
        '/homies/header-logo.png', 'Verified Lead Architect', 'karthik@okhdfcbank',
        4.96, 128, 142, 186400.00, 48500.00, 12000.00, TRUE
    ) ON CONFLICT (handle) DO NOTHING;

    -- Insert Projects
    INSERT INTO public.projects (
        id, creator_id, category_id, title, slug, tagline, handwriting_note,
        description, project_type, difficulty, platform, language, tech_stack,
        academic_price, commercial_price, original_price, status, is_featured, is_bestseller, is_trending,
        sales_count, rating, review_count, cover_image_url
    ) VALUES 
    (
        proj1_id, creator_prof_id, cat_ai_id,
        'Autonomous Edge-AI Drone Vision & Obstacle Navigation System',
        'autonomous-edge-ai-drone-vision',
        'Real-time deep learning computer vision model deployed on edge hardware with sub-15ms collision avoidance.',
        'Production grade drone telemetry & vision system with complete IEEE paper.',
        '["Autonomous Edge-AI Drone Vision is an end-to-end aerial intelligence framework engineered for real-time obstacle avoidance, target tracking, and autonomous route re-planning.", "Trained on over 140,000 aerial frames, the onboard TinyYOLOv8 vision pipeline achieves 68 FPS on NVIDIA Jetson Nano with sub-15ms inference latency."]'::jsonb,
        'AI/ML Model & Embedded Edge Pipeline', 'Advanced', 'NVIDIA Jetson Nano, Raspberry Pi 4, Linux ROS2',
        'Python 3.10 / C++ 17', ARRAY['Python', 'PyTorch', 'YOLOv8', 'OpenCV', 'ROS2', 'CUDA', 'Docker'],
        3499.00, 5998.00, 6999.00, 'PUBLISHED', TRUE, TRUE, TRUE, 142, 4.96, 38, '/project1/project1.webp'
    ),
    (
        proj2_id, creator_prof_id, cat_web_id,
        'Decentralized Cloud Storage & Zero-Knowledge Verification Suite',
        'decentralized-cloud-storage-zk',
        'End-to-end encrypted distributed object storage system with client-side zero-knowledge proof audit logs.',
        'Zero-trust cloud architecture with complete frontend, backend, and smart contracts.',
        '["A high-throughput decentralized cloud storage engine engineered for tamper-proof data verification.", "Features client-side AES-256-GCM chunking, IPFS pinned clusters, and zk-SNARK cryptographic integrity audits."]'::jsonb,
        'Full-Stack Web3 & Cloud Platform', 'Advanced', 'Web Browser, Node.js Server, IPFS Cluster',
        'TypeScript / Rust', ARRAY['Next.js', 'TypeScript', 'Node.js', 'IPFS', 'Rust', 'PostgreSQL', 'Tailwind CSS'],
        2999.00, 4998.00, 5499.00, 'PUBLISHED', TRUE, FALSE, TRUE, 89, 4.92, 24, '/project2/project2.webp'
    ),
    (
        proj3_id, creator_prof_id, cat_iot_id,
        'Industrial Smart Grid Energy Forecaster & IoT Fault Detector',
        'industrial-smart-grid-energy-forecaster',
        'Real-time energy telemetry stream ingestion with LSTM time-series load forecasting and anomaly detection.',
        'Hardware sensor telemetry + time-series predictive modeling.',
        '["Engineered for smart industrial factories to monitor polyphase electrical feeds and forecast load spikes.", "Includes ESP32 power-metering firmware, MQTT broker ingestion, and LSTM forecasting microservice."]'::jsonb,
        'IoT Hardware & Predictive Analytics', 'Intermediate', 'ESP32 Microcontroller, Linux Server, Grafana',
        'C++ (Arduino) / Python 3.10', ARRAY['ESP32', 'C++', 'Python', 'TensorFlow', 'MQTT', 'InfluxDB', 'Grafana'],
        2499.00, 4498.00, 4999.00, 'PUBLISHED', FALSE, TRUE, FALSE, 116, 4.88, 31, '/project3/project3.webp'
    ),
    (
        proj4_id, creator_prof_id, cat_vlsi_id,
        'High-Performance RISC-V 5-Stage Pipelined Processor Core',
        'risc-v-5-stage-pipelined-core',
        'Synthesizable RV32I ISA 32-bit core with full hazard detection, forwarding unit, and branch prediction.',
        'Complete Verilog RTL codebase with ModelSim testbenches and FPGA bitstreams.',
        '["A fully synthesizable RV32I RISC-V core designed for educational instruction and FPGA deployment.", "Features Harvard architecture cache memory, 5-stage pipeline, dynamic branch prediction, and exhaustive verification suites."]'::jsonb,
        'VLSI / Digital Hardware RTL Design', 'Industry Grade', 'Xilinx Vivado, ModelSim, FPGA Artix-7',
        'Verilog HDL / SystemVerilog', ARRAY['Verilog', 'SystemVerilog', 'RISC-V ISA', 'Vivado', 'ModelSim', 'FPGA'],
        3999.00, 6998.00, 7999.00, 'PUBLISHED', TRUE, FALSE, FALSE, 64, 4.98, 19, '/project4/project4.webp'
    ),
    (
        proj5_id, creator_prof_id, cat_auto_id,
        'Multi-Agent LLM Research Workflow & Automated Thesis Engine',
        'multi-agent-llm-research-workflow',
        'Autonomous agent swarm that ingests arXiv papers, synthesizes comparative matrices, and formats IEEE LaTeX reports.',
        'State of the art autonomous generative AI framework for deep academic exploration.',
        '["A collaborative multi-agent architecture built on LangChain and LangGraph.", "Coordinates specialized agents (Searcher, Reviewer, Synthesizer, LaTeX Formatter) to produce comprehensive technical reports."]'::jsonb,
        'Generative AI & Autonomous Agent System', 'Intermediate', 'Python 3.11+, Docker, Cloud API',
        'Python 3.11', ARRAY['Python', 'LangChain', 'LangGraph', 'OpenAI API', 'FastAPI', 'LaTeX', 'Docker'],
        2799.00, 4798.00, 5299.00, 'PUBLISHED', FALSE, FALSE, TRUE, 78, 4.90, 22, '/project5/project5.webp'
    ) ON CONFLICT (slug) DO NOTHING;

    -- Insert Private Project Files Metadata
    INSERT INTO public.project_files (project_id, file_type, file_name, storage_path, file_size_bytes, mime_type) VALUES
    (proj1_id, 'SOURCE_CODE_ZIP', 'drone_edge_ai_vision_v2.1.zip', 'project-files/proj1/drone_edge_ai_vision_v2.1.zip', 48200000, 'application/zip'),
    (proj1_id, 'THESIS_REPORT_PDF', 'IEEE_Drone_Vision_Navigation_Thesis.pdf', 'project-files/proj1/IEEE_Drone_Vision_Navigation_Thesis.pdf', 5800000, 'application/pdf'),
    (proj1_id, 'PRESENTATION_PPTX', 'Drone_Vision_Defense_Slides.pptx', 'project-files/proj1/Drone_Vision_Defense_Slides.pptx', 12400000, 'application/vnd.openxmlformats-officedocument.presentationml.presentation'),
    (proj2_id, 'SOURCE_CODE_ZIP', 'zk_storage_web3_production.zip', 'project-files/proj2/zk_storage_web3_production.zip', 36500000, 'application/zip'),
    (proj2_id, 'THESIS_REPORT_PDF', 'Decentralized_Storage_Zk_Report.pdf', 'project-files/proj2/Decentralized_Storage_Zk_Report.pdf', 4200000, 'application/pdf')
    ON CONFLICT DO NOTHING;

END $$;
