import { useState, useEffect } from "react";
import { getFolderSize } from "@/api/folders";
import { formatFileSize } from "@/assets/helper_fns";
import { Loader2 } from "lucide-react";
import { type File } from "@/db/schema";

export default function FolderSizeCell({ file, userId }: { file: File; userId: string | undefined }) {
	const [size, setSize] = useState<number | null>(null);

	useEffect(() => {
        if (!userId) return;
		if (file.isFolder) {
			getFolderSize({ userId, folderId: file.id }).then(setSize);
		}
	}, [file.id]);

	if (!file.isFolder) return <>{formatFileSize(file.size)}</>;

	return (
		<>
			{size == null ? (
				<Loader2 className="animate-spin w-4 h-4" />
			) : (
				formatFileSize(size)
			)}
		</>
	);
}
