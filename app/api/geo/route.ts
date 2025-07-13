import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.ip || '127.0.0.1';
    
    // Use a free IP geolocation service
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    
    if (data.status === 'success') {
      return NextResponse.json({
        success: true,
        data: {
          country: data.country,
          countryCode: data.countryCode,
          region: data.regionName,
          city: data.city,
          ip: data.query,
          timezone: data.timezone,
        }
      });
    } else {
      // Fallback to default (India)
      return NextResponse.json({
        success: true,
        data: {
          country: 'India',
          countryCode: 'IN',
          region: 'Unknown',
          city: 'Unknown',
          ip: ip,
          timezone: 'Asia/Kolkata',
        }
      });
    }
  } catch (error) {
    console.error('Error detecting location:', error);
    
    // Fallback response
    return NextResponse.json({
      success: true,
      data: {
        country: 'India',
        countryCode: 'IN',
        region: 'Unknown',
        city: 'Unknown',
        ip: '127.0.0.1',
        timezone: 'Asia/Kolkata',
      }
    });
  }
} 