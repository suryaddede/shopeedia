import { publicUrl } from "@/env.mjs";
import { ProductList } from "@/ui/products/product-list";
import { YnsLink } from "@/ui/yns-link";
import * as Commerce from "commerce-kit";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import type { Metadata } from "next/types";

export const metadata = {
	alternates: { canonical: publicUrl },
} satisfies Metadata;

export default async function Home() {
	const products = await Commerce.productBrowse({ first: 99 });
	const t = await getTranslations("/");

	return (
		<main>
			<section className="rounded bg-neutral-100 py-8 sm:py-12">
				<div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2">
					<div className="max-w-md space-y-4">
						<h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
							{t("hero.title")}
						</h2>
						<p className="text-pretty text-neutral-600">{t("hero.description")}</p>
						<YnsLink
							className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-900 px-6 font-medium text-neutral-50 transition-colors hover:bg-neutral-900/90 focus:outline-none focus:ring-1 focus:ring-neutral-950"
							href={t("hero.link")}
						>
							{t("hero.action")}
						</YnsLink>
					</div>
					<Image
						alt="Xiaomi Curved Gaming Monitor G34WQI"
						loading="eager"
						priority={true}
						className="rounded"
						height={450}
						width={450}
						src="https://d1wqzb5bdbcre6.cloudfront.net/0f9c37dd341d67d18dc7b4d5cab92e82b457bd3b8565ad9083502a36f920da4f/68747470733a2f2f66696c65732e7374726970652e636f6d2f6c696e6b732f4d44423859574e6a64463878555449324f4764464d565254536d78765158684266475a735833526c633352666546644a6556465363586f77544652346130646f4e6e557759555932546c64683030796c6f4a3970586e"
						style={{
							objectFit: "cover",
						}}
						sizes="(max-width: 640px) 70vw, 450px"
					/>
				</div>
			</section>

			<ProductList products={products} />
		</main>
	);
}
