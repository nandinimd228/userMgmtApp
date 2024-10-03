import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import SuccessScreen from '../../src/screens/SuccessScreen';

describe('SuccessScreen', () => {
  const mockNavigate = jest.fn();

  const renderComponent = () => {
    return render(
      <NavigationContainer>
        <SuccessScreen navigation={{ navigate: mockNavigate }} />
      </NavigationContainer>
    );
  };

  it('renders correctly', () => {
    const { getByText } = renderComponent();
    expect(getByText('Account Created Successfully!')).toBeTruthy();
  });

  it('displays the correct title', () => {
    const { getByText } = renderComponent();
    const title = getByText('Account Created Successfully!');
    expect(title).toBeTruthy();
  });

  it('navigates to Login screen when button is pressed', () => {
    const { getByText } = renderComponent();
    fireEvent.press(getByText('Go to Login'));
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });
});
