import CookiesManager from '../../src/lib/cookiesManager';
import Cookies from 'js-cookie';

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

describe('CookiesManager', () => {
  let cookiesManager: CookiesManager;

  beforeEach(() => {
    cookiesManager = CookiesManager.getInstance();
    jest.clearAllMocks();
  });

  it('should get a cookie by its ID', () => {
    (Cookies.get as jest.Mock).mockReturnValue('test_value');
    const value = cookiesManager.get('test_id');
    expect(value).toBe('test_value');
    expect(Cookies.get).toHaveBeenCalledWith('test_id');
  });

  it('should get a cookie by its ID with a default value', () => {
    (Cookies.get as jest.Mock).mockReturnValue(undefined);
    const value = cookiesManager.get('test_id', 'default_value');
    expect(value).toBe('default_value');
    expect(Cookies.set).toHaveBeenCalledWith('test_id', 'default_value');
  });

  it('should set a cookie by its ID', () => {
    cookiesManager.set('test_id', 'test_value');
    expect(Cookies.set).toHaveBeenCalledWith('test_id', 'test_value');
  });

  it('should handle JSON values', () => {
    const testObject = { key: 'value' };
    (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify(testObject));
    const value = cookiesManager.get('test_id');
    expect(value).toEqual(testObject);
  });

  it('should handle JSON values when setting', () => {
    const testObject = { key: 'value' };
    cookiesManager.set('test_id', testObject);
    expect(Cookies.set).toHaveBeenCalledWith('test_id', JSON.stringify(testObject));
  });
});
