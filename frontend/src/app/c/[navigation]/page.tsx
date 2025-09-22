"use client"
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../lib/api'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, ChevronRight, Loader2 } from 'lucide-react'

interface Category { id: string; title: string; slug: string; children: Category[] }

export default function CategoryDrill() {
	const params = useParams<{ navigation: string }>()
	const router = useRouter()
	const navigation = params?.navigation
	const { data, isLoading, error } = useQuery({
		queryKey: ['categories', navigation],
		queryFn: () => apiGet<Category[]>(`/categories/${navigation}`),
		enabled: !!navigation,
	})

	const handleBack = () => {
		router.back()
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			{/* Header */}
			<header className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center py-6">
						<button 
							onClick={handleBack}
							className="flex items-center text-gray-600 hover:text-indigo-600 transition-all duration-200 hover:bg-indigo-50 px-3 py-2 rounded-lg mr-6"
						>
							<ArrowLeft className="h-5 w-5 mr-2" />
							Back
						</button>
						<div className="flex items-center space-x-3">
							<BookOpen className="h-8 w-8 text-indigo-600" />
							<h1 className="text-2xl font-bold text-gray-900 capitalize">
								{navigation?.replace('-', ' ')} Categories
							</h1>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{isLoading && (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
						<span className="ml-3 text-gray-600">Loading categories...</span>
					</div>
				)}

				{error && (
					<div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
						<p className="text-red-600 font-medium">Failed to load categories</p>
						<p className="text-red-500 text-sm mt-1">Please try again later</p>
					</div>
				)}

				{data && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{data.map((cat) => (
							<div key={cat.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-300">
								<div className="p-6">
									<div className="flex items-center justify-between mb-4">
										<BookOpen className="h-6 w-6 text-indigo-600" />
										<ChevronRight className="h-5 w-5 text-gray-400" />
									</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">{cat.title}</h3>
									<p className="text-gray-600 text-sm mb-4">
										Explore our collection of {cat.title.toLowerCase()}
									</p>
									<Link
										href={`/p/${cat.slug}`}
										className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm"
									>
										Browse Books
										<ChevronRight className="ml-1 h-4 w-4" />
									</Link>
								</div>
							</div>
						))}
					</div>
				)}
			</main>
		</div>
	)
}
