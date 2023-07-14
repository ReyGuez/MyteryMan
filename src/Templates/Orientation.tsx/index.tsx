// useOrientation.tsx
import {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';

/**
 * Returns true if the screen is in portrait mode
 */
const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

/**
 * A React Hook which updates when the orientation changes
 * @returns whether the user is in 'portrait' or 'landscape'
 */
export function useOrientation(): 'portrait' | 'landscape' {
  // State to hold the connection status
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    isPortrait() ? 'portrait' : 'landscape',
  );

  useEffect(() => {
    const callback = () =>
      setOrientation(isPortrait() ? 'portrait' : 'landscape');

    const algo = Dimensions.addEventListener('change', callback);

    return () => {
      algo.remove();
    };
  }, []);

  return orientation;
}
