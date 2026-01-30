import { useLocation } from 'react-router-dom';

import type { Location } from 'react-router-dom';

type LocationState = {
  from?: Location;
  background?: Location;
  fromForgot?: boolean;
};

export const useAppLocation = (): Location<LocationState> =>
  useLocation() as Location<LocationState>;
