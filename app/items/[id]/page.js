'use client';

import { useState, use } from 'react';
import Link from 'next/link';
// Import your existing mock products list
import { SAMPLE_PRODUCTS } from '@/data/products';

export default function ItemDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const itemId = params.id;

  // Find the matching product by ID from data/products.js
  const item = SAMPLE_PRODUCTS.find((p) => String(p.id) === String(itemId)) || SAMPLE_PRODUCTS[0];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const handleConfirmEscrow = () => {
    setPurchaseSuccess(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Breadcrumb Navigation */}
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span>{item.category || 'General'}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{item.title}</span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left: Product Image / Display */}
          <div className="md:col-span-1 space-y-4">
            <div className="w-full h-full bg-linear-to-tr from-blue-100 to-indigo-100 border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 font-medium overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <span>Product Image</span>
              )}
            </div>
          </div>

          {/* Right: Item Details & Action Box */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 font-semibold text-xs rounded-full">
                {item.category || 'Item'} • {item.condition || 'Used'}
              </span>
              <h1 className="text-2xl font-bold text-gray-900 mt-3">{item.title}</h1>
              <p className="text-3xl font-extrabold text-blue-600 mt-2">৳ {item.price}</p>
            </div>

            <div className="border-t border-b border-gray-100 py-4 space-y-2 text-sm">
              <h3 className="font-semibold text-gray-900">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description || 'No detailed description provided for this campus listing.'}
              </p>
            </div>

            {/* Seller Details Card */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Seller</p>
                <p className="font-bold text-gray-900 text-sm">{item.seller?.name || 'DIU Student'}</p>
                <p className="text-xs text-gray-500">{item.seller?.department || 'Daffodil International University'}</p>
              </div>
              <span className="text-sm font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
                {item.seller?.rating || '5.0 ★'}
              </span>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
            >
              <span>Proceed to payment</span>
              <span>→</span>
            </button>
          </div>

        </div>
      </div>

      {/* Escrow Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 space-y-5 shadow-xl">
            {!purchaseSuccess ? (
              <>
                <h3 className="text-lg font-bold text-gray-900">Confirm Escrow Purchase</h3>
                <div className="bg-gray-50 p-4 rounded-xl text-xs space-y-2 border border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Item:</span>
                    <span className="font-semibold text-gray-900 truncate max-w-50">{item.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount to Lock:</span>
                    <span className="font-bold text-blue-600">৳ {item.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Source:</span>
                    <span className="font-semibold text-gray-900">OneCard Balance</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  By confirming, <strong>৳ {item.price}</strong> will be moved from your available balance to <strong>Escrow Hold</strong>. Funds are released to the seller only after you scan their QR code during campus handover.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl text-xs hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmEscrow}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition"
                  >
                    Lock Funds & Buy
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-gray-900">Escrow Locked Successfully!</h3>
                <p className="text-xs text-gray-500">
                  Your funds are now held in escrow. Check your dashboard to view the transaction and access your QR verification code for meetup.
                </p>
                <div className="flex gap-2">
                  <Link
                    href="/dashboard"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs text-center transition"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}