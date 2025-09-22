"use client"
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../lib/api'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, Star, Loader2, ChevronLeft, ChevronRight, Search, Grid, List, Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

interface Product { 
	id: string; 
	title: string; 
	author?: string;
	price?: number;
	imageUrl?: string;
	currency?: string;
}

export default function ProductGrid() {
	const params = useParams<{ category: string }>()
	const router = useRouter()
	const category = params?.category
	const sp = useSearchParams()
	const page = Number(sp.get('page') ?? '1')
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
	const [sortBy, setSortBy] = useState('title')
	const [searchTerm, setSearchTerm] = useState('')
	
	const { data, isLoading, error } = useQuery({
		queryKey: ['products', category, page],
		queryFn: () => apiGet<{ items: Product[]; total: number; page: number; limit: number; pages: number }>(`/products/by-category/${category}?page=${page}`),
		enabled: !!category,
	})

	const handleBack = () => {
		router.back()
	}

	const filteredProducts = data?.items.filter(product => 
		product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
		product.author?.toLowerCase().includes(searchTerm.toLowerCase())
	) || []

	const sortedProducts = [...filteredProducts].sort((a, b) => {
		switch (sortBy) {
			case 'price-low':
				return (a.price || 0) - (b.price || 0)
			case 'price-high':
				return (b.price || 0) - (a.price || 0)
			case 'title':
				return a.title.localeCompare(b.title)
			case 'author':
				return (a.author || '').localeCompare(b.author || '')
			default:
				return 0
		}
	})

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
									<h1 className="text-2xl font-bold text-gray-900 capitalize">
										{category?.replace('-', ' ')} Books
									</h1>
									<p className="text-sm text-gray-500">
										{data?.total || 0} books available
									</p>
								</div>
							</div>
						</div>
						
						{/* Search and Controls */}
						<div className="flex items-center space-x-4">
							<div className="relative">
								<Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
								<input
									type="text"
									placeholder="Search books..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
								/>
							</div>
							<div className="flex items-center space-x-2">
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
								>
									<option value="title">Sort by Title</option>
									<option value="author">Sort by Author</option>
									<option value="price-low">Price: Low to High</option>
									<option value="price-high">Price: High to Low</option>
								</select>
								<div className="flex border border-gray-300 rounded-lg overflow-hidden">
									<button
										onClick={() => setViewMode('grid')}
										className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
									>
										<Grid className="h-4 w-4" />
									</button>
									<button
										onClick={() => setViewMode('list')}
										className={`p-2 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
									>
										<List className="h-4 w-4" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{isLoading && (
					<div className="flex items-center justify-center py-20">
						<div className="text-center">
							<Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
							<p className="text-gray-600 text-lg">Loading amazing books...</p>
						</div>
					</div>
				)}

				{error && (
					<div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
						<div className="text-red-600 text-6xl mb-4">📚</div>
						<p className="text-red-600 font-medium text-lg">Oops! Failed to load books</p>
						<p className="text-red-500 text-sm mt-2">Please try again later</p>
					</div>
				)}

				{data && (
					<>
						{searchTerm && (
							<div className="mb-6">
								<p className="text-gray-600">
									{`Found ${filteredProducts.length} books matching ${searchTerm}`}
								</p>
							</div>
						)}

						<div className={viewMode === 'grid' 
							? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
							: "space-y-4"
						}>
							{sortedProducts.map((book) => (
								<Link 
									key={book.id} 
									href={`/d/${book.id}`} 
									className={`
										${viewMode === 'grid' 
											? "group bg-white rounded-2xl shadow-sm border hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-indigo-200" 
											: "group bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 flex"
										}
									`}
								>
									{viewMode === 'grid' ? (
										<>
											<div className="aspect-[3/4] relative overflow-hidden rounded-t-2xl">
												{book.imageUrl ? (
													<div className="w-full h-full relative">
														<Image
															src={book.imageUrl}
															alt={book.title}
															fill
															className="object-cover group-hover:scale-110 transition-transform duration-500"
															sizes="(min-width: 1024px) 25vw, 50vw"
														/>
													</div>
												) : (
													<div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
														<BookOpen className="h-16 w-16 text-indigo-400" />
													</div>
												)}
												<div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
													<Heart className="h-4 w-4 text-red-400 hover:text-red-500 cursor-pointer transition-colors" />
												</div>
												<div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
													<div className="flex items-center space-x-1">
														<Star className="h-3 w-3 text-yellow-400 fill-current" />
														<span className="text-xs font-medium">4.5</span>
													</div>
												</div>
											</div>
											<div className="p-5">
												<h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
													{book.title}
												</h3>
												{book.author && (
													<p className="text-gray-600 text-xs mb-3 line-clamp-1">
														by {book.author}
													</p>
												)}
												<div className="flex items-center justify-between">
													{book.price ? (
														<span className="text-xl font-bold text-indigo-600">
															{book.currency || '£'}{book.price.toFixed(2)}
														</span>
													) : (
														<span className="text-sm text-gray-500">Price TBD</span>
													)}
													<button className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors">
														<ShoppingCart className="h-4 w-4" />
													</button>
												</div>
											</div>
										</>
									) : (
										<>
											<div className="w-24 h-32 relative overflow-hidden rounded-l-xl">
												{book.imageUrl ? (
													<div className="w-full h-full relative">
														<Image
															src={book.imageUrl}
															alt={book.title}
															fill
															className="object-cover"
															sizes="100px"
														/>
													</div>
												) : (
													<div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
														<BookOpen className="h-8 w-8 text-indigo-400" />
													</div>
												)}
											</div>
											<div className="flex-1 p-4">
												<div className="flex justify-between items-start mb-2">
													<h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
														{book.title}
													</h3>
													<div className="flex items-center space-x-2">
														<Heart className="h-5 w-5 text-red-400 hover:text-red-500 cursor-pointer transition-colors" />
														<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
															<ShoppingCart className="h-4 w-4" />
															<span>Add to Cart</span>
														</button>
													</div>
												</div>
												{book.author && (
													<p className="text-gray-600 text-sm mb-2">
														by {book.author}
													</p>
												)}
												<div className="flex items-center justify-between">
													<div className="flex items-center space-x-1">
														{[1, 2, 3, 4, 5].map((star) => (
															<Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
														))}
														<span className="text-sm text-gray-500 ml-2">4.5 (128 reviews)</span>
													</div>
													{book.price ? (
														<span className="text-2xl font-bold text-indigo-600">
															{book.currency || '£'}{book.price.toFixed(2)}
														</span>
													) : (
														<span className="text-lg text-gray-500">Price TBD</span>
													)}
												</div>
											</div>
										</>
									)}
								</Link>
							))}
						</div>

						{/* Enhanced Pagination */}
						{data.pages > 1 && (
							<div className="flex items-center justify-center space-x-2 mt-12">
								<Link 
									href={`?page=${page - 1}`}
									className={`flex items-center px-4 py-3 rounded-xl border transition-all duration-200 hover:scale-105 ${
										page <= 1 
											? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
											: 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 shadow-sm'
									}`}
								>
									<ChevronLeft className="h-5 w-5 mr-2" />
									Previous
								</Link>
								
								<div className="flex items-center space-x-2">
									{Array.from({ length: Math.min(5, data.pages) }, (_, i) => {
										const pageNum = i + 1;
										return (
											<Link
												key={pageNum}
												href={`?page=${pageNum}`}
												className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
													page === pageNum
														? 'bg-indigo-600 text-white shadow-lg'
														: 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 shadow-sm'
												}`}
											>
												{pageNum}
											</Link>
										);
									})}
								</div>

								<Link 
									href={`?page=${page + 1}`}
									className={`flex items-center px-4 py-3 rounded-xl border transition-all duration-200 hover:scale-105 ${
										page >= data.pages 
											? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
											: 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 shadow-sm'
									}`}
								>
									Next
									<ChevronRight className="h-5 w-5 ml-2" />
								</Link>
							</div>
						)}
					</>
				)}
			</main>
		</div>
	)
}
