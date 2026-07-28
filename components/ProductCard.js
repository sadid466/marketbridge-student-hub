export default function ProductCard({ product }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      {/* Your card content */}
      <h3 className="font-bold text-gray-800">{product.title}</h3>
      <p className="text-blue-600 font-semibold mt-1">৳ {product.price}</p>
    </div>
  );
}