import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import type { ItemType } from "@/db/schema";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { BreadcrumbsHeader } from "@/components/breadcrumbs-header";
import { ItemsOverview } from "@/components/items-overview";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { getBreadcrumbTrail, updateItemInListById } from "@/assets/helper_fns";
import { UploadPopover } from "@/components/upload-popover";
import { TrashOverview } from "@/components/trash-overview";
import { ViewToggle } from "@/components/view-toggle";
import { RenameDialog } from "@/components/rename-dialog";
import { Check, FolderPlus, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createFolder } from "@/api/folders";
import { toast } from "sonner";

const Dashboard = () => {
	const nav = useNavigate();
	const { user, isSignedIn, isLoaded } = useUser();
	const [selectedRootFolder, setSelectedRootFolder] = useState<ItemType | null>(
		null
	);
	const [breadcrumbTrail, setBreadcrumbTrail] = useState<ItemType[]>([]);
	const [currentFolder, setCurrentFolder] = useState<ItemType | null>(null);
	const [subFolderName, setSubFolderName] = useState<string>("");
	const [view, setView] = useState<string>("table"); // default table view
	const [items, setItems] = useState<ItemType[]>([]);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [creatingSubFolder, setCreatingSubFolder] = useState(false);
	const [renameDialogOpen, setRenameDialogOpen] = useState(false);
	const [trashOpen, setTrashOpen] = useState(false);
	const [contextedItem, setContextedItem] = useState<ItemType | null>(null);
	const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);
	const [itemsOverviewRefreshKey, setItemsOverviewRefreshKey] = useState(0);

	const handleCreate = async () => {
		if (!subFolderName.trim() || !currentFolder) return;

		setCreatingSubFolder(true);

		try {
			const newFolder = await createFolder({
				name: subFolderName.trim(),
				userId: currentFolder.userId,
				parentId: currentFolder.id,
			});

			setItemsOverviewRefreshKey((prev) => prev + 1);
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
			<AppHeader />
			<AppSidebar
				identifier={
					user?.username || user?.primaryEmailAddress?.emailAddress || "user"
				}
				trashOpen={trashOpen}
				refreshKey={sidebarRefreshKey}
				setRefreshKey={setSidebarRefreshKey}
				selectedRootFolder={selectedRootFolder}
				setSelectedRootFolder={setSelectedRootFolder}
				setCurrentFolder={setCurrentFolder}
				setTrashOpen={setTrashOpen}
				setBreadcrumbTrail={setBreadcrumbTrail}
			/>

			<div className="flex-1 h-full p-4">
				<BreadcrumbsHeader
					trail={breadcrumbTrail}
					trashOpen={trashOpen}
					setCurrentFolder={setCurrentFolder}
				/>

				{selectedRootFolder || trashOpen ? (
					<div className="flex justify-end gap-2">
						<ViewToggle view={view} setView={setView} />

						{!trashOpen && (
							<UploadPopover userId={user?.id} parentId={currentFolder?.id} />
						)}

						<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
							{!trashOpen && (
								<PopoverTrigger>
									<Button
										size="icon"
										className="text-white bg-indigo-800 rounded-full hover:bg-blue-600 cursor-pointer"
									>
										<FolderPlus />
									</Button>
								</PopoverTrigger>
							)}

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
							<Input placeholder="Search" className="pr-10" />
							<Search
								className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
								size={18}
							/>
						</div>
					</div>
				) : null}

				{!trashOpen ? (
					<ItemsOverview
						items={items}
						view={view}
						currentFolder={currentFolder}
						refreshKey={itemsOverviewRefreshKey}
						setItems={setItems}
						setCurrentFolder={setCurrentFolder}
						setRefreshKey={setItemsOverviewRefreshKey}
						setContextedItem={setContextedItem}
						setRenameDialogOpen={setRenameDialogOpen}
					/>
				) : (
					<TrashOverview
						items={items}
						view={view}
						trashOpen={trashOpen}
						setItems={setItems}
						setCurrentFolder={setCurrentFolder}
						setBreadcrumbTrail={setBreadcrumbTrail}
						setSidebarRefreshKey={setSidebarRefreshKey}
						setContextedItem={setContextedItem}
					/>
				)}
			</div>

			{contextedItem && (
				<RenameDialog
					open={renameDialogOpen}
					onOpenChange={setRenameDialogOpen}
					fileId={contextedItem.id}
					defaultValue={contextedItem.name}
					onRenameSuccess={(newName) => {
						setItems((prev) =>
							updateItemInListById(prev, contextedItem.id, { name: newName })
						);
						setContextedItem((prev) =>
							prev ? { ...prev, name: newName } : null
						);
					}}
				/>
			)}
		</div>
	);
};

export default Dashboard;
