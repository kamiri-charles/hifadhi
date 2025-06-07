import { FolderX, Loader2 } from "lucide-react";
import {
	db_offline_placeholders,
	empty_folder_placeholders,
	fetch_success_placeholders,
	loading_placeholders,
	no_folder_selected_placeholders,
} from "@/assets/punny_placeholders";
import { type File } from "@/db/schema";
import {
	useCallback,
	useEffect,
	useState,
	type Dispatch,
	type SetStateAction,
} from "react";
import { useUser } from "@clerk/clerk-react";
import { getFolderContent } from "@/api/folders";
import { toast } from "sonner";
import { useRandomPlaceholder } from "@/hooks/useRandomPlaceholder";
import { format } from "date-fns";
import { getFileExtension, getFileIcon } from "@/assets/helper_fns";
import FolderSizeCell from "./folder-size-cell";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface FlexOverviewProps {
	currentFolder: File | null;
	setCurrentFolder: Dispatch<SetStateAction<File | null>>;
	refreshKey: number;
}

export function FlexOverview({
	currentFolder,
	setCurrentFolder,
	refreshKey,
}: FlexOverviewProps) {
	const [filesAndFolders, setFilesAndFolders] = useState<File[]>([]);
	const [loading, setLoading] = useState(true);
	const { user, isLoaded } = useUser();
	const emptyFolderPlaceholder = useRandomPlaceholder(
		empty_folder_placeholders,
		[currentFolder?.id]
	);
	const noFolderSelectedPlaceholder = useRandomPlaceholder(
		no_folder_selected_placeholders
	);
	const [contentRefreshKey, setContentRefreshKey] = useState(0);
    const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		if (!user?.id) return;
		setLoading(true);

		try {
			const userId = user.id;
			const children = await getFolderContent({
				userId,
				parentFolderId: currentFolder?.id,
			});

			// Filter out trashed items or vice versa
			const filteredItems = children.filter((item) => !item.isTrash);

			// Sorting
			const sorted = filteredItems.sort((a, b) => {
				if (a.type === "folder" && b.type !== "folder") return -1;
				if (a.type !== "folder" && b.type === "folder") return 1;
				return a.name.localeCompare(b.name);
			});

			setFilesAndFolders(sorted);
			toast("Fetch successful", {
				description:
					fetch_success_placeholders[
						Math.floor(Math.random() * fetch_success_placeholders.length)
					],
			});
		} catch (error) {
			console.error("Error getting files:", error);
			toast("There was an error getting your files", {
				description:
					db_offline_placeholders[
						Math.floor(Math.random() * db_offline_placeholders.length)
					],
				action: {
					label: "Try Again",
					onClick: fetchData,
				},
			});
		} finally {
			setLoading(false);
		}
	}, [user?.id, currentFolder?.id]);

	useEffect(() => {
		if (!isLoaded || !user?.id) return;
		if (currentFolder) fetchData();
	}, [
		isLoaded,
		user?.id,
		currentFolder,
		fetchData,
		refreshKey,
		contentRefreshKey,
	]);

	if (!currentFolder) {
		return (
			<div className="font-medium mt-40 text-center">
				{noFolderSelectedPlaceholder}
			</div>
		);
	}

	// Loading
	if (currentFolder && loading) {
		return (
			<div className="flex flex-col items-center mt-40 text-center gap-2 font-medium">
				<Loader2 size={30} className="animate-spin" />
				<span>
					{
						loading_placeholders[
							Math.floor(Math.random() * loading_placeholders.length)
						]
					}
				</span>
			</div>
		);
	}

	// Empty folder
	if (currentFolder && !loading && filesAndFolders.length === 0) {
		return (
			<div className="flex flex-col items-center gap-2 font-medium mt-40 text-center">
				<FolderX size={50} />
				{emptyFolderPlaceholder}
			</div>
		);
	}

	// Content
	if (currentFolder && !loading && filesAndFolders.length > 0) {
		return (
			<div className="flex flex-wrap gap-4 p-4">
				{filesAndFolders.map((item, idx) => (
					<div
						className={`flex flex-col items-center gap-2 p-2 rounded w-30 cursor-pointer transition-colors hover:bg-accent${
							highlightedItemId == item.id ? " bg-accent" : ""
						}`}
						key={idx}
						onClick={() => setHighlightedItemId(item.id)}
						onDoubleClick={() => item.isFolder && setCurrentFolder(item)}
					>
						<ContextMenu>
							<ContextMenuTrigger>
								<div className="flex items-center justify-center">
									{(() => {
										const Icon = getFileIcon(
											item.name.split(".").pop() || "",
											item.type === "folder"
										);
										return <Icon size={50} />;
									})()}
								</div>

								<div className="text-xs">{item.name}</div>
							</ContextMenuTrigger>
							<ContextMenuContent className="w-52">
								<ContextMenuItem
									inset
									className="cursor-pointer"
									disabled={!item.isFolder}
								>
									Open
								</ContextMenuItem>
								<ContextMenuItem inset className="cursor-pointer">
									Download
								</ContextMenuItem>
								<ContextMenuItem inset className="cursor-pointer">
									Rename
									<ContextMenuShortcut>f2</ContextMenuShortcut>
								</ContextMenuItem>

								<ContextMenuItem inset className="cursor-pointer">
									Delete
									<ContextMenuShortcut>del</ContextMenuShortcut>
								</ContextMenuItem>

								<ContextMenuSeparator />

								<div className="flex items-center justify-end text-gray-400 text-xs gap-1">
									<span>{format(new Date(item.createdAt), "MMM d, yyyy")}</span>
									<span>|</span>
									<FolderSizeCell file={item} userId={user?.id} />
									<span>|</span>
									<span>{getFileExtension(item.type)}</span>
								</div>
							</ContextMenuContent>
						</ContextMenu>
					</div>
				))}
			</div>
		);
	}
}
