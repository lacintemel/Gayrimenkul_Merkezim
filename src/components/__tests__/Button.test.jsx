import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

test('Button tıklanınca çalışır', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Tıkla</Button>);
  fireEvent.click(screen.getByText(/Tıkla/i));
  expect(handleClick).toHaveBeenCalled();
});
