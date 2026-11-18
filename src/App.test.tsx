import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the alignment form with disabled submit for empty sequences', () => {
  render(<App />);
  expect(screen.getByText('Amino Aligner')).toBeInTheDocument();
  expect(screen.getAllByRole('textbox')).toHaveLength(2);
  expect(screen.getByRole('button')).toBeDisabled();
});
