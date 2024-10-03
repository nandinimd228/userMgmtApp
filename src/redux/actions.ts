import { createAction } from '@reduxjs/toolkit';

export const setUser = createAction<{ accountId: string; email: string }>('SET_USER');