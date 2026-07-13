const express = require('express');
const notificationsRouter = require('./notifications.router');
const { notifyNewOrder } = require('./notifications.router');

jest.mock('../../config/db', () => ({ query: jest.fn() }));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));
const jwt = require('jsonwebtoken');

const app = express();
app.use('/api/notifications', notificationsRouter);

let server;
let port;

beforeAll((done) => {
  server = app.listen(0, () => {
    port = server.address().port;
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

describe('Notifications Tests using fetch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no token', async () => {
    const res = await fetch(`http://localhost:${port}/api/notifications/stream`);
    expect(res.status).toBe(401);
  });

  it('should return 401 if invalid token', async () => {
    jwt.verify.mockImplementation(() => { throw new Error(); });
    const res = await fetch(`http://localhost:${port}/api/notifications/stream?token=invalid`);
    expect(res.status).toBe(401);
  });

  it('should return 403 if customer', async () => {
    jwt.verify.mockReturnValue({ role: 'customer' });
    const res = await fetch(`http://localhost:${port}/api/notifications/stream?token=valid`);
    expect(res.status).toBe(403);
  });

  it('should connect SSE and notify new order', async () => {
    jwt.verify.mockReturnValue({ role: 'admin', id: 1 });
    const ac = new AbortController();

    // Connect to stream
    const res = await fetch(`http://localhost:${port}/api/notifications/stream?token=valid&restaurant_id=5`, {
      signal: ac.signal,
    });

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/event-stream');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    // Read the connected event
    const { value } = await reader.read();
    const str = decoder.decode(value);
    expect(str).toContain('event: connected');

    // Trigger notification
    notifyNewOrder(5, { id: 123, total_amount: 50000 });

    // Read the new order event
    const { value: value2 } = await reader.read();
    const str2 = decoder.decode(value2);
    expect(str2).toContain('event: new_order');
    expect(str2).toContain('123');

    // Cleanly abort the fetch
    ac.abort();
    try {
      await reader.read(); // will throw AbortError
    } catch(e) {
      // Expected exception on abort
    }
  });

  it('should not throw if no clients', () => {
    expect(() => notifyNewOrder(999, { id: 1 })).not.toThrow();
  });
});
