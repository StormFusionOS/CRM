import { render } from '@testing-library/react';
import { JobStatusBadge } from '@/components/scraper/JobStatusBadge';

describe('JobStatusBadge', () => {
  it('renders running badge', () => {
    const { getByText } = render(<JobStatusBadge status="running" />);
    expect(getByText('Running')).toBeInTheDocument();
  });

  it('renders pending badge', () => {
    const { getByText } = render(<JobStatusBadge status="pending" />);
    expect(getByText('Pending')).toBeInTheDocument();
  });

  it('renders completed badge', () => {
    const { getByText } = render(<JobStatusBadge status="completed" />);
    expect(getByText('Completed')).toBeInTheDocument();
  });

  it('renders failed badge', () => {
    const { getByText } = render(<JobStatusBadge status="failed" />);
    expect(getByText('Failed')).toBeInTheDocument();
  });
});
