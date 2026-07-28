import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          MarketBridge <span className="text-xs text-gray-500 font-normal">DIU</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-blue-600">Browse Items</Link>
          <Link href="/sell" className="hover:text-blue-600">Sell Item</Link>
          <Link href="/dashboard" className="hover:text-blue-600">OneCard Balance</Link>
        </div>

        {/* Action Button */}
        <div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            Login with DIU ID
          </button>
        </div>
      </div>
    </nav>
  );
}