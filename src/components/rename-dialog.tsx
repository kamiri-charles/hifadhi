import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { renameItem } from "@/api/general";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useRandomPlaceholder } from "@/hooks/useRandomPlaceholder";
import { rename_placeholders, rename_success_messages } from "@/assets/punny_placeholders";

interface RenameDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	defaultValue?: string;
	fileId: string;
	setSidebarRefreshKey?: Dispatch<SetStateAction<number>>;
	setContentRefreshKey?: Dispatch<SetStateAction<number>>;
}

export function RenameDialog({
	open,
	onOpenChange,
	defaultValue = "",
	fileId,
	setSidebarRefreshKey,
	setContentRefreshKey,
}: RenameDialogProps) {
	const { user, isLoaded } = useUser();
	const [newName, setNewName] = useState(defaultValue);
	const [isLoading, setIsLoading] = useState(false);

	// Reset newName whenever the dialog opens or the default changes
	useEffect(() => {
		if (open) setNewName(defaultValue);
	}, [open, defaultValue]);

	const handleRename = async () => {
		if (!newName.trim() || newName === defaultValue) {
			toast.warning("Please enter a new name.");
			return;
		}

		if (!isLoaded || !user?.id) {
			toast.error("User not loaded. Please try again.");
			return;
		}

		setIsLoading(true);
		try {
			await renameItem({ fileId, userId: user.id, newName });
			toast("Renamed successfully!", {
                description: rename_success_messages[Math.floor(Math.random() * rename_success_messages.length)]
            });
			onOpenChange(false); // close the dialog
			if (setSidebarRefreshKey) setSidebarRefreshKey((prev) => prev + 1);
			if (setContentRefreshKey) setContentRefreshKey((prev) => prev + 1);
		} catch (error: any) {
			console.error(error);
			toast.error(error.message || "Rename failed");
		} finally {
			setIsLoading(false);
		}
	};

    const renamePlaceholder = useRandomPlaceholder(rename_placeholders, []);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Rename</DialogTitle>
					<DialogDescription>{renamePlaceholder}</DialogDescription>
				</DialogHeader>

				<div className="grid gap-2">
					<Label htmlFor="rename">Name</Label>
					<Input
						id="rename"
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						disabled={isLoading}
					/>
				</div>

				<DialogFooter className="sm:justify-end flex gap-2">
					<DialogClose asChild>
						<Button type="button" variant="secondary" disabled={isLoading} className="cursor-pointer">
							Cancel
						</Button>
					</DialogClose>

					{isLoading ? (
						<Button variant="default" disabled>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Renaming...
						</Button>
					) : (
						<Button variant="default" onClick={handleRename} className="cursor-pointer">
							Rename
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
