import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from './pages/sign-in';
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "./components/ui/sidebar";
import Landing from "./pages/landing";
import SignUp from "./pages/sign-up";
import Dashboard from "./pages/dashboard";
import './App.scss'

function App() {

  return (
	<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
		<SidebarProvider>
			<div className='App w-screen h-screen'>
			<Router>
				<Routes>
					<Route path="/" element={ <Landing />} />
					<Route path="/sign-in" element={ <SignIn />} />
					<Route path="/sign-up" element={ <SignUp />} />
					<Route path="/dashboard" element={<Dashboard />} />
				</Routes>
			</Router>
		</div>
		</SidebarProvider>
		
	</ThemeProvider>
	
	);
}

export default App
