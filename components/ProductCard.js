import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <Link 
      href={`/items/${product.id}`} 
      className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition duration-200"
    >
      {/* Product Image */}
      <div className="w-full h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <span className="text-gray-400 text-xs font-medium">No Image</span>
        )}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-700 shadow-sm">
          {product.category || 'General'}
        </span>
      </div>

      {/* Product Body */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-blue-600 transition">
          {product.title}
        </h3>
        
        <p className="text-xs text-gray-500 line-clamp-2">
          {product.description || 'Campus item available for immediate pickup.'}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="font-extrabold text-blue-600 text-base">
            ৳ {product.price}
          </span>
          <span className="text-[11px] text-gray-400 font-medium">
            {product.condition || 'Used'}
          </span>
        </div>
      </div>
    </Link>
  );
}