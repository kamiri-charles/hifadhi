import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { BreadcrumbsHeader } from "@/components/breadcrumbs-header";
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, FolderPlus, Search } from "lucide-react";
import { TableOverview } from "@/components/table-overview";
import { toast } from "sonner";
import type { File } from "@/db/schema";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";

const Dashboard = () => {
	const nav = useNavigate();
	const { user, isSignedIn, isLoaded } = useUser();
	const [selectedRootFolder, setSelectedRootFolder] = useState<File | null>(null);
	//const [folderNavArr, setFolderNavArr] = useState<string[]>([]);
	const [subFolderName, setSubFolderName] = useState<string>("");

	const handleCreate = () => {
		if (subFolderName.trim()) {
			// Call your createFolder logic here
			console.log("Creating folder:", subFolderName);
			setSubFolderName("");
		}
	};

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
				selectedRootFolder={selectedRootFolder}
				setSelectedRootFolder={setSelectedRootFolder}
			/>

			<div className="flex-1 h-full p-4">
				<BreadcrumbsHeader selectedRootFolder={selectedRootFolder} />

				{selectedRootFolder ? (
					<div className="flex justify-end gap-2">
						<Button
							className="bg-indigo-800 text-white py-2 cursor-pointer hover:bg-blue-600"
							onClick={() => toast("This feature is under development.")} // TODO - Work on this functionality
						>
							Upload
						</Button>

						<Popover>
							<PopoverTrigger>
								<Button
									size="icon"
									className="text-white bg-indigo-800 rounded-full hover:bg-blue-600"
								>
									<FolderPlus />
								</Button>
							</PopoverTrigger>

							<PopoverContent className="w-64 p-4">
								<div className="flex items-center gap-2">
									<Input
										placeholder="Folder name"
										value={subFolderName}
										onChange={(e) => setSubFolderName(e.target.value)}
										className="flex-1 border-b border-muted rounded outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
									/>
									<Button
										variant="ghost"
										size="icon"
										onClick={handleCreate}
										disabled={!subFolderName.trim()}
										className="rounded-full cursor-pointer"
									>
										<Check className="w-4 h-4" />
									</Button>
								</div>
							</PopoverContent>
						</Popover>

						<Input placeholder="Search" className="w-xs" />
						<Button
							className="cursor-pointer rounded-full"
							variant="ghost"
							size="icon"
						>
							<Search />
						</Button>
					</div>
				) : null}

				<TableOverview selectedRootFolder={selectedRootFolder} />
			</div>
		</div>
	);
};

export default Dashboard;
