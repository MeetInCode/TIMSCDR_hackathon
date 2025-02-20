"use client"
import React, { useState } from 'react';
import { Search, ExternalLink } from 'lucide-react';

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

// Define interfaces for the response data
interface ContactInformation {
  phone: string;
  email: string;
}

interface Scheme {
  url: string;
  scheme_name: string;
  description: string;
  eligibility: string;
  benefits: string;
  application_process: string;
}

interface NGO {
  url: string;
  ngo_name: string;
  description: string;
  focus_area: string;
  location: string;
  contact_information: ContactInformation;
}

interface ApiResponse {
  schemes: Scheme[];
  ngos: NGO[];
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchSchemes = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearchError(null);

    try {
      // Make POST request to your Flask backend
      const response = await fetch('https://rj91hcdj-4444.inc1.devtunnels.ms/schemes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: searchQuery
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Failed to fetch results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (

 <SidebarProvider>
 <AppSidebar />
 <SidebarInset>

    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">
            Search Government Schemes and NGOs
          </h1>
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchSchemes()}
              placeholder="Ask about government schemes or NGOs..."
              className="flex-1 p-4 border border-gray-300 rounded-lg shadow-sm text-black placeholder-gray-500"
            />
            <button
              onClick={searchSchemes}
              disabled={loading}
              className="px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Search className="h-5 w-5" />
              Search
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Error Message */}
        {searchError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-8">
            {searchError}
          </div>
        )}

        {/* Results Display */}
        {searchResults && !loading && (
          <div className="space-y-8">
            {/* Government Schemes */}
            {searchResults.schemes && searchResults.schemes.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-black mb-4">Government Schemes</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.schemes.map((scheme, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-black mb-2">
                          {scheme.scheme_name}
                        </h3>
                        <a
                          href={scheme.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      </div>
                      <p className="text-black mb-4">{scheme.description}</p>
                      <div className="space-y-2">
                        <p className="text-black">
                          <span className="font-medium">Eligibility:</span> {scheme.eligibility}
                        </p>
                        <p className="text-black">
                          <span className="font-medium">Benefits:</span> {scheme.benefits}
                        </p>
                        <p className="text-black">
                          <span className="font-medium">How to Apply:</span> {scheme.application_process}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NGOs */}
            {searchResults.ngos && searchResults.ngos.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-black mb-4">Related NGOs</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.ngos.map((ngo, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-black mb-2">
                          {ngo.ngo_name}
                        </h3>
                        <a
                          href={ngo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      </div>
                      <p className="text-black mb-4">{ngo.description}</p>
                      <div className="space-y-2">
                        <p className="text-black">
                          <span className="font-medium">Focus Area:</span> {ngo.focus_area}
                        </p>
                        <p className="text-black">
                          <span className="font-medium">Location:</span> {ngo.location}
                        </p>
                        <div className="text-black">
                          <p className="font-medium">Contact:</p>
                          <p>Phone: {ngo.contact_information.phone}</p>
                          <p>Email: {ngo.contact_information.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results Message */}
            {(!searchResults.schemes?.length && !searchResults.ngos?.length) && (
              <div className="text-center py-12">
                <p className="text-black">No results found for your query.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </SidebarInset>
    </SidebarProvider>
  );
}