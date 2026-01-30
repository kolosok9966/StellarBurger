import { useSelector } from 'react-redux';

import type { TypedUseSelectorHook } from 'react-redux';

import type { AppState } from '@/services/store';

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
