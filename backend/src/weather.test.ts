import { afterEach, describe, expect, it, vi } from 'vitest';
import { SingaporeWeatherClient } from './weather.js';

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), { status: 200 });
}

function readingPayload(stationId: string, value: number) {
  return {
    code: 0,
    errorMsg: '',
    data: {
      stations: [{ id: stationId, name: 'Test Station', location: { latitude: 1.3, longitude: 103.8 } }],
      readings: [{ timestamp: '2026-08-10T12:00:00+08:00', data: [{ stationId, value }] }],
      readingType: 'test',
      readingUnit: 'test',
    },
  };
}

describe('SingaporeWeatherClient.getCurrentWeather', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('aggregates readings from every data.gov.sg endpoint into one snapshot', async () => {
    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = String(input);
      if (url.includes('two-hr-forecast')) {
        return jsonResponse({
          code: 0,
          errorMsg: '',
          data: {
            area_metadata: [{ name: 'Bishan', label_location: { latitude: 1.3, longitude: 103.8 } }],
            items: [
              {
                update_timestamp: '2026-08-10T12:00:00+08:00',
                valid_period: { text: '12 pm to 2 pm' },
                forecasts: [{ area: 'Bishan', forecast: 'Cloudy' }],
              },
            ],
          },
        });
      }
      if (url.includes('air-temperature')) return jsonResponse(readingPayload('S1', 29.5));
      if (url.includes('relative-humidity')) return jsonResponse(readingPayload('S1', 80));
      if (url.includes('rainfall')) return jsonResponse(readingPayload('S1', 1.2));
      if (url.includes('wind-speed')) return jsonResponse(readingPayload('S1', 5.2));
      if (url.includes('wind-direction')) return jsonResponse(readingPayload('S1', 180));
      if (url.includes('/uv')) {
        return jsonResponse({
          code: 0,
          errorMsg: '',
          data: { records: [{ updatedTimestamp: '2026-08-10T12:00:00+08:00', index: [{ hour: '12', value: 7 }] }] },
        });
      }
      if (url.includes('/psi')) {
        return jsonResponse({
          code: 0,
          errorMsg: '',
          data: {
            regionMetadata: [{ name: 'central', labelLocation: { latitude: 1.3, longitude: 103.8 } }],
            items: [{ updatedTimestamp: '2026-08-10T12:00:00+08:00', readings: { psi_twenty_four_hourly: { central: 42 } } }],
          },
        });
      }
      if (url.includes('/pm25')) {
        return jsonResponse({
          code: 0,
          errorMsg: '',
          data: {
            regionMetadata: [{ name: 'central', labelLocation: { latitude: 1.3, longitude: 103.8 } }],
            items: [{ updatedTimestamp: '2026-08-10T12:00:00+08:00', readings: { pm25_one_hourly: { central: 9 } } }],
          },
        });
      }
      if (url.includes('twenty-four-hr-forecast')) {
        return jsonResponse({
          code: 0,
          errorMsg: '',
          data: {
            records: [
              {
                updatedTimestamp: '2026-08-10T12:00:00+08:00',
                general: { temperature: { low: 25, high: 32 } },
                periods: [
                  {
                    timePeriod: { text: '12 pm to 2 pm' },
                    regions: { central: { text: 'Cloudy' } },
                  },
                ],
              },
            ],
          },
        });
      }
      if (url.includes('4-day-weather-forecast')) {
        return jsonResponse({
          items: [
            {
              update_timestamp: '2026-08-10T12:00:00+08:00',
              forecasts: [
                { date: '2026-08-11', forecast: 'Thundery Showers', temperature: { low: 24, high: 31 } },
              ],
            },
          ],
        });
      }
      throw new Error(`Unexpected URL in test: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    const client = new SingaporeWeatherClient();
    const snapshot = await client.getCurrentWeather(1.3, 103.8);

    expect(snapshot).toMatchObject({
      condition: 'Cloudy',
      area: 'Bishan',
      temperature_c: 29.5,
      humidity_percent: 80,
      rainfall_mm: 1.2,
      wind_speed_knots: 5.2,
      wind_direction_degrees: 180,
      uv_index: 7,
      psi_twenty_four_hourly: 42,
      pm25_one_hourly: 9,
      air_quality_region: 'central',
      forecast_low_c: 25,
      forecast_high_c: 32,
    });
    expect(snapshot.forecast_periods).toEqual([{ label: '12 pm to 2 pm', forecast: 'Cloudy' }]);
    expect(snapshot.daily_forecast).toEqual([
      { date: '2026-08-11', forecast: 'Thundery Showers', temperature_low_c: 24, temperature_high_c: 31 },
    ]);
  });

  it('degrades gracefully when a secondary endpoint fails, keeping the rest of the snapshot', async () => {
    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = String(input);
      if (url.includes('two-hr-forecast')) {
        return jsonResponse({
          code: 0,
          errorMsg: '',
          data: {
            area_metadata: [{ name: 'Bishan', label_location: { latitude: 1.3, longitude: 103.8 } }],
            items: [
              {
                update_timestamp: '2026-08-10T12:00:00+08:00',
                forecasts: [{ area: 'Bishan', forecast: 'Cloudy' }],
              },
            ],
          },
        });
      }
      if (url.includes('air-temperature')) return jsonResponse(readingPayload('S1', 29.5));
      return new Response('Internal Server Error', { status: 500 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const client = new SingaporeWeatherClient();
    const snapshot = await client.getCurrentWeather(1.3, 103.8);

    expect(snapshot.condition).toBe('Cloudy');
    expect(snapshot.temperature_c).toBe(29.5);
    expect(snapshot.humidity_percent).toBeNull();
    expect(snapshot.forecast_periods).toEqual([]);
    expect(snapshot.daily_forecast).toEqual([]);
  });

  it('retries a reading endpoint that returns empty station data before giving up', async () => {
    let airTemperatureCalls = 0;
    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = String(input);
      if (url.includes('two-hr-forecast')) {
        return jsonResponse({
          code: 0,
          errorMsg: '',
          data: {
            area_metadata: [{ name: 'Bishan', label_location: { latitude: 1.3, longitude: 103.8 } }],
            items: [
              {
                update_timestamp: '2026-08-10T12:00:00+08:00',
                forecasts: [{ area: 'Bishan', forecast: 'Cloudy' }],
              },
            ],
          },
        });
      }
      if (url.includes('air-temperature')) {
        airTemperatureCalls += 1;
        if (airTemperatureCalls < 2) {
          return jsonResponse({ code: 0, errorMsg: '', data: { stations: [], readings: [] } });
        }
        return jsonResponse(readingPayload('S1', 29.5));
      }
      return new Response('Internal Server Error', { status: 500 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const client = new SingaporeWeatherClient();
    const snapshot = await client.getCurrentWeather(1.3, 103.8);

    expect(airTemperatureCalls).toBe(2);
    expect(snapshot.temperature_c).toBe(29.5);
  });

  it('gives up after repeated empty station data and returns a null reading', async () => {
    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = String(input);
      if (url.includes('two-hr-forecast')) {
        return jsonResponse({
          code: 0,
          errorMsg: '',
          data: {
            area_metadata: [{ name: 'Bishan', label_location: { latitude: 1.3, longitude: 103.8 } }],
            items: [
              {
                update_timestamp: '2026-08-10T12:00:00+08:00',
                forecasts: [{ area: 'Bishan', forecast: 'Cloudy' }],
              },
            ],
          },
        });
      }
      if (url.includes('air-temperature')) {
        return jsonResponse({ code: 0, errorMsg: '', data: { stations: [], readings: [] } });
      }
      return new Response('Internal Server Error', { status: 500 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const client = new SingaporeWeatherClient();
    const snapshot = await client.getCurrentWeather(1.3, 103.8);

    expect(snapshot.temperature_c).toBeNull();
  });

  it('retries the uv endpoint that returns an empty record before giving up', async () => {
    let uvCalls = 0;
    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = String(input);
      if (url.includes('two-hr-forecast')) {
        return jsonResponse({
          code: 0,
          errorMsg: '',
          data: {
            area_metadata: [{ name: 'Bishan', label_location: { latitude: 1.3, longitude: 103.8 } }],
            items: [
              {
                update_timestamp: '2026-08-10T12:00:00+08:00',
                forecasts: [{ area: 'Bishan', forecast: 'Cloudy' }],
              },
            ],
          },
        });
      }
      if (url.includes('/uv')) {
        uvCalls += 1;
        if (uvCalls < 2) {
          return jsonResponse({ code: 0, errorMsg: '', data: { records: [] } });
        }
        return jsonResponse({
          code: 0,
          errorMsg: '',
          data: { records: [{ updatedTimestamp: '2026-08-10T12:00:00+08:00', index: [{ hour: '12', value: 7 }] }] },
        });
      }
      return new Response('Internal Server Error', { status: 500 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const client = new SingaporeWeatherClient();
    const snapshot = await client.getCurrentWeather(1.3, 103.8);

    expect(uvCalls).toBe(2);
    expect(snapshot.uv_index).toBe(7);
  });

  it('retries the air quality endpoints that return empty items before giving up', async () => {
    let psiCalls = 0;
    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = String(input);
      if (url.includes('two-hr-forecast')) {
        return jsonResponse({
          code: 0,
          errorMsg: '',
          data: {
            area_metadata: [{ name: 'Bishan', label_location: { latitude: 1.3, longitude: 103.8 } }],
            items: [
              {
                update_timestamp: '2026-08-10T12:00:00+08:00',
                forecasts: [{ area: 'Bishan', forecast: 'Cloudy' }],
              },
            ],
          },
        });
      }
      if (url.includes('/psi')) {
        psiCalls += 1;
        if (psiCalls < 2) {
          return jsonResponse({ code: 0, errorMsg: '', data: { regionMetadata: [], items: [] } });
        }
        return jsonResponse({
          code: 0,
          errorMsg: '',
          data: {
            regionMetadata: [{ name: 'central', labelLocation: { latitude: 1.3, longitude: 103.8 } }],
            items: [{ updatedTimestamp: '2026-08-10T12:00:00+08:00', readings: { psi_twenty_four_hourly: { central: 42 } } }],
          },
        });
      }
      if (url.includes('/pm25')) {
        return jsonResponse({
          code: 0,
          errorMsg: '',
          data: {
            regionMetadata: [{ name: 'central', labelLocation: { latitude: 1.3, longitude: 103.8 } }],
            items: [{ updatedTimestamp: '2026-08-10T12:00:00+08:00', readings: { pm25_one_hourly: { central: 9 } } }],
          },
        });
      }
      return new Response('Internal Server Error', { status: 500 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const client = new SingaporeWeatherClient();
    const snapshot = await client.getCurrentWeather(1.3, 103.8);

    expect(psiCalls).toBe(2);
    expect(snapshot.psi_twenty_four_hourly).toBe(42);
    expect(snapshot.pm25_one_hourly).toBe(9);
  });
});
