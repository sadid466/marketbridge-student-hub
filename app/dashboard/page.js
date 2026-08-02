'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock user data for prototyping
const MOCK_USER = {
  name: 'Sadid Ahmed',
  email: 'sadid242-35-612@diu.edu.bd',
  department: 'Software Engineering',
  oneCardBalance: 2500,
  escrowInHold: 1800,
};

const MOCK_MY_LISTINGS = [
  {
    id: '1',
    title: 'Casio FX-991EX ClassWiz Calculator',
    price: 1800,
    status: 'Active',
    views: 24,
  },
  {
    id: '4',
    title: 'Logitech Wireless Mouse M185',
    price: 600,
    status: 'Active',
    views: 12,
  },
];

const MOCK_TRANSACTIONS = [
  {
    id: 'TX-1092',
    item: 'Data Structures & Algorithms Textbook',
    amount: 350,
    type: 'Bought',
    status: 'Escrow Held (Pending Pickup)',
    date: 'Jul 28, 2026',
  },
  {
    id: 'TX-1044',
    item: 'DIU Varsity Jacket',
    amount: 900,
    type: 'Sold',
    status: 'Completed',
    date: 'Jul 20, 2026',
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('listings');

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-2xl flex items-center justify-center">
              {MOCK_USER.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{MOCK_USER.name}</h1>
              <p className="text-sm text-gray-500">{MOCK_USER.email} • <span className="font-medium text-gray-700">{MOCK_USER.department}</span></p>
            </div>
          </div>

          <Link
            href="/sell"
            className="w-full md:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition text-center shadow-sm"
          >
            + Post New Item
          </Link>
        </div>

        {/* OneCard Escrow Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
              OneCard Available Balance
            </p>
            <h2 className="text-3xl font-extrabold mt-2">৳ {MOCK_USER.oneCardBalance.toLocaleString()}</h2>
            <p className="text-xs text-blue-100 mt-2">Ready for instant campus escrow purchases</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Funds Held in Escrow
            </p>
            <h2 className="text-3xl font-extrabold text-gray-800 mt-2">৳ {MOCK_USER.escrowInHold.toLocaleString()}</h2>
            <p className="text-xs text-gray-500 mt-2">Will be released upon item handover verification</p>
          </div>
        </div>

        {/* Tabs section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200 bg-gray-50/50 px-4">
            <button
              onClick={() => setActiveTab('listings')}
              className={`py-4 px-4 text-sm font-semibold border-b-2 transition ${
                activeTab === 'listings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Listings ({MOCK_MY_LISTINGS.length})
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-4 text-sm font-semibold border-b-2 transition ${
                activeTab === 'transactions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Escrow History
            </button>
          </div>

          <div className="p-6">
            {/* TAB 1: My Listings */}
            {activeTab === 'listings' && (
              <div className="space-y-4">
                {MOCK_MY_LISTINGS.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition gap-4 bg-gray-50/30"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm font-bold text-blue-600 mt-0.5">৳ {item.price}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-green-100 text-green-700 font-medium text-xs rounded-full">
                        {item.status}
                      </span>
                      <button className="text-xs font-semibold text-gray-500 hover:text-gray-700 underline">
                        Edit
                      </button>
                      <button className="text-xs font-semibold text-red-500 hover:text-red-700 underline">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: Escrow History */}
            {activeTab === 'transactions' && (
              <div className="space-y-4">
                {MOCK_TRANSACTIONS.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/30 gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${tx.type === 'Bought' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                          {tx.type}
                        </span>
                        <h3 className="font-semibold text-gray-900 text-sm">{tx.item}</h3>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{tx.id} • {tx.date}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-bold text-gray-900">৳ {tx.amount}</p>
                      <p className="text-xs font-medium text-amber-600 mt-0.5">{tx.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}