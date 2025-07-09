export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Tailwind CSS Test</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Card 1</h2>
            <p className="text-gray-600">Tailwind CSS is working properly!</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-600 mb-2">Card 2</h2>
            <p className="text-gray-600">Responsive grid layout works!</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-purple-600 mb-2">Card 3</h2>
            <p className="text-gray-600">Colors and shadows are applied!</p>
          </div>
        </div>
      </div>
    </div>
  )
}