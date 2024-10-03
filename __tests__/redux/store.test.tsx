import store, { RootState } from '../../src/redux/store';
import { setUser } from '../../src/redux/actions';

describe('Redux Store', () => {
  it('should have the correct initial state', () => {
    const state: RootState = store.getState();
    expect(state.user).toEqual({ user: null });
  });

  it('should update the state when setUser action is dispatched', () => {
    const user = { accountId: '1234', email: 'test@example.com' };
    store.dispatch(setUser(user));

    const state: RootState = store.getState();
    expect(state.user).toEqual({ user });
  });
});
