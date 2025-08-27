'use client'

import { useState } from 'react'
import { testAuthSession } from '@/app/auth-actions'

export function TestAuth() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    setLoading(true)
    try {
      const result = await testAuthSession()
      setResult(result)
      console.log("🧪 Test Auth Result:", result)
    } catch (error) {
      console.error("❌ Test Auth Error:", error)
      setResult({ success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Test Auth Session</h3>
      
      <button
        onClick={handleTest}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Auth'}
      </button>

      {result && (
        <div className="mt-4 p-3 border rounded">
          <h4 className="font-semibold">Result:</h4>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
