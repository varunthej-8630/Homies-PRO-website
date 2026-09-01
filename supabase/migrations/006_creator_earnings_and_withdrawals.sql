-- ==============================================================================
-- 006_CREATOR_EARNINGS_AND_WITHDRAWALS.SQL
-- 80/20 Royalties accounting ledger and payout withdrawal management
-- ==============================================================================

CREATE TYPE earning_status_type AS ENUM (
    'PENDING',
    'AVAILABLE',
    'WITHDRAWN',
    'REFUNDED'
);

CREATE TYPE withdrawal_status_type AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'CANCELLED'
);

CREATE TYPE payout_method_type AS ENUM (
    'UPI',
    'BANK_TRANSFER'
);

-- Creator Royalties Accounting Ledger
CREATE TABLE IF NOT EXISTS public.creator_earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE RESTRICT NOT NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE RESTRICT NOT NULL,
    order_item_id UUID REFERENCES public.order_items(id) ON DELETE RESTRICT NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE RESTRICT NOT NULL,
    
    gross_amount NUMERIC(10, 2) NOT NULL,
    platform_fee_percent NUMERIC(5, 2) DEFAULT 20.00 NOT NULL,
    platform_fee_amount NUMERIC(10, 2) NOT NULL,
    net_creator_amount NUMERIC(10, 2) NOT NULL,
    
    status earning_status_type DEFAULT 'AVAILABLE' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Withdrawals / Payout Requests
CREATE TABLE IF NOT EXISTS public.withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE RESTRICT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    method payout_method_type DEFAULT 'UPI' NOT NULL,
    payout_details JSONB NOT NULL, -- e.g. {"upi_id": "creator@okhdfc"} or {"account": "...", "ifsc": "..."}
    status withdrawal_status_type DEFAULT 'PENDING' NOT NULL,
    transaction_reference TEXT,
    admin_notes TEXT,
    requested_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    processed_at TIMESTAMPTZ
);

-- Function & Trigger: Automatic Balance Update on Earning Insertion
CREATE OR REPLACE FUNCTION public.process_creator_earning()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.creator_profiles
    SET 
        total_earnings = total_earnings + NEW.net_creator_amount,
        available_balance = available_balance + NEW.net_creator_amount,
        sales_count = sales_count + 1,
        updated_at = NOW()
    WHERE id = NEW.creator_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_creator_earning_created ON public.creator_earnings;
CREATE TRIGGER on_creator_earning_created
    AFTER INSERT ON public.creator_earnings
    FOR EACH ROW EXECUTE FUNCTION public.process_creator_earning();

CREATE INDEX IF NOT EXISTS idx_creator_earnings_creator_id ON public.creator_earnings(creator_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_creator_id ON public.withdrawals(creator_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON public.withdrawals(status);
