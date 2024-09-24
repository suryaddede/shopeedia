import Icon from "@/app/icon.png";
import { ButtonNav } from "@/ui/nav/button-nav";
import { CartSummaryNav } from "@/ui/nav/cart-summary-nav";
import { NavMenu } from "@/ui/nav/nav-menu";
import { SearchNav } from "@/ui/nav/search-nav";
import { SeoH1 } from "@/ui/seo-h1";
import { YnsLink } from "@/ui/yns-link";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

const t = await getTranslations("Global.nav.categories");
const categories: { title: string; href: string; description: string }[] = [
	{
		title: t("fnb.title"),
		href: "/fnb",
		description: t("fnb.description"),
	},
	{
		title: t("furniture.title"),
		href: "/furniture",
		description: t("furniture.description"),
	},
	{
		title: t("men.title"),
		href: "/men",
		description: t("men.description"),
	},
	{
		title: t("women.title"),
		href: "/women",
		description: t("women.description"),
	},
	{
		title: t("beauty.title"),
		href: "/beauty",
		description: t("beauty.description"),
	},
	{
		title: t("health.title"),
		href: "/health",
		description: t("health.description"),
	},
	{
		title: t("computer.title"),
		href: "/computer",
		description: t("computer.description"),
	},
	{
		title: t("phone.title"),
		href: "/phone",
		description: t("phone.description"),
	},
];

export const Nav = async () => {
	return (
		<header className="border-b py-4">
			<div className="items-center mx-auto flex max-w-7xl flex-row gap-2 px-4 sm:flex-wrap sm:px-6 md:flex-nowrap lg:px-8">
				<YnsLink className="flex items-center" href="/">
					<Image src={Icon} alt="Shopeedia" width={50} height={50} />
					<SeoH1 className="-mt-0.5 whitespace-nowrap text-xl font-bold min-w-36">Shopeedia</SeoH1>
				</YnsLink>

				<div className="hidden sm:flex items-center">
					<NavMenu categories={categories} />
				</div>

				<div className="flex items-center w-full">
					<SearchNav />
				</div>

				<div className="flex items-center">
					<CartSummaryNav />
				</div>

				<div className="flex items-center">
					<ButtonNav />
				</div>
			</div>
		</header>
	);
};
