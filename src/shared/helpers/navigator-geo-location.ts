import type { Coordinates } from '@/shared/types';

export const navigatorGeoLocation = async (): Promise<Coordinates | undefined> => {
  try {
    return await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          resolve([coords.latitude, coords.longitude]);
        },
        (err) => {
          reject(err);
        }
      )
    );
  } catch (err) {
    console.log(err);
  }
};
