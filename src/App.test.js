import { render, screen } from '@testing-library/react';
import App from './App';

test('renders CS3345 heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/CS3345/i);
  expect(headingElement).toBeInTheDocument();
});
