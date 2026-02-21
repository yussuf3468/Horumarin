"use client";

import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-6 text-center">
      <div className="w-16 h-16 mb-6 rounded-2xl bg-teal-500/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-2">Xiriirka ma jiro</h1>
      <p className="text-gray-400 mb-2">No internet connection</p>
      <p className="text-gray-500 text-sm mb-8 max-w-xs">
        Please check your network and try again. Some content may still be available from cache.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 transition-colors font-medium"
      >
        Try Again
      </Link>
    </div>
  );
}
