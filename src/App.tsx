import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from './pages/sign-in';
import { ThemeProvider } from "@/components/theme-provider";
import './App.scss'
import Landing from "./pages/landing";
import SignUp from "./pages/sign-up";

function App() {

  return (
	<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
		<div className='App'>
			<Router>
				<Routes>
					<Route path="/" element={ <Landing />} />
					<Route path="/sign-in" element={ <SignIn />} />
					<Route path="/sign-up" element={ <SignUp />} />
				</Routes>
			</Router>
		</div>
	</ThemeProvider>
	
	);
}

export default App
