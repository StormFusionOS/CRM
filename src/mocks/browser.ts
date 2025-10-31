import { setupWorker } from 'msw';
import { scraperHandlers } from '@/mocks/scraperHandlers';

export const worker = setupWorker(...scraperHandlers);
