import { useState, type Dispatch, type SetStateAction, useEffect, useCallback } from "react";
import { Check, Folder, Loader2, MoreHorizontal, Plus, X } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import type { File } from "@/db/schema";
import { createFolder, getFilesAndFolders } from "@/api/folders";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { db_offline_placeholders, fetch_success_placeholders } from "@/assets/punny_placeholders";

interface AppSidebarProps {
	identifier: string;
	selectedRootFolderId: string | null;
	setSelectedRootFolderId: Dispatch<SetStateAction<string | null>>;
}

export function AppSidebar({
	identifier,
	selectedRootFolderId,
	setSelectedRootFolderId,
}: AppSidebarProps) {
	const { state } = useSidebar();
	const { user, isLoaded } = useUser();
	const [gettingFolders, setGettingFolders] = useState(true);
	const [creatingFolder, setCreatingFolder] = useState(false);
	const [folderCreationLoaderVisible, setFolderCreationLoaderVisible] = useState(false);
	const [rootFolders, setRootFolders] = useState<File[]>([]);
	const [newFolderName, setNewFolderName] = useState("");

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
				description: fetch_success_placeholders[Math.floor(Math.random() * fetch_success_placeholders.length)]
			});
		} catch (error) {
			console.error("Error fetching root folders:", error);
			toast("There was an error getting your folders", {
				description: db_offline_placeholders[Math.floor(Math.random() * db_offline_placeholders.length)],
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
	}, [isLoaded, user?.id, fetchRootFolders]);

	return (
		<Sidebar className="mt-16" collapsible="icon">
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
						<div className="flex flex-col items-center mt-20 justify-center text-center">
							<Loader2 size={30} className="animate-spin" />
							<span className="text-3xs">
								Hold tight, your folders are being... re-foldered
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
											onClick={() => setSelectedRootFolderId(folder.id)}
										>
											<SidebarMenuButton
												asChild
												isActive={selectedRootFolderId === folder.id}
											>
												<div>
													<Folder />
													<span>{folder.name}</span>
												</div>
											</SidebarMenuButton>

											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<SidebarMenuAction className="cursor-pointer">
														<MoreHorizontal />
													</SidebarMenuAction>
												</DropdownMenuTrigger>
												<DropdownMenuContent side="right" align="start">
													<DropdownMenuItem>
														<span>Rename</span>
													</DropdownMenuItem>
													<DropdownMenuItem>
														<span>Delete</span>
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
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
		</Sidebar>
	);
}
