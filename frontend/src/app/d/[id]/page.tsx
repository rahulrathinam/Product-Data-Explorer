"use client"
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../lib/api'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, BookOpen, Star, Loader2, User, Calendar, Building, Hash, Heart, Share2, Bookmark } from 'lucide-react'

import { useState } from 'react'

interface ProductDetail {
  id: string
  title: string
  author?: string
  price?: number
  currency?: string
  imageUrl?: string
  isbn?: string
  publisher?: string
  publicationDate?: string
  detail?: { description?: string; ratingsAvg?: number; reviewsCount?: number }
  reviews: { id: string; author?: string; rating?: number; text?: string }[]
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => apiGet<ProductDetail>(`/products/detail/${id}`),
    enabled: !!id,
  })

  const handleBack = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading amazing book details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
          <div className="text-red-600 text-6xl mb-4">📚</div>
          <p className="text-red-600 font-medium text-lg">Oops! Failed to load book details</p>
          <p className="text-red-500 text-sm mt-2">Please try again later</p>
          <button 
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-indigo-600 transition-all duration-200 hover:bg-indigo-50 px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Book Details</h1>
                  <p className="text-sm text-gray-500">Explore this amazing book</p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-lg transition-colors ${
                  isLiked ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {data && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
              {/* Book Cover */}
              <div className="lg:col-span-1">
                {data.imageUrl ? (
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 relative">
                    <Image
                      src={data.imageUrl}
                      alt={data.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, 100vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                    <BookOpen className="h-24 w-24 text-indigo-400" />
                  </div>
                )}
              </div>

              {/* Book Details */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.title}</h1>
                  {data.author && (
                    <p className="text-xl text-gray-600 mb-4">by {data.author}</p>
                  )}
                  
                  {data.price && (
                    <div className="flex items-center space-x-4 mb-6">
                      <span className="text-3xl font-bold text-indigo-600">
                        {data.currency || '£'}{data.price.toFixed(2)}
                      </span>
                      {data.detail?.ratingsAvg && (
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-5 w-5 ${
                                  i < Math.floor(data.detail!.ratingsAvg!) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-gray-600">
                            {data.detail.ratingsAvg.toFixed(1)} ({data.detail.reviewsCount} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Book Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.isbn && (
                    <div className="flex items-center space-x-3">
                      <Hash className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">ISBN</p>
                        <p className="font-medium">{data.isbn}</p>
                      </div>
                    </div>
                  )}
                  
                  {data.publisher && (
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Publisher</p>
                        <p className="font-medium">{data.publisher}</p>
                      </div>
                    </div>
                  )}
                  
                  {data.publicationDate && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Published</p>
                        <p className="font-medium">{data.publicationDate}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {data.detail?.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {data.detail.description}
                    </p>
                  </div>
                )}

                {/* Reviews */}
                {data.reviews?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                    <div className="space-y-4">
                      {data.reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="font-medium text-gray-900">
                                {review.author || 'Anonymous'}
                              </span>
                            </div>
                            {review.rating && (
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${
                                      i < Math.floor(review.rating!) 
                                        ? 'text-yellow-400 fill-current' 
                                        : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          {review.text && (
                            <p className="text-gray-700">{review.text}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
    </main>
    </div>
  )
}
