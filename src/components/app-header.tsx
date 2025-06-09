import { SignedIn, SignedOut, useAuth, UserButton } from "@clerk/clerk-react";
import { CustomSidebarTrigger } from "./custom-sidebar-trigger";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Cloud } from "lucide-react";

export function AppHeader() {
	const { isSignedIn } = useAuth();
	const nav = useNavigate();
	return (
		<header className="flex items-baseline justify-between fixed top-0 left-0 w-full py-4 px-4 lg:px-10 border-b-2">
			<div className="flex items-baseline gap-2">
				{isSignedIn ? <CustomSidebarTrigger /> : null}

				<span className="relative top-1">
					<Cloud size={30} />
				</span>
				<h2 className="text-2xl">Hifadhi</h2>
			</div>

			<div className="flex gap-2">
				<SignedOut>
					<div className="flex gap-2">
						<Button
							onClick={() => nav("/sign-in")}
							className="bg-indigo-800 text-white py-2 cursor-pointer hover:bg-blue-600"
						>
							Sign In
						</Button>
						<Button
							onClick={() => nav("/sign-up")}
							className="bg-indigo-800 text-white py-2 px-4 cursor-pointer hover:bg-blue-600"
						>
							Sign Up
						</Button>
					</div>
				</SignedOut>

				<SignedIn>
					<UserButton />
				</SignedIn>

				<ModeToggle />
			</div>
		</header>
	);
};