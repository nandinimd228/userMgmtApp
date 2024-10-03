import { setUser } from '../../src/redux/actions'; 
import userReducer from '../../src/redux/reducers';

describe('userReducer', () => {
  const initialState = {
    user: null,
  };

  it('should return the initial state', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle setUser action', () => {
    const user = { accountId: '1234', email: 'test@example.com' };
    const action = setUser(user);
    const expectedState = {
      user: user,
    };

    expect(userReducer(initialState, action)).toEqual(expectedState);
  });
});
