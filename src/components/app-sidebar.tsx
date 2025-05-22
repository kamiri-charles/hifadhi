import {
	useState,
	type Dispatch,
	type SetStateAction,
	useEffect,
	useCallback,
} from "react";
import { Check, Folder, Loader2, Plus, Trash, X } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import type { File } from "@/db/schema";
import { createFolder, getFilesAndFolders } from "@/api/folders";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import {
	db_offline_placeholders,
	fetch_success_placeholders,
	loading_placeholders,
} from "@/assets/punny_placeholders";
import { FolderActionsDropdown } from "./folder-actions-dropdown";

interface AppSidebarProps {
	identifier: string;
	selectedRootFolder: File | null;
	setSelectedRootFolder: Dispatch<SetStateAction<File | null>>;
	setCurrentFolder: Dispatch<SetStateAction<File | null>>;
}

export function AppSidebar({
	identifier,
	selectedRootFolder,
	setSelectedRootFolder,
	setCurrentFolder,
}: AppSidebarProps) {
	const { state } = useSidebar();
	const { user, isLoaded } = useUser();
	const [gettingFolders, setGettingFolders] = useState(true);
	const [creatingFolder, setCreatingFolder] = useState(false);
	const [folderCreationLoaderVisible, setFolderCreationLoaderVisible] =
		useState(false);
	const [rootFolders, setRootFolders] = useState<File[]>([]);
	const [newFolderName, setNewFolderName] = useState("");
	const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);

	const handleCreateFolder = async () => {
		if (!user?.id || !newFolderName.trim()) return;

		try {
			setFolderCreationLoaderVisible(true);

			await createFolder({
				userId: user.id,
				name: newFolderName.trim(),
			});

			setNewFolderName("");
			setCreatingFolder(false);

			// Re-fetch folders
			const refreshed = await getFilesAndFolders({ userId: user.id });
			setRootFolders(refreshed);
		} catch (error) {
			console.error("Failed to create folder:", error);
			toast("There was an error creating the folder.", {
				description: "Description",
				action: {
					label: "Okay",
					onClick: () => console.log("Okay"),
				},
			});
		} finally {
			setFolderCreationLoaderVisible(false);
		}
	};

	const fetchRootFolders = useCallback(async () => {
		if (!user?.id) return;

		setGettingFolders(true);
		try {
			const userId = user.id;
			const folders = await getFilesAndFolders({ userId });
			setRootFolders(folders);
			toast("Fetch successful", {
				description:
					fetch_success_placeholders[
						Math.floor(Math.random() * fetch_success_placeholders.length)
					],
			});
		} catch (error) {
			console.error("Error fetching root folders:", error);
			toast("There was an error getting your folders", {
				description:
					db_offline_placeholders[
						Math.floor(Math.random() * db_offline_placeholders.length)
					],
				action: {
					label: "Try Again",
					onClick: fetchRootFolders,
				},
			});
		} finally {
			setGettingFolders(false);
		}
	}, [user?.id]);

	useEffect(() => {
		if (!isLoaded || !user?.id) return;
		fetchRootFolders();
	}, [isLoaded, user?.id, fetchRootFolders, sidebarRefreshKey]);

	return (
		<Sidebar className="mt-16 h-[calc(100%-4rem)]" collapsible="icon">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>{identifier}</SidebarGroupLabel>
					{gettingFolders ? null : (
						<SidebarGroupAction
							title="New Folder"
							className=" rounded-full bg-indigo-800 text-white cursor-pointer hover:bg-blue-600"
							onClick={() => setCreatingFolder(true)}
						>
							<Plus /> <span className="sr-only">New Folder</span>
						</SidebarGroupAction>
					)}

					{gettingFolders && state == "expanded" ? (
						<div className="flex flex-col items-center mt-40 justify-center text-center gap-2">
							<Loader2 size={30} className="animate-spin" />
							<span className="font-medium">
								{
									loading_placeholders[
										Math.floor(Math.random() * loading_placeholders.length)
									]
								}
							</span>
						</div>
					) : (
						<SidebarGroupContent>
							{creatingFolder && (
								<div className="flex items-center gap-1 p-2">
									<Input
										type="text"
										value={newFolderName}
										onChange={(e) => setNewFolderName(e.target.value)}
										placeholder="Folder name"
										className="rounded px-2 py-1"
									/>

									{folderCreationLoaderVisible ? (
										<Loader2 className="animate-spin" />
									) : (
										<Button
											variant="ghost"
											size="icon"
											className="rounded-full cursor-pointer"
											onClick={handleCreateFolder}
										>
											<Check />
										</Button>
									)}

									{folderCreationLoaderVisible ? null : (
										<Button
											variant="ghost"
											size="icon"
											className="rounded-full cursor-pointer"
											onClick={() => {
												setNewFolderName("");
												setCreatingFolder(false);
											}}
										>
											<X />
										</Button>
									)}
								</div>
							)}

							{rootFolders.length > 0 ? (
								<SidebarMenu>
									{rootFolders.map((folder) => (
										<SidebarMenuItem
											className="cursor-pointer"
											key={folder.name}
											onClick={() => {
												setSelectedRootFolder(folder);
												setCurrentFolder(folder);
											}}
										>
											<SidebarMenuButton
												asChild
												isActive={selectedRootFolder?.id === folder.id}
											>
												<div>
													<Folder />
													<span>{folder.name}</span>
												</div>
											</SidebarMenuButton>

											<FolderActionsDropdown
												label={folder.name}
												fileId={folder.id}
												currentName={folder.name}
												setSidebarRefreshKey={setSidebarRefreshKey}
											/>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							) : (
								<>
									{creatingFolder || state == "collapsed" ? null : (
										<div className="flex flex-col items-center justify-center gap-2 mt-40">
											<span>Folder? I hardly know her!</span>
											<Button
												className="bg-indigo-800 text-white py-2 cursor-pointer hover:bg-blue-600"
												onClick={() => setCreatingFolder(true)}
											>
												New Folder
											</Button>
										</div>
									)}
								</>
							)}
						</SidebarGroupContent>
					)}
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div className="flex gap-2 cursor-pointer items-center px-3 py-2 rounded-md hover:bg-gray-100 hover:text-black transition-colors">
					<Trash />
					<span>Bin</span>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
