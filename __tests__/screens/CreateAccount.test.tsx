import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react-native';
import CreateAccountScreen from '../../src/screens/CreateAccountScreen';
import api from '../../src/utils/api';

jest.mock('../../src/utils/api');

const mockedNavigation = {
  navigate: jest.fn(),
};

describe('CreateAccountScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const {getByRole, getByText} = render(
      <CreateAccountScreen navigation={mockedNavigation} />,
    );
    expect(getByRole('button', {name: 'Create Account'})).toBeTruthy();
    expect(getByText('Already a User?')).toBeTruthy();
  });

  it('submits the form successfully', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({});

    const {getByPlaceholderText, getByRole} = render(
      <CreateAccountScreen navigation={mockedNavigation} />,
    );

    fireEvent.changeText(getByPlaceholderText('Name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

    await act(async () => {
      fireEvent.press(getByRole('button', {name: 'Create Account'}));
    });
  });

  it('shows validation error messages', async () => {
    const {getByPlaceholderText, getByRole, getByText} = render(
      <CreateAccountScreen navigation={mockedNavigation} />,
    );

    await act(async () => {
      fireEvent.press(getByRole('button', {name: 'Create Account'}));
    });

    await waitFor(() => {
      expect(getByText('Name is required')).toBeTruthy();
      expect(getByText('Email is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText('Name'), 'John Doe');
    await act(async () => {
      fireEvent.press(getByRole('button', {name: 'Create Account'}));
    });

    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText('Password'), 'pass');

    await act(async () => {
      fireEvent.press(getByRole('button', {name: 'Create Account'}));
    });

    await waitFor(() => {
      expect(getByText('Invalid email format')).toBeTruthy();
      expect(getByText('Password must be at least 8 characters')).toBeTruthy();
    });
  });
});
