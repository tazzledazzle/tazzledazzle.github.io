import Footer from '../app/components/Footer';
import { render, screen } from '@testing-library/react';

describe('Footer component', () => {
  test('displays current year', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText((content) => content.includes(year))).toBeInTheDocument();
  });
});
