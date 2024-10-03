import MockAdapter from 'axios-mock-adapter';
import api from '../../src/utils/api';

describe('API Tests', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(api);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('should log request URL on request interceptor', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    mock.onGet('/test').reply(200, {data: 'test'});

    await api.get('/test');

    expect(consoleLogSpy).toHaveBeenCalledWith('Request URL:', '/test');
    consoleLogSpy.mockRestore();
  });

  it('should send a GET request to the correct URL', async () => {
    mock.onGet('/test').reply(200, {data: 'test'});

    const response = await api.get('/test');
    expect(response.data).toEqual({data: 'test'});
  });

  it('should handle a POST request', async () => {
    mock.onPost('/test').reply(201, {message: 'created'});

    const response = await api.post('/test', {name: 'test'});
    expect(response.data).toEqual({message: 'created'});
  });

  it('should handle request errors', async () => {
    mock.onGet('/error').reply(500);

    await expect(api.get('/error')).rejects.toThrow(
      'Request failed with status code 500',
    );
  });
});
