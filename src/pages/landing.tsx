import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Cloud, Folder, Layers, Shield, Zap } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { toast } from "sonner";

const Landing = () => {
	const nav = useNavigate();
	const { isSignedIn, isLoaded } = useAuth();
	useEffect(() => {
		toast("Hold on", { description: "Checking authentication status" });
		if (isSignedIn && isLoaded) nav("/dashboard");
	}, [isSignedIn, isLoaded]);
	return (
		<div className="w-full h-full flex flex-wrap items-center justify-around px-10 overflow-auto relative isolate bg-white/5 py-24 sm:py-32">
			<AppHeader />

			<div className="h-full flex flex-col flex-wrap gap-1 mt-40 lg:mt-30">
				<h2 className="text-5xl">Store your files with ease</h2>
				<span>Simple. Secure. Fast</span>

				<div className="flex gap-4 mt-8">
					<Button
						onClick={() => nav("/sign-up")}
						className="bg-blue-800 text-white py-5 cursor-pointer hover:bg-blue-600"
					>
						Get Started
					</Button>
					<Button
						onClick={() => nav("/sign-in")}
						className="bg-blue-800 text-white py-5 px-4 cursor-pointer hover:bg-blue-600"
					>
						Sign In
					</Button>
				</div>
			</div>

			<div className="flex flex-col gap-4">
				<h2 className="text-4xl">Features</h2>

				<div className="flex flex-wrap items-center gap-4">
					<div className="flex flex-col gap-2 p-4 bg-accent rounded-lg cursor-pointer">
						<div className="flex items-center justify-center gap-2">
							<Shield size={30} color="oklch(62.3% 0.214 259.815)" />
							<span className="text-2xl text-blue-500">
								Secure Cloud Storage
							</span>
						</div>
						<span>
							Fort Knox called—they want their security back.
						</span>
					</div>

					<div className="flex flex-col gap-2 p-4 bg-accent rounded-lg cursor-pointer">
						<div className="flex items-center justify-center gap-2">
							<Cloud size={30} color="oklch(62.3% 0.214 259.815)" />
							<span className="text-2xl text-blue-500">Anywhere Access</span>
						</div>
						<span>
							Your files get more stamps in their passport than you do.
						</span>
					</div>

					<div className="flex flex-col gap-2 p-4 bg-accent rounded-lg cursor-pointer">
						<div className="flex items-center justify-center gap-2">
							<Folder size={30} color="oklch(62.3% 0.214 259.815)" />
							<span className="text-2xl text-blue-500">
								Organized File Management
							</span>
						</div>
						<span>
							Marie Kondo would swipe right on your folders.
						</span>
					</div>

					<div className="flex flex-col gap-2 p-4 bg-accent rounded-lg cursor-pointer">
						<div className="flex items-center justify-center gap-2">
							<Zap size={30} color="oklch(62.3% 0.214 259.815)" />
							<span className="text-2xl text-blue-500">
								Blazing Fast Uploads
							</span>
						</div>
						<span>
							Blink and you'll miss it—seriously, don't blink.
						</span>
					</div>

					<div className="flex flex-col gap-2 p-4 bg-accent rounded-lg cursor-pointer">
						<div className="flex items-center justify-center gap-2">
							<Layers size={30} color="oklch(62.3% 0.214 259.815)" />
							<span className="text-2xl text-blue-500">Intuitive UI</span>
						</div>
						<span>
							So simple your cat could navigate it (no promises on the typing).
						</span>
					</div>
				</div>
			</div>

			{/* BLUE glow – top-left */}
			<div
				aria-hidden
				className="pointer-events-none absolute -top-32 -left-32 h-[480px] w-[480px] -z-10
               rounded-full bg-sky-300/40 blur-2xl sm:h-[640px] sm:w-[640px] animate-spin-slow"
			></div>
		</div>
	);
};

export default Landing;
