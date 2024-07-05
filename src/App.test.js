import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the App component and Toaster', () => {
  render(<App />);
  
  const toasterElement = screen.getByTestId('toaster');
  expect(toasterElement).toBeInTheDocument();
});
