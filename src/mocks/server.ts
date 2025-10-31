import { setupServer } from 'msw/node';
import { scraperHandlers } from '@/mocks/scraperHandlers';

export const server = setupServer(...scraperHandlers);
