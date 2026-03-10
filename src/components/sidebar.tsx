export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5">
      <h1 className="text-xl font-bold mb-6">CMS</h1>

      <nav className="flex flex-col gap-3">

        <a href="/dashboard" className="hover:bg-gray-700 p-2 rounded">
          Dashboard
        </a>

        <a href="/products" className="hover:bg-gray-700 p-2 rounded">
          Products
        </a>

        <a href="/suppliers" className="hover:bg-gray-700 p-2 rounded">
          Suppliers
        </a>

        <a href="/units" className="hover:bg-gray-700 p-2 rounded">
          Units
        </a>

        <a href="/purchase-orders" className="hover:bg-gray-700 p-2 rounded">
          Purchase Orders
        </a>

        <a href="/stock-logs" className="hover:bg-gray-700 p-2 rounded">
          Stock Logs
        </a>

      </nav>
    </div>
  );
}