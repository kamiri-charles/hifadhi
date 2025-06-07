import { getFolderById } from "@/api/folders";
import type { ItemType } from "@/db/schema";

import {
	FileText,
	Image as ImageIcon,
	Video,
	Folder,
	Music,
	FileArchive,
	FileJson,
	Code,
	FileQuestion,
} from "lucide-react";

export function getFileIcon(extension: string, isFolder = false){
	const ext = extension.toLowerCase();

	if (isFolder) return Folder

	if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext))
		return ImageIcon
	if (["mp4", "mov", "avi", "webm", "mkv"].includes(ext))
		return Video
	if (["mp3", "wav", "ogg"].includes(ext)) return Music
	if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
		return FileArchive
	if (["json", "csv"].includes(ext)) return FileJson
	if (["js", "ts", "jsx", "tsx", "html", "css"].includes(ext))
		return Code
	if (["pdf", "doc", "docx", "txt", "md", "rtf"].includes(ext))
		return FileText

	return FileQuestion
}


export async function getBreadcrumbTrail(folder: ItemType, userId: string): Promise<ItemType[]> {
	const trail: ItemType[] = [folder];
	let current = folder;

	while (current.parentId) {
		const parent = await getFolderById(current.parentId, userId);
		if (!parent) break;
		trail.unshift(parent);
		current = parent;
	}

	return trail; // [Root, Sub1, Sub2, ...Current]
}

export function formatFileSize(bytes: number): string {
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	if (bytes === 0) return "0 Bytes";
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	const size = bytes / Math.pow(1024, i);
	return `${size.toFixed(1)} ${sizes[i]}`;
}

export function getFileExtension(mimeType: string): string {
	return mimeType.split("/").pop() || "";
}

