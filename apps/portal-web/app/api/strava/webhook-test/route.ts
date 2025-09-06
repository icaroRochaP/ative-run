import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Webhook test endpoint',
    url: 'https://ative.codic.com.br/api/strava/webhook',
    verify_token: 'strava_webhook_verify_token_2024',
    status: 'ready'
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    console.log('🧪 Webhook test received:', body)
    
    return NextResponse.json({
      message: 'Test webhook received',
      timestamp: new Date().toISOString(),
      body: body
    })
  } catch (error) {
    console.error('❌ Webhook test error:', error)
    return NextResponse.json(
      { error: 'Test webhook failed' },
      { status: 500 }
    )
  }
}
