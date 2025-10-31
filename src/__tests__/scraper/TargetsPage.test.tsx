import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScraperTargets } from '@/pages/scraper/ScraperTargets';
import { renderWithProviders } from '@/__tests__/test-utils';

describe('ScraperTargets', () => {
  it('renders targets and filters by search', async () => {
    renderWithProviders(<ScraperTargets />, '/scraper/targets');

    await screen.findByText('rivercityclean.com');

    const searchInput = screen.getByPlaceholderText('Search domains');
    await userEvent.type(searchInput, 'competitor');

    await waitFor(() => {
      expect(screen.getByText('competitor.example')).toBeInTheDocument();
      expect(screen.queryByText('rivercityclean.com')).not.toBeInTheDocument();
    });
  });

  it('validates add target form', async () => {
    renderWithProviders(<ScraperTargets />, '/scraper/targets');

    const addButton = await screen.findByRole('button', { name: /add target/i });
    await userEvent.click(addButton);

    const saveButton = await screen.findByRole('button', { name: /^save$/i });
    await userEvent.click(saveButton);

    expect(await screen.findByText('Domain is required')).toBeInTheDocument();
  });
});
