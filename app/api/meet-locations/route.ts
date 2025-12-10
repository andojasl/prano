import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    
    // Extract form data
    const title = formData.get('title') as string;
    const city = formData.get('city') as string;
    const location = formData.get('location') as string;
    const link = formData.get('link') as string;
    const date = formData.get('date') as string;
    const imageFile = formData.get('image') as File | null;

    // Validate required fields
    if (!title || !city || !location || !date) {
      return NextResponse.json(
        { error: 'Title, city, location, and date are required' },
        { status: 400 }
      );
    }

    let imageUrl = null;

    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
          { status: 400 }
        );
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (imageFile.size > maxSize) {
        return NextResponse.json(
          { error: 'File too large. Maximum size is 5MB.' },
          { status: 400 }
        );
      }

      try {
        // Upload to Cloudinary
        imageUrl = await uploadToCloudinary(imageFile, 'meet-locations');
      } catch (_uploadError) {
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    // Insert into database
    const { data, error: insertError } = await supabase
      .from('meet_locations')
      .insert([
        {
          title,
          city,
          location,
          "Link": link || null,
          "Image": imageUrl,
          "Date": date,
        }
      ])
      .select();

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to create meet location' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: data[0] 
    });

  } catch (_error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get all meet locations
    const { data, error } = await supabase
      .from('meet_locations')
      .select('*')
      .order('Date', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch meet locations' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });

  } catch (_error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}