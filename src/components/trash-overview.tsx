import {
	useCallback,
	useEffect,
	useState,
	type Dispatch,
	type SetStateAction,
} from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { FolderX, Loader2 } from "lucide-react";
import {
	db_offline_placeholders,
	empty_folder_placeholders,
	fetch_success_placeholders,
	loading_placeholders,
} from "@/assets/punny_placeholders";
import type { ItemType } from "@/db/schema";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useRandomPlaceholder } from "@/hooks/useRandomPlaceholder";
import { format } from "date-fns";
import { getFileExtension, getFileIcon } from "@/assets/helper_fns";
import { ItemActionsDropdown } from "./item-actions-dropdown";
import ItemSizeCell from "./item-size-cell";
import { getTrashedItems, toggleTrashed } from "@/api/general";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface TrashOverviewProps {
	items: ItemType[];
	view: string;
	trashOpen: boolean;
	setItems: Dispatch<SetStateAction<ItemType[]>>;
	setCurrentFolder: Dispatch<SetStateAction<ItemType | null>>;
	setBreadcrumbTrail: Dispatch<SetStateAction<ItemType[]>>;
	setSidebarRefreshKey: Dispatch<SetStateAction<number>>;
	setContextedItem: Dispatch<SetStateAction<ItemType | null>>;
}

export function TrashOverview({
	items,
	view,
	trashOpen,
	setItems,
	setCurrentFolder,
	setBreadcrumbTrail,
	setSidebarRefreshKey,
	setContextedItem,
}: TrashOverviewProps) {
	const [loading, setLoading] = useState(true);
	const { user, isLoaded } = useUser();
	const emptyFolderPlaceholder = useRandomPlaceholder(
		empty_folder_placeholders
	);
	const [highlightedItemId, setHighlightedItemId] = useState<string | null>(
		null
	);
	const [restoring, setRestoring] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);

	const fetchData = useCallback(async () => {
		if (!user?.id) return;
		setLoading(true);

		try {
			const userId = user.id;
			const items = await getTrashedItems({ userId });

			// Filter out trashed items or vice versa
			const filteredItems = items.filter((item) => item.isTrash);

			// Sorting
			const sorted = filteredItems.sort((a, b) => {
				if (a.type === "folder" && b.type !== "folder") return -1;
				if (a.type !== "folder" && b.type === "folder") return 1;
				return a.name.localeCompare(b.name);
			});

			setItems(sorted);
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
	}, [user?.id]);

	const handleRestore = async ({item}: {item: ItemType}) => {
		if (!user?.id) return toast.error("User not authenticated.");

		setRestoring(true);
		try {
			await toggleTrashed({ userId: user.id, itemId: item.id });
			toast.success("Restore successful");
			if (!item.parentId && setSidebarRefreshKey)
				setSidebarRefreshKey((k: number) => k + 1);
			setRefreshKey((k: number) => k + 1);
			if (setCurrentFolder) setCurrentFolder(null);
		} catch (err) {
			console.error(err);
			toast.error("Failed to restore file.");
		} finally {
			setRestoring(false);
		}
	};

	useEffect(() => {
		if (!isLoaded || !user?.id) return;
		setCurrentFolder(null);
		setBreadcrumbTrail([]);
		fetchData();
	}, [isLoaded, user?.id, fetchData, refreshKey]);

	// Loading
	if (loading) {
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

	// Trash empty
	if (!loading && items.length === 0) {
		return (
			<div className="flex flex-col items-center gap-2 font-medium mt-40 text-center">
				<FolderX size={50} />
				{emptyFolderPlaceholder}
			</div>
		);
	}

	// Content
	if (!loading && items.length > 0) {
		if (view == "table") {
			return (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[200px]">Name</TableHead>
							<TableHead className="w-[100px]">Type</TableHead>
							<TableHead className="w-[120px]">Created</TableHead>
							<TableHead className="w-[60px]">Size</TableHead>
							<TableHead className="w-[40px]">Location</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.map((item) => (
							<TableRow key={item.name}>
								<TableCell
									className="cursor-pointer"
									onClick={() => {
										if (item.isFolder) setCurrentFolder(item);
									}}
								>
									<div className="flex items-center gap-2">
										{(() => {
											const Icon = getFileIcon(
												item.name.split(".").pop() || "",
												item.type === "folder"
											);
											return <Icon className="w-4 h-4" />;
										})()}
										{item.name}
									</div>
								</TableCell>
								<TableCell>{getFileExtension(item.type)}</TableCell>
								<TableCell>
									{format(new Date(item.createdAt), "MMM d, yyyy")}
								</TableCell>
								<TableCell>
									<ItemSizeCell file={item} userId={user?.id} />
								</TableCell>
								<TableCell>
									{item.path}
								</TableCell>
								<TableCell className="relative text-right">
									<ItemActionsDropdown
										label={item.name}
										fileId={item.id}
										trashOpen={trashOpen}
										setContentRefreshKey={setRefreshKey}
										setSidebarRefreshKey={setSidebarRefreshKey}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			);
		}

		if (view == "flex") {
			return (
				<div className="flex flex-wrap gap-4 p-4">
					{items.map((item, idx) => (
						<div
							className={`flex flex-col items-center gap-2 p-2 rounded w-30 cursor-pointer transition-colors hover:bg-accent${
								highlightedItemId == item.id ? " bg-accent" : ""
							}`}
							key={idx}
							onClick={() => setHighlightedItemId(item.id)}
							onDoubleClick={() => item.isFolder && setCurrentFolder(item)}
							onContextMenu={() => setContextedItem(item)}
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

									<div className="text-xs text-center">{item.name}</div>
								</ContextMenuTrigger>
								<ContextMenuContent className="w-52">
									<ContextMenuItem
										inset
										className="cursor-pointer flex items-center gap-2"
										disabled={restoring}
										onClick={() => handleRestore({ item })}
									>
										{restoring ? (
											<>
												<Loader2 className="w-4 h-4 animate-spin" />{" "}
												Restoring...
											</>
										) : (
											"Restore"
										)}
									</ContextMenuItem>

									<ContextMenuItem
										inset
										className="cursor-pointer"
										variant="destructive"
									>
										Delete Permanently
									</ContextMenuItem>

									<ContextMenuSeparator />

									<div className="flex items-center justify-end text-gray-400 text-xs gap-1">
										<span>
											{format(new Date(item.createdAt), "MMM d, yyyy")}
										</span>
										<span>|</span>
										<ItemSizeCell file={item} userId={user?.id} />
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
}
