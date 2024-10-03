import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { setUser } from './actions';

interface UserState {
  user: { accountId: string; email: string } | null;
}

const initialState: UserState = {
  user: null,
};

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(setUser, (state, action: PayloadAction<{ accountId: string; email: string }>) => {
    state.user = action.payload;
  });
});

export default userReducer;