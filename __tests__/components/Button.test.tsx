import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import Button from '../../src/components/Button';
import {StyleSheet} from 'react-native';

describe('Button Component', () => {
  const mockOnPress = jest.fn();

  it('renders correctly with the given title', () => {
    const {getByText} = render(<Button title="Submit" onPress={mockOnPress} />);
    const buttonText = getByText('Submit');
    expect(buttonText).toBeTruthy();
  });

  it('calls the onPress function when pressed', () => {
    const {getByRole} = render(<Button title="Submit" onPress={mockOnPress} />);
    const button = getByRole('button');
    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('has the correct styles applied', () => {
    const {getByRole} = render(<Button title="Submit" onPress={mockOnPress} />);
    const button = getByRole('button');

    const buttonStyle = StyleSheet.flatten(button.props.style);
    expect(buttonStyle.backgroundColor).toBe('#D83B34');
    expect(buttonStyle.borderRadius).toBe(5);
  });

  it('has the correct accessibility attributes', () => {
    const {getByRole} = render(<Button title="Submit" onPress={mockOnPress} />);
    const button = getByRole('button');
    expect(button.props.accessibilityRole).toBe('button');
    expect(button.props.accessible).toBe(true);
  });
});
