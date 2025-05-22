import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { renameFile } from "@/api/files";
import { DropdownMenuShortcut } from "./ui/dropdown-menu";
import { Loader2, Pen } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

interface RenamePopoverProps {
	fileId: string;
	currentName: string;
	setSidebarRefreshKey?: Dispatch<SetStateAction<number>>;
	setContentRefreshKey?: Dispatch<SetStateAction<number>>;
}

export function RenamePopover({
	fileId,
	currentName,
	setSidebarRefreshKey,
	setContentRefreshKey,
}: RenamePopoverProps) {
	const { user, isLoaded } = useUser();
	const [open, setOpen] = useState(false);
	const [newName, setNewName] = useState(currentName);
	const [isLoading, setIsLoading] = useState(false);

	const handleRename = async () => {
		if (!newName.trim() || newName === currentName) {
			toast.warning("Please enter a new name.");
			return;
		}

		if (!isLoaded || !user?.id) {
			toast.error("User not loaded. Please try again.");
			return;
		}

		setIsLoading(true);
		try {
			await renameFile({ fileId, userId: user.id, newName });
			toast.success("Renamed successfully!");
			setOpen(false);
			if (setSidebarRefreshKey) setSidebarRefreshKey(prev => prev + 1);
			if (setContentRefreshKey) setContentRefreshKey(prev => prev + 1);
		} catch (error: any) {
			console.error(error);
			toast.error(error.message || "Rename failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<div
					className="flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-muted"
					onClick={(e) => {
						e.stopPropagation(); // prevent dropdown from closing
						setOpen(true);
					}}
				>
					<span>Rename</span>
					<DropdownMenuShortcut>
						<Pen size={16} />
					</DropdownMenuShortcut>
				</div>
			</PopoverTrigger>
			<PopoverContent
				side="right"
				align="start"
				className="w-60 max-h-[75vh] overflow-auto space-y-4 z-50"
			>
				<div>
					<Input
						id="rename"
						type="text"
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						disabled={isLoading}
						placeholder="New name"
					/>
				</div>
				<div className="flex items-center justify-end gap-2">
					<Button
						variant="secondary"
						onClick={() => setOpen(false)}
						disabled={isLoading}
					>
						Cancel
					</Button>
					{isLoading ? <Loader2 className="animate-spin" /> :  (
						<Button className="cursor-pointer" onClick={handleRename} disabled={isLoading}>
						Rename
					</Button>
					)}
					
				</div>
			</PopoverContent>
		</Popover>
	);
}
