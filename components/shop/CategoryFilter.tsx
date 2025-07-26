"use client";

import { useState } from "react";
import Link from "next/link";

interface Category {
	id: string;
	name: string;
	slug: string;
}

interface CategoryFilterProps {
	categories: Category[];
	currentCategory: string;
}

export default function CategoryFilter({
	categories,
	currentCategory,
}: CategoryFilterProps) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const currentCategoryName =
		categories.find((cat) => cat.slug === currentCategory)?.name || "All";

	return (
		<>
			{/* Mobile Dropdown */}
			<div className="md:hidden">
				<div className="relative">
					<button
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						className="w-full gap-2 py-3 text-left flex justify-between items-center font-headline text-sm tracking-wider"
					>
						<span>{currentCategoryName}</span>
						<svg
							className={`w-4 h-4 transition-transform ${
								isDropdownOpen ? "rotate-180" : ""
							}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>

					{isDropdownOpen && (
						<div className="absolute z-10 w-32 mt-1 bg-white rounded-lg">
							{categories.map((category: Category) => (
								<Link
									key={category.slug}
									href={`/shop/${category.slug}`}
									onClick={() => setIsDropdownOpen(false)}
									className={`block px-4 py-3 font-headline text-sm tracking-wider hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
										category.slug === currentCategory
											? "bg-gray-100 text-black"
											: "text-gray-700"
									}`}
								>
									{category.name}
								</Link>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Desktop Horizontal Links */}
			<div className="hidden w-full md:flex justify-start flex-wrap gap-4">
				{categories.map((category: Category) => (
					<Link
						key={category.slug}
						href={`/shop/${category.slug}`}
						className={`px-6 pl-0 py-3 font-headline text-sm tracking-wider hover:underline transition-all duration-300 ${
							category.slug === currentCategory ? "text-black underline" : ""
						}`}
					>
						{category.name}
					</Link>
				))}
			</div>
		</>
	);
}
