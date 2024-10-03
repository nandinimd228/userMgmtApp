import React from 'react';
import {
  render,
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import DashboardScreen from '../../src/screens/DashboardScreen';
import api from '../../src/utils/api';

const mockStore = configureStore([]);

jest.mock('../../src/utils/api');

describe('DashboardScreen', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      user: {user: {accountId: 1}},
    });
  });

  test('renders DashboardScreen correctly', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {id: 1, name: 'User One', email: 'user1@example.com'},
        {id: 2, name: 'User Two', email: 'user2@example.com'},
      ],
    });

    render(
      <Provider store={store}>
        <DashboardScreen navigation={{navigate: jest.fn()}} />
      </Provider>,
    );

    expect(screen.getByTestId('header').children[0]).toEqual('Dashboard');

    await waitFor(() => {
      expect(screen.getByText('User One')).toBeTruthy();
      expect(screen.getByText('User Two')).toBeTruthy();
    });
  });

  test('handles edit account', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [{id: 1, name: 'User One', email: 'user1@example.com'}],
    });

    render(
      <Provider store={store}>
        <DashboardScreen navigation={{navigate: jest.fn()}} />
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText('User One')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Edit'));

    fireEvent.changeText(screen.getByPlaceholderText('Name'), 'Updated User');
    fireEvent.changeText(
      screen.getByPlaceholderText('Email'),
      'updated@example.com',
    );

    (api.put as jest.Mock).mockResolvedValueOnce({});
    fireEvent.press(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Updated User')).toBeTruthy();
      expect(screen.getByText('updated@example.com')).toBeTruthy();
    });
  });

  test('handles delete account', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [{id: 1, name: 'User One', email: 'user1@example.com'}],
    });

    render(
      <Provider store={store}>
        <DashboardScreen navigation={{navigate: jest.fn()}} />
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText('User One')).toBeTruthy();
    });

    (api.delete as jest.Mock).mockResolvedValueOnce({});
    fireEvent.press(screen.getByText('Delete'));

    await waitFor(() => {
      expect(screen.queryByText('User One')).toBeNull();
    });
  });

  test('handles password edit', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [{id: 1, name: 'User One', email: 'user1@example.com'}],
    });

    render(
      <Provider store={store}>
        <DashboardScreen navigation={{navigate: jest.fn()}} />
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText('User One')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Edit Password'));
    fireEvent.changeText(
      screen.getByPlaceholderText('New Password'),
      'newPassword123',
    );

    (api.patch as jest.Mock).mockResolvedValueOnce({});
    fireEvent.press(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeTruthy();
    });
  });

  test('shows error message on fetch failure', async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error('Fetch error'));

    render(
      <Provider store={store}>
        <DashboardScreen navigation={{navigate: jest.fn()}} />
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch user accounts')).toBeTruthy();
    });
  });
});
