import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../Home';

test('Ana sayfa başlığı görünüyor', () => {
  render(<Home />);
  expect(screen.getByText(/Hoşgeldiniz!/i)).toBeInTheDocument();
});
