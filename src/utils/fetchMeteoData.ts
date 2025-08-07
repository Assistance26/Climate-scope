export interface MeteoParams {
  latitude: number;
  longitude: number;
  startDate: string;      // format: 'YYYY-MM-DD'
  endDate: string;        // format: 'YYYY-MM-DD'
  hourlyFields?: string[]; // e.g. ['temperature_2m'], defaults to ['temperature_2m']
}

export async function fetchMeteoData({
  latitude,
  longitude,
  startDate,
  endDate,
  hourlyFields = ['temperature_2m'],
}: MeteoParams) {
  if (!latitude || !longitude || !startDate || !endDate) {
    throw new Error("Missing required parameters for weather fetch.");
  }

  const hourly = encodeURIComponent(hourlyFields.join(','));

  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&hourly=${hourly}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorBody = await response.text(); // to debug
      console.error("Weather fetch error body:", errorBody);
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Weather fetch failed:", err);
    throw err;
  }
}
