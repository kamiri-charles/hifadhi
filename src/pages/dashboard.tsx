import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { BreadcrumbsHeader } from "@/components/breadcrumbs-header";
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, FolderPlus, Loader2, Search } from "lucide-react";
import { TableOverview } from "@/components/table-overview";
import { toast } from "sonner";
import type { File } from "@/db/schema";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { getBreadcrumbTrail } from "@/assets/helper_fns";
import { createFolder } from "@/api/folders";
import { UploadPopover } from "@/components/upload-popover";

const Dashboard = () => {
	const nav = useNavigate();
	const { user, isSignedIn, isLoaded } = useUser();
	const [selectedRootFolder, setSelectedRootFolder] = useState<File | null>(null);
	const [breadcrumbTrail, setBreadcrumbTrail] = useState<File[]>([]);
	const [currentFolder, setCurrentFolder] = useState<File | null>(null);
	const [subFolderName, setSubFolderName] = useState<string>("");
	const [creatingSubFolder, setCreatingSubFolder] = useState(false);
	const [refreshSubfolders, setRefreshSubfolders] = useState(0);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);



	const handleCreate = async () => {
		if (!subFolderName.trim() || !currentFolder) return;

		setCreatingSubFolder(true);

		try {
			const newFolder = await createFolder({
				name: subFolderName.trim(),
				userId: currentFolder.userId,
				parentId: currentFolder.id,
			});

			setRefreshSubfolders((prev) => prev + 1);
			setIsPopoverOpen(false);
			toast("Folder created", {
				description: `Welcome to your new folder: "${newFolder.name}"`,
			});

		} catch (error) {
			console.error("Error creating folder:", error);
			toast("Folder creation failed", {
				description: "Something went wrong. Please try again!",
			});
		} finally {
			setSubFolderName("");
			setCreatingSubFolder(false);
		}
	};

	useEffect(() => {
		if (!isLoaded) return;
		if (!isSignedIn) nav("/sign-in");

		const fetchTrail = async () => {
			if (currentFolder && user?.id) {
				const trail = await getBreadcrumbTrail(currentFolder, user.id);
			setBreadcrumbTrail(trail);
			}
		};

		fetchTrail();
	}, [isLoaded, isSignedIn, nav, currentFolder, user?.id]);

	return (
		<div className="flex mt-16 h-full">
			<Navbar />
			<AppSidebar
				identifier={
					user?.username || user?.primaryEmailAddress?.emailAddress || "user"
				}
				selectedRootFolder={selectedRootFolder}
				setSelectedRootFolder={setSelectedRootFolder}
				setCurrentFolder={setCurrentFolder}
			/>


			<div className="flex-1 h-full p-4">
				<BreadcrumbsHeader
					folderTrail={breadcrumbTrail}
					setCurrentFolder={setCurrentFolder}
				/>

				{selectedRootFolder ? (
					<div className="flex justify-end gap-2">
						<UploadPopover userId={user!.id} parentId={currentFolder!.id} />

						<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
							<PopoverTrigger>
								<Button
									size="icon"
									className="text-white bg-indigo-800 rounded-full hover:bg-blue-600"
								>
									<FolderPlus />
								</Button>
							</PopoverTrigger>

							<PopoverContent className="w-64 p-4 rounded bg-accent mt-2 z-10">
								<div className="flex items-center gap-2">
									<Input
										placeholder="Folder name"
										value={subFolderName}
										onChange={(e) => setSubFolderName(e.target.value)}
										className="flex-1 border-b border-muted rounded outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
									/>
									{creatingSubFolder ? (
										<Loader2 className="animate-spin" />
									) : (
										<Button
											size="icon"
											onClick={handleCreate}
											disabled={!subFolderName.trim()}
											className="rounded-full cursor-pointer text-white bg-indigo-800 hover:bg-blue-600"
										>
											<Check className="w-4 h-4" />
										</Button>
									)}
								</div>
							</PopoverContent>
						</Popover>

						<div className="relative w-[250px]">
							<Input
								placeholder="Search"
								className="pr-10" // space for the icon on the right
							/>
							<Search
								className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
								size={18}
							/>
						</div>
					</div>
				) : null}

				<TableOverview
					currentFolder={currentFolder}
					setCurrentFolder={setCurrentFolder}
					refreshKey={refreshSubfolders}
				/>
			</div>
		</div>
	);
};

export default Dashboard;
