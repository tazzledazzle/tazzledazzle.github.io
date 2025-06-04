import Navigation from '../app/components/Navigation';
import { render, screen, fireEvent } from '@testing-library/react';

describe('Navigation component', () => {
  test('toggles mobile menu', () => {
    const { getByRole, getByTestId } = render(<Navigation />);
    const button = getByRole('button');
    const menu = getByTestId('mobile-menu');
    expect(menu.classList.contains('hidden')).toBe(true);
    fireEvent.click(button);
    expect(menu.classList.contains('block')).toBe(true);
  });
});
