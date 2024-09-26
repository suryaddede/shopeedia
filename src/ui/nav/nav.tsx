import Icon from "@/app/icon.png";
import { CartSummaryNav } from "@/ui/nav/cart-summary-nav";
import { NavMenu } from "@/ui/nav/nav-menu";
import { SearchNav } from "@/ui/nav/search-nav";
import { SeoH1 } from "@/ui/seo-h1";
import { Button } from "@/ui/shadcn/button";
import { YnsLink } from "@/ui/yns-link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

const t = await getTranslations("Global.nav.categories");
const categories: { title: string; href: string; description: string }[] = [
	{
		title: t("fnb.title"),
		href: "/category/fnb",
		description: t("fnb.description"),
	},
	{
		title: t("furniture.title"),
		href: "/category/furniture",
		description: t("furniture.description"),
	},
	{
		title: t("men.title"),
		href: "/category/men",
		description: t("men.description"),
	},
	{
		title: t("women.title"),
		href: "/category/women",
		description: t("women.description"),
	},
	{
		title: t("beauty.title"),
		href: "/category/beauty",
		description: t("beauty.description"),
	},
	{
		title: t("health.title"),
		href: "/category/health",
		description: t("health.description"),
	},
	{
		title: t("computer.title"),
		href: "/category/computer",
		description: t("computer.description"),
	},
	{
		title: t("phone.title"),
		href: "/category/phone",
		description: t("phone.description"),
	},
];

export const Nav = async () => {
	return (
		<header className="border-b py-4">
			<div className="justify-between items-center mx-auto flex max-w-7xl flex-row gap-2 px-4 sm:flex-wrap sm:justify-start sm:px-6 md:flex-nowrap lg:px-8">
				<YnsLink className="flex items-center" href="/">
					<Image src={Icon} alt="Shopeedia" width={50} height={50} />
					<SeoH1 className="-mt-0.5 whitespace-nowrap text-xl font-bold min-w-36">Shopeedia</SeoH1>
				</YnsLink>

				<div className="hidden sm:flex items-center">
					<NavMenu categories={categories} />
				</div>

				<div className="hidden sm:flex items-center w-full">
					<SearchNav />
				</div>

				<div className="hidden sm:flex items-center">
					<SignedIn>
						<CartSummaryNav />
					</SignedIn>
				</div>

				<div className="flex items-center">
					<SignedOut>
						<Button>
							<SignInButton mode="modal" />
						</Button>
					</SignedOut>
					<SignedIn>
						<UserButton />
					</SignedIn>
				</div>
			</div>
		</header>
	);
};
