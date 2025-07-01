import type { APIRoute } from 'astro';

export const prerender = false; // This API route needs to be rendered on demand

export const POST: APIRoute = async ({ request }) => {
  try {
    const { startPage, endPage } = await request.json();

    if (typeof startPage !== 'number' || typeof endPage !== 'number') {
      return new Response(JSON.stringify({ error: 'Invalid page numbers provided.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let allVegetableData = [];

    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0"
    };
    const targetUrl = "http://www.xinfadi.com.cn/getPriceData.html";

    for (let i = startPage; i <= endPage; i++) {
      const formData = new URLSearchParams({
        "count": "464572", // This count might need to be dynamic or removed if not strictly necessary for individual page requests
        "current": String(i),
        "limit": "20"
      });

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...headers
        },
        body: formData.toString()
      });

      if (!response.ok) {
        console.error(`Failed to fetch vegetable data for page ${i}: ${response.status} ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.json();
      allVegetableData = allVegetableData.concat(text.list);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay to prevent server blacklisting
    }

    return new Response(JSON.stringify({ data: allVegetableData }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });

  } catch (error) {
    console.error('Error in vegetable scraper API:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch vegetable data', details: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 