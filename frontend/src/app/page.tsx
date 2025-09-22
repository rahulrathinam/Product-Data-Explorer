"use client"
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../lib/api'
import { BookOpen, Search, TrendingUp, Star } from 'lucide-react'

type Navigation = { id: string; title: string; slug: string }

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['navigation'],
    queryFn: () => apiGet<Navigation[]>('/navigation'),
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-indigo-100 rounded-xl">
                <BookOpen className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">World of Books</h1>
                <p className="text-sm text-gray-500">Discover your next favorite book</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
                />
              </div>
              <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                <TrendingUp className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Your Next Great Read
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Explore thousands of books across all genres and categories
          </p>
        </div>
      </section>

      {/* Navigation Cards */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Browse Categories</h3>
          <p className="text-gray-600">Choose a category to explore our book collection</p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">Failed to load categories</p>
            <p className="text-red-500 text-sm mt-1">{(error as Error).message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((nav) => (
            <Link
              key={nav.id}
              href={`/c/${nav.slug}`}
              className="group bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 hover:scale-105 hover:border-indigo-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <BookOpen className="h-8 w-8 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
                  <Star className="h-5 w-5 text-yellow-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors mb-2">
                  {nav.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  Explore our collection of {nav.title.toLowerCase()}
                </p>
                <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium group-hover:text-indigo-700">
                  Browse books
                  <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
