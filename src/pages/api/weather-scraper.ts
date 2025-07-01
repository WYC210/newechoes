import type { APIRoute } from 'astro';
import { load } from 'cheerio'; // Using cheerio for server-side HTML parsing

export const prerender = false; // This API route needs to be rendered on demand

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const provinceId = url.searchParams.get('provinceId'); // Get the optional provinceId

    const headers = {
      "referer": "https://www.weather.com.cn/",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0"
    };

    // Fetch city list
    const cityListUrl = "https://i.tq121.com.cn/j/webgis_v2/city.json";
    const cityListResponse = await fetch(cityListUrl, { headers: headers });

    if (!cityListResponse.ok) {
      console.error(`Failed to fetch city list: ${cityListResponse.status} ${cityListResponse.statusText}`);
      throw new Error(`HTTP error! status: ${cityListResponse.status}`);
    }

    let cityDataText = await cityListResponse.text();
    
    // More robust attempt to extract valid JSON string
    const firstBrace = cityDataText.indexOf('{');
    const lastBrace = cityDataText.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) {
      console.error('No JSON object found in city data response.');
      console.error('Problematic cityDataText:', cityDataText); // Log entire text
      return new Response(JSON.stringify({ error: 'Failed to find JSON data in city list response.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    cityDataText = cityDataText.substring(firstBrace, lastBrace + 1);

    let cityData: { [key: string]: { n: string } }; // Explicitly type cityData
    try {
      cityData = JSON.parse(cityDataText);
    } catch (jsonError) {
      console.error('Failed to parse city data JSON:', jsonError);
      console.error('Problematic cityDataText (after extraction):', cityDataText); // Log entire extracted text
      return new Response(JSON.stringify({ error: 'Failed to parse city list data', details: jsonError instanceof Error ? jsonError.message : 'Unknown JSON parsing error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const results = [];

    // Filter cities if provinceId is provided
    const filteredCityIds = Object.keys(cityData).filter(cityId => {
      const cityName = cityData[cityId]?.n;
      return provinceId ? cityName && cityName.startsWith(provinceId) : true;
    });

    // Fetch weather for each filtered city
    for (const cityId of filteredCityIds) {
      const weatherUrl = `https://www.weather.com.cn/weather1d/${cityId}.shtml`;
      const weatherResponse = await fetch(weatherUrl, { headers: headers });

      if (!weatherResponse.ok) {
        console.warn(`Could not fetch weather for ${cityData[cityId].n} (${cityId}): ${weatherResponse.status}`);
        continue; // Skip to the next city if fetch fails
      }
      const weatherText = await weatherResponse.text();

      const $ = load(weatherText);
      const title = $('#hidden_title').val() || 'N/A';

      results.push({
        cityName: cityData[cityId].n,
        weatherInfo: title
      });

      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay to prevent server blacklisting
    }

    return new Response(JSON.stringify({ data: results }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });

  } catch (error) {
    console.error('Error in weather scraper API:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch weather data', details: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 