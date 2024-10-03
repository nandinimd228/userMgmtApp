import reducer, { login, logout } from '../../src/redux/authslice';

describe('authSlice', () => {
  const initialState = {
    user: null,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle login action', () => {
    const user = { accountId: '1234', email: 'test@example.com' };
    const action = login(user);
    const expectedState = {
      user: user,
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle logout action', () => {
    const loggedInState = {
      user: { accountId: '1234', email: 'test@example.com' },
    };
    const action = logout();
    const expectedState = {
      user: null,
    };

    expect(reducer(loggedInState, action)).toEqual(expectedState);
  });
});
