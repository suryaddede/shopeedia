import { publicUrl } from "@/env.mjs";
import { cn, deslugify, formatMoney, formatProductName } from "@/lib/utils";
import { AddToCartButton } from "@/ui/add-to-cart-button";
import { JsonLd, mappedProductToJsonLd } from "@/ui/json-ld";
import { Markdown } from "@/ui/markdown";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/ui/shadcn/breadcrumb";
import { Button } from "@/ui/shadcn/button";
import { YnsLink } from "@/ui/yns-link";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import * as Commerce from "commerce-kit";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";

export const generateMetadata = async ({
	params,
	searchParams,
}: {
	params: { slug: string };
	searchParams: { variant?: string };
}): Promise<Metadata> => {
	const variants = await Commerce.productGet({ slug: params.slug });

	const selectedVariant = searchParams.variant || variants[0]?.metadata.variant;
	const product = variants.find((variant) => variant.metadata.variant === selectedVariant);
	if (!product) {
		return notFound();
	}
	const t = await getTranslations("/product.metadata");

	const canonical = new URL(`${publicUrl}/product/${product.metadata.slug}`);
	if (selectedVariant) {
		canonical.searchParams.set("variant", selectedVariant);
	}

	const productName = formatProductName(product.name, product.metadata.variant);

	return {
		title: t("title", { productName }),
		description: product.description,
		// https://github.com/vercel/next.js/pull/65366
		alternates: { canonical: canonical.toString() },
	} satisfies Metadata;
};

export default async function SingleProductPage({
	params,
	searchParams,
}: {
	params: { slug: string };
	searchParams: { variant?: string };
}) {
	const variants = await Commerce.productGet({ slug: params.slug });
	const selectedVariant = searchParams.variant || variants[0]?.metadata.variant;
	const product = variants.find((variant) => variant.metadata.variant === selectedVariant);

	if (!product) {
		return notFound();
	}

	const t = await getTranslations("/product.page");
	const locale = await getLocale();

	const category = product.metadata.category;

	return (
		<article className="pb-12">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink
							asChild
							className="inline-flex min-h-12 min-w-12 items-center justify-center"
						>
							<YnsLink href="/">{t("allProducts")}</YnsLink>
						</BreadcrumbLink>
					</BreadcrumbItem>
					{category && (
						<>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink
									className="inline-flex min-h-12 min-w-12 items-center justify-center"
									asChild
								>
									<YnsLink href={`/category/${category}`}>{deslugify(category)}</YnsLink>
								</BreadcrumbLink>
							</BreadcrumbItem>
						</>
					)}
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{product.name}</BreadcrumbPage>
					</BreadcrumbItem>
					{selectedVariant && (
						<>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>{deslugify(selectedVariant)}</BreadcrumbPage>
							</BreadcrumbItem>
						</>
					)}
				</BreadcrumbList>
			</Breadcrumb>

			<div className="mt-4 grid gap-4 lg:grid-cols-12">
				<div className="lg:col-span-5 lg:col-start-8">
					<h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">
						{product.name}
					</h1>
					{product.default_price.unit_amount && (
						<p className="mt-2 text-2xl font-medium leading-none tracking-tight text-foreground/70">
							{formatMoney({
								amount: product.default_price.unit_amount,
								currency: product.default_price.currency,
								locale,
							})}
						</p>
					)}
					<div className="mt-2">{product.metadata.stock <= 0 && <div>Out of stock</div>}</div>
				</div>

				<div className="lg:col-span-7 lg:row-span-3 lg:row-start-1">
					<h2 className="sr-only">{t("imagesTitle")}</h2>

					<div className="grid gap-4 lg:grid-cols-3">
						{product.images.map((image, idx) => (
							<Image
								key={image}
								className={cn(
									idx === 0 ? "lg:col-span-3" : "col-span-1",
									"w-full rounded-lg bg-neutral-100 object-cover object-center transition-opacity",
								)}
								src={image}
								width={idx === 0 ? 700 : 700 / 3}
								height={idx === 0 ? 700 : 700 / 3}
								sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 700px"
								loading="eager"
								priority
								alt=""
							/>
						))}
					</div>
				</div>

				<div className="grid gap-8 lg:col-span-5">
					<section>
						<h2 className="sr-only">{t("descriptionTitle")}</h2>
						<div className="prose text-secondary-foreground">
							<Markdown source={product.description || ""} />
						</div>
					</section>

					{variants.length > 1 && (
						<div className="grid gap-2">
							<p className="text-base font-medium" id="variant-label">
								{t("variantTitle")}
							</p>
							<ul role="list" className="grid grid-cols-4 gap-2" aria-labelledby="variant-label">
								{variants.map((variant) => {
									const isSelected = selectedVariant === variant.metadata.variant;
									return (
										variant.metadata.variant && (
											<li key={variant.id}>
												<YnsLink
													scroll={false}
													prefetch={true}
													href={`/product/${variant.metadata.slug}?variant=${variant.metadata.variant}`}
													className={cn(
														"flex cursor-pointer items-center justify-center gap-2 rounded-md border p-2 transition-colors hover:bg-neutral-100",
														isSelected && "border-black bg-neutral-50 font-medium",
													)}
													aria-selected={isSelected}
												>
													{deslugify(variant.metadata.variant)}
												</YnsLink>
											</li>
										)
									);
								})}
							</ul>
						</div>
					)}
					<SignedOut>
						<Button className="rounded-full text-xl py-5">
							<SignInButton mode="modal" />
						</Button>
					</SignedOut>
					<SignedIn>
						<AddToCartButton productId={product.id} disabled={product.metadata.stock <= 0} />
					</SignedIn>
				</div>
			</div>
			<JsonLd jsonLd={mappedProductToJsonLd(product)} />
		</article>
	);
}
