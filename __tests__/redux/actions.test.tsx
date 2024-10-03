import { setUser } from '../../src/redux/actions';

describe('Auth Actions', () => {
  it('should create an action to set user', () => {
    const expectedAction = {
      type: 'SET_USER',
      payload: {
        accountId: '1234',
        email: 'test@example.com',
      },
    };

    expect(setUser({ accountId: '1234', email: 'test@example.com' })).toEqual(expectedAction);
  });
});
