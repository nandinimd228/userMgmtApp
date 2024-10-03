import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InputField from '../../src/components/InputField';

describe('InputField Component', () => {
  const mockOnChangeText = jest.fn();
  const mockOnBlur = jest.fn();

  it('renders correctly with a placeholder', () => {
    const { getByPlaceholderText } = render(
      <InputField
        placeholder="Enter your name"
        value=""
        onChangeText={mockOnChangeText}
        onBlur={mockOnBlur}
      />
    );
    const input = getByPlaceholderText('Enter your name');
    expect(input).toBeTruthy();
  });

  it('displays the correct value', () => {
    const { getByDisplayValue } = render(
      <InputField
        placeholder="Enter your name"
        value="John Doe"
        onChangeText={mockOnChangeText}
        onBlur={mockOnBlur}
      />
    );
    const input = getByDisplayValue('John Doe');
    expect(input).toBeTruthy();
  });

  it('calls onChangeText when the text changes', () => {
    const { getByPlaceholderText } = render(
      <InputField
        placeholder="Enter your name"
        value=""
        onChangeText={mockOnChangeText}
        onBlur={mockOnBlur}
      />
    );
    const input = getByPlaceholderText('Enter your name');
    
    fireEvent.changeText(input, 'John Doe');
    expect(mockOnChangeText).toHaveBeenCalledWith('John Doe');
  });

  it('calls onBlur when the input is blurred', () => {
    const { getByPlaceholderText } = render(
      <InputField
        placeholder="Enter your name"
        value=""
        onChangeText={mockOnChangeText}
        onBlur={mockOnBlur}
      />
    );
    const input = getByPlaceholderText('Enter your name');
  
    fireEvent(input, 'blur');
    expect(mockOnBlur).toHaveBeenCalled();
  });
  

  it('displays an error message when provided', () => {
    const { getByText } = render(
      <InputField
        placeholder="Enter your name"
        value=""
        onChangeText={mockOnChangeText}
        onBlur={mockOnBlur}
        errorMessage="Name is required"
      />
    );
    const errorMessage = getByText('Name is required');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.props.style.color).toBe('red');
  });

  it('does not display an error message when not provided', () => {
    const { queryByText } = render(
      <InputField
        placeholder="Enter your name"
        value=""
        onChangeText={mockOnChangeText}
        onBlur={mockOnBlur}
      />
    );
    const errorMessage = queryByText('Name is required');
    expect(errorMessage).toBeNull();
  });

  it('applies secureTextEntry when passed as true', () => {
    const { getByPlaceholderText } = render(
      <InputField
        placeholder="Enter your password"
        value=""
        onChangeText={mockOnChangeText}
        onBlur={mockOnBlur}
        secureTextEntry={true}
      />
    );
    const input = getByPlaceholderText('Enter your password');
    expect(input.props.secureTextEntry).toBe(true);
  });
});
