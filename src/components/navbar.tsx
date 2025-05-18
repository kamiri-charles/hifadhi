import { CloudUpload } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { CustomSidebarTrigger } from "./custom-sidebar-trigger";
import {
	SignedIn,
	SignedOut,
	useAuth,
	UserButton,
} from "@clerk/clerk-react";

const Navbar = () => {
	const {isSignedIn} = useAuth();
	const nav = useNavigate();
	return (
		<header className="flex items-center justify-between fixed top-0 left-0 w-full py-4 px-20 border-b-2">
			<div className="flex items-center gap-2">
				{isSignedIn ? <CustomSidebarTrigger /> : null}
				
				<CloudUpload size={30} />
				<h2 className="text-2xl">Hifadhi</h2>
			</div>

			<SignedOut>
				<div className="flex gap-10">
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
		</header>
	);
};

export default Navbar;
