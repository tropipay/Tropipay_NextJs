import { jest } from '@jest/globals';

const useSession = jest.fn(() => ({
  data: {
    user: {
      token: 'test-token',
      id: 'test-id',
    },
  },
}));

export { useSession };
