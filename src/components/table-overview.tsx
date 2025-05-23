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
import type { File } from "@/db/schema";
import {
	useCallback,
	useEffect,
	useState,
	type Dispatch,
	type SetStateAction,
} from "react";
import { useUser } from "@clerk/clerk-react";
import { getFilesAndFolders } from "@/api/folders";
import { toast } from "sonner";
import { useRandomPlaceholder } from "@/hooks/useRandomPlaceholder";
import { format } from "date-fns";
import {
	formatFileSize,
	getFileExtension,
	getFileIcon,
} from "@/assets/helper_fns";
import { FolderActionsDropdown } from "./folder-actions-dropdown";

interface TableOverviewProps {
	currentFolder: File | null;
	setCurrentFolder: Dispatch<SetStateAction<File | null>>;
	refreshKey: number;
}

export function TableOverview({
	currentFolder,
	setCurrentFolder,
	refreshKey,
}: TableOverviewProps) {
	const [filesAndFolders, setFilesAndFolders] = useState<File[]>([]);
	const [loading, setLoading] = useState(true);
	const { user, isLoaded } = useUser();
	const emptyFolderPlaceholder = useRandomPlaceholder(
		empty_folder_placeholders,
		[currentFolder?.id]
	);
	const [contentRefreshKey, setContentRefreshKey] = useState(0);

	const fetchChildren = useCallback(async () => {
		if (!user?.id) return;
		setLoading(true);

		try {
			const userId = user.id;
			const children = await getFilesAndFolders({
				userId,
				parentFolderId: currentFolder?.id,
			});

			// Sorting
			const sorted = children.sort((a, b) => {
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
					onClick: fetchChildren,
				},
			});
		} finally {
			setLoading(false);
		}
	}, [user?.id, currentFolder?.id]);

	useEffect(() => {
		if (!isLoaded || !user?.id) return;

		if (currentFolder) fetchChildren();
	}, [isLoaded, user?.id, currentFolder, fetchChildren, refreshKey, contentRefreshKey]);

	if (!currentFolder) {
		return (
			<div className="font-medium mt-40 text-center">
				Fold me once, shame on you. Fold me twice—well, just pick a folder
				already!
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
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[200px]">Name</TableHead>
						<TableHead className="w-[100px]">Type</TableHead>
						<TableHead className="w-[120px]">Created</TableHead>
						<TableHead className="w-[40px]">Size</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filesAndFolders.map((data) => (
						<TableRow key={data.name}>
							<TableCell
								className="cursor-pointer"
								onClick={() => {
									if (data.isFolder) setCurrentFolder(data);
								}}
							>
								<div className="flex items-center gap-2">
									{(() => {
										const Icon = getFileIcon(
											data.name.split(".").pop() || "",
											data.type === "folder"
										);
										return <Icon className="w-4 h-4" />;
									})()}
									{data.name}
								</div>
							</TableCell>
							<TableCell>
								{getFileExtension(data.type)}
							</TableCell>
							<TableCell>
								{format(new Date(data.createdAt), "MMM d, yyyy")}
							</TableCell>
							<TableCell>{data.isFolder ? null : formatFileSize(data.size)}</TableCell>
							<TableCell className="relative text-right">
									<FolderActionsDropdown
										label={data.name}
										fileId={data.id}
										currentName={data.name}
										setContentRefreshKey={setContentRefreshKey}
									/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	}
}
