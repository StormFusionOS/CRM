import { Badge } from '@/components/ui/badge';
import type { ReasonCode } from '@/types/scraper';

const LABELS: Record<ReasonCode, string> = {
  ROBOTS_DISALLOWED: 'Robots Disallowed',
  CAPTCHA_DETECTED: 'CAPTCHA Detected',
  RATE_LIMIT_429: 'Rate Limit 429',
  HARD_403: 'Hard 403',
  PARSER_EMPTY: 'Parser Empty',
  SCHEMA_MISSING: 'Schema Missing',
  NEEDS_MANUAL_URL: 'Needs Manual URL'
};

export const ReasonCodeBadge = ({ code }: { code: ReasonCode }) => (
  <Badge variant="secondary">{LABELS[code]}</Badge>
);
