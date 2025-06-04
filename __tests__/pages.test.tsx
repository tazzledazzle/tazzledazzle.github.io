import Home from '../app/page';
import ContactPage from '../app/contact/page';
import { render, screen } from '@testing-library/react';

describe('static pages', () => {
  test('home renders headings', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /Terence Schumacher/ })).toBeInTheDocument();
  });

  test('contact page renders email', async () => {
    const element = await ContactPage();
    render(element);
    expect(screen.getByRole('heading', { name: 'Contact Me' })).toBeInTheDocument();
    expect(screen.getByText(/terenceschumacher@gmail.com/)).toBeInTheDocument();
  });
});
