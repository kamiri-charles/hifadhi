import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { BreadcrumbsHeader } from "@/components/breadcrumbs-header";
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FolderPlus, Search } from "lucide-react";
import { TableOverview } from "@/components/table-overview";
import { toast } from "sonner";

const Dashboard = () => {
	const nav = useNavigate();
	const { user, isSignedIn, isLoaded } = useUser();
	const [selectedRootFolderId, setSelectedRootFolderId] = useState<string | null>(null);

	useEffect(() => {
		if (!isLoaded) return;
		if (!isSignedIn) nav("/sign-in");
	}, [isLoaded, isSignedIn, nav]);

	return (
		<div className="flex mt-16 h-full">
			<Navbar />
			<AppSidebar
				identifier={
					user?.username || user?.primaryEmailAddress?.emailAddress || "user"
				}
				selectedRootFolderId={selectedRootFolderId}
				setSelectedRootFolderId={setSelectedRootFolderId}
			/>

			<div className="flex-1 h-full p-4">
				<BreadcrumbsHeader selectedParentFolder={selectedRootFolderId} />

				{selectedRootFolderId ? (
					<div className="flex justify-end gap-2">
						<Button
							className="bg-indigo-800 text-white py-2 cursor-pointer hover:bg-blue-600"
							onClick={() => toast("This feature is under development.")} // TODO - Work on this functionality
						>
							Upload
						</Button>
						<Button
							size="icon"
							className="text-white bg-indigo-800 rounded-full cursor-pointer hover:bg-blue-600"
							onClick={() => toast("This feature is under development.")} // TODO - Work on this functionality
						>
							<FolderPlus />
						</Button>
						<Input placeholder="Search" className="w-xs" />
						<Button
							className="cursor-pointer rounded-full"
							variant="ghost"
							size="icon"
						>
							<Search />
						</Button>
					</div>
				): null}

				<TableOverview selectedRootFolderId={selectedRootFolderId} />
			</div>
		</div>
	);
};

export default Dashboard;
