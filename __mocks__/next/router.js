import { jest } from '@jest/globals';

const useRouter = jest.fn(() => ({
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isReady: true,
}));

const useSearchParams = jest.fn(() => ({
  get: jest.fn(),
}));

const usePathname = jest.fn(() => '/');

export { useRouter, useSearchParams, usePathname };
