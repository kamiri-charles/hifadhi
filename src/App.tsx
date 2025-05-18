import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignInPage from "./pages/sign-in";
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "./components/ui/sidebar";
import Landing from "./pages/landing";
import SignUpPage from "./pages/sign-up";
import Dashboard from "./pages/dashboard";
import "./App.scss";

function App() {
	const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

	if (!PUBLISHABLE_KEY) {
		throw new Error("Add your Clerk Publishable Key to the .env file");
	}

	return (
		<ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/sign-in">
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<SidebarProvider>
				<div className="App w-screen h-screen">
					<Router>
						<Routes>
							<Route path="/" element={<Landing />} />
							<Route path="/sign-in" element={<SignInPage />} />
							<Route path="/sign-up" element={<SignUpPage />} />
							<Route path="/dashboard" element={<Dashboard />} />
						</Routes>
					</Router>
				</div>
			</SidebarProvider>
		</ThemeProvider>
		</ClerkProvider>
		
	);
}

export default App;
