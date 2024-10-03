import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import LoginScreen from '../../src/screens/LoginScreen';
import api from '../../src/utils/api';
import rootReducer from '../../src/redux/reducers';
import {Alert} from 'react-native';

jest.mock('../../src/utils/api');

const mockStore = createStore(rootReducer);

describe('LoginScreen', () => {
  const navigation = {navigate: jest.fn()};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders LoginScreen correctly', () => {
    const {getByPlaceholderText, getByText, getByRole} = render(
      <Provider store={mockStore}>
        <LoginScreen navigation={navigation} />
      </Provider>,
    );

    expect(getByRole('button', {name: /login/i})).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText(/new user\?/i)).toBeTruthy();
  });

  test('login with valid credentials', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: {accountId: 1, email: 'user@example.com'},
    });

    const {getByPlaceholderText, getByRole} = render(
      <Provider store={mockStore}>
        <LoginScreen navigation={navigation} />
      </Provider>,
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByRole('button', {name: /login/i}));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('login', {
        email: 'user@example.com',
        password: 'password123',
      });
      expect(mockStore.getState().user?.email).toBe('user@example.com');
      expect(navigation.navigate).toHaveBeenCalledWith('Dashboard');
    });
  });

  test('handles login error with invalid credentials', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('Login failed'));
    jest.spyOn(Alert, "alert").mockImplementation(jest.fn());

    const {getByPlaceholderText, getByRole, getByText} = render(
      <Provider store={mockStore}>
        <LoginScreen navigation={navigation} />
      </Provider>,
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');
    fireEvent.press(getByRole('button', {name: /login/i}));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('login', {
        email: 'user@example.com',
        password: 'wrongpassword',
      });
      expect(navigation.navigate).not.toHaveBeenCalled();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Login Error',
      'Invalid email or password. Please try again.',
    );
  });

  test('navigates to Create Account screen', () => {
    const {getByText} = render(
      <Provider store={mockStore}>
        <LoginScreen navigation={navigation} />
      </Provider>,
    );

    fireEvent.press(getByText(/create account/i));

    expect(navigation.navigate).toHaveBeenCalledWith('CreateAccount');
  });
});
