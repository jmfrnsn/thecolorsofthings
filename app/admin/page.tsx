import { getEnv } from "@/utils/env"

export default function AdminPage() {
  const envError = !getEnv("BLOB_READ_WRITE_TOKEN") ? "BLOB_READ_WRITE_TOKEN is not set" : null

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
        {envError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{envError}</span>
            <p className="mt-2">Please ensure the BLOB_READ_WRITE_TOKEN is set in your Vercel project settings.</p>
          </div>
        )}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4 text-gray-700">Admin Information</h2>
          <p>The image upload functionality has been removed. This page is now for informational purposes only.</p>
        </div>
      </div>
    </div>
  )
}
