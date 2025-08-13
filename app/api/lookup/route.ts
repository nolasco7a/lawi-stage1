import { NextResponse } from 'next/server';
import { getAllCountries, getDeptoStatesByCountryId, getCityMunicipalitiesByCountryId } from '@/lib/db/queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const countryId = searchParams.get('countryId');

  try {
    switch (type) {
      case 'countries':
        const countries = await getAllCountries();
        return NextResponse.json(countries);
        
      case 'departments':
        if (!countryId) {
          return NextResponse.json({ error: 'Country ID required' }, { status: 400 });
        }
        const departments = await getDeptoStatesByCountryId(countryId);
        console.log(departments);
        return NextResponse.json(departments);
        
      case 'cities':
        if (!countryId) {
          return NextResponse.json({ error: 'Department ID required' }, { status: 400 });
        }
        const cities = await getCityMunicipalitiesByCountryId(countryId);
        return NextResponse.json(cities);
        
      default:
        return NextResponse.json({ error: 'Type parameter required' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching lookup data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}