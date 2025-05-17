import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Prevent hydration mismatch
	if (!mounted) return null;

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	const isDark = theme === "dark";

	return (
		<Button className="rounded-full cursor-pointer absolute right-5 z-10" variant="outline" size="icon" onClick={toggleTheme}>
			{isDark ? (
				<Sun className="h-[1.2rem] w-[1.2rem]" />
			) : (
				<Moon className="h-[1.2rem] w-[1.2rem]" />
			)}
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
