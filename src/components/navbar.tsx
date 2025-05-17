import { CloudUpload } from 'lucide-react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
	const nav = useNavigate();
  return (
		<header className="flex items-center justify-between fixed top-0 left-0 w-full py-4 px-20 border-b-2">
      <div className="flex items-center gap-2">
        <CloudUpload size={30} />
        <h2 className="text-2xl">Hifadhi</h2>
      </div>
			<div className="flex gap-10">
				<Button onClick={() => nav("/sign-in")} className="bg-indigo-800 text-white py-2 cursor-pointer hover:bg-blue-600">
					Sign In
				</Button>
				<Button className="bg-indigo-800 text-white py-2 px-4 cursor-pointer hover:bg-blue-600">
					Sign Up
				</Button>
			</div>
		</header>
	);
}

export default Navbar