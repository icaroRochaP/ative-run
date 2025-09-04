import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API progress-photos: Starting GET request...')
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 })
    }
    
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('progress_photos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('❌ API progress-photos: Database error:', error)
      return NextResponse.json({ success: false, error: 'Failed to fetch photos' }, { status: 500 })
    }

    console.log('✅ API progress-photos: Successfully retrieved photos')
    return NextResponse.json({ success: true, photos: data || [] })
  } catch (error) {
    console.error('❌ API progress-photos: Unexpected error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API progress-photos: Starting POST request...')
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 })
    }

    // Parse FormData para receber arquivo
    const formData = await request.formData()
    const weight = formData.get('weight') as string
    const file = formData.get('file') as File

    console.log('📋 FormData contents:')
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(name: ${value.name}, size: ${value.size}, type: ${value.type})`)
      } else {
        console.log(`  ${key}: ${value}`)
      }
    }

    if (!weight) {
      return NextResponse.json({ success: false, error: 'Weight is required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    let photo_url = null

    // Se há arquivo, fazer upload para o Supabase Storage
    if (file && file.size > 0) {
      console.log('📤 Uploading file to Supabase Storage...')
      console.log('📁 File details:', { name: file.name, size: file.size, type: file.type })
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ success: false, error: 'Only image files are allowed' }, { status: 400 })
      }

      // Gerar nome único para o arquivo
      const fileExtension = file.name.split('.').pop()
      const fileName = `progress_${userId}_${Date.now()}.${fileExtension}`
      const filePath = `progress-photos/${fileName}`
      
      console.log('📂 Upload path:', filePath)

      // Converter File para ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = new Uint8Array(arrayBuffer)
      
      console.log('📊 Buffer size:', buffer.length)

      // Upload para Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('progress-photos')
        .upload(filePath, buffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        })

      console.log('🔍 Upload result:', { uploadData, uploadError })

      if (uploadError) {
        console.error('❌ API progress-photos: Storage upload error:', uploadError)
        return NextResponse.json({ success: false, error: 'Failed to upload photo' }, { status: 500 })
      }

      // Obter URL público da foto
      const { data: urlData } = supabase.storage
        .from('progress-photos')
        .getPublicUrl(filePath)

      photo_url = urlData.publicUrl
      console.log('✅ Photo uploaded successfully:', photo_url)
    } else {
      console.log('📷 No file provided, creating record without photo')
    }
    
    // Salvar registro na tabela progress_photos
    const { data: photo, error } = await supabase
      .from('progress_photos')
      .insert({
        user_id: userId,
        weight: parseFloat(weight),
        photo_url,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('❌ API progress-photos: Database error:', error)
      return NextResponse.json({ success: false, error: 'Failed to create photo record' }, { status: 500 })
    }

    console.log('✅ API progress-photos: Successfully created photo record')
    return NextResponse.json({ success: true, photo }, { status: 201 })
  } catch (error) {
    console.error('❌ API progress-photos: Unexpected error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
