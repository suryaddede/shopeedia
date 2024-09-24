import { Button } from "@/ui/shadcn/button";
import { getTranslations } from "next-intl/server";

export const ButtonNav = async () => {
	const t = await getTranslations("Global.nav.button");
	return (
		<div className="flex w-full items-center gap-x-3">
			<Button variant="outline">{t("login")}</Button>
			<Button>{t("register")}</Button>
		</div>
	);
};
