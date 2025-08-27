import { NextRequest } from 'next/server'
import { GET } from './route'

// Manual test helper function
export async function testDayMealsAPI() {
  console.log('Testing Day Meals API...')
  
  try {
    // Test that the function exists
    if (typeof GET !== 'function') {
      throw new Error('GET function not exported')
    }
    
    // Test unauthorized request
    const request = new NextRequest('http://localhost/api/nutrition/day-meals')
    const response = await GET(request)
    
    if (response.status !== 401) {
      throw new Error(`Expected 401 status, got ${response.status}`)
    }
    
    const json = await response.json()
    if (json.success !== false) {
      throw new Error('Expected success to be false for unauthorized request')
    }
    
    console.log('✅ API route structure is valid')
    console.log('✅ Unauthorized request handling works correctly')
    console.log('📋 Day meals API is ready to use with proper authentication')
    
    return {
      success: true,
      message: 'API route is properly structured and ready for use'
    }
  } catch (error) {
    console.error('❌ API test failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Export for manual testing
export { GET as DayMealsGET }