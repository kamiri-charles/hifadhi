import { getFolderById } from "@/api/folders";
import type { File } from "@/db/schema";

export async function getBreadcrumbTrail(folder: File, userId: string): Promise<File[]> {
	const trail: File[] = [folder];
	let current = folder;

	while (current.parentId) {
		const parent = await getFolderById(current.parentId, userId);
		if (!parent) break;
		trail.unshift(parent);
		current = parent;
	}

	return trail; // [Root, Sub1, Sub2, ...Current]
}
