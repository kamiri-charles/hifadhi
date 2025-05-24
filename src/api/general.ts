import { db } from "@/db";
import { files } from "@/db/schema";
import { and, eq, like, sql } from "drizzle-orm";

interface ToggleTrashedProps {
	userId: string;
	itemId: string;
}

// Mark/unmark folder/file as trashed
export async function toggleTrashed({ userId, itemId }: ToggleTrashedProps) {
	// Get the original file/folder
	const [item] = await db
		.select()
		.from(files)
		.where(and(eq(files.id, itemId), eq(files.userId, userId)));

	if (!item) throw new Error("File not found or access denied.");

    // Switch the trashed state
	const [updated] = await db
		.update(files)
		.set({
			isTrash: !item.isTrash,
			updatedAt: new Date(),
		})
		.where(and(eq(files.id, itemId), eq(files.userId, userId)))
		.returning();

	return updated;
};

interface RenameItemProps {
	fileId: string;
	userId: string;
	newName: string;
}

export async function renameItem({ fileId, userId, newName }: RenameItemProps) {
	if (!newName.trim()) {
		throw new Error("New name is required");
	}

	// Get the original file/folder
	const [file] = await db
		.select()
		.from(files)
		.where(and(eq(files.id, fileId), eq(files.userId, userId)));

	if (!file) {
		throw new Error("File not found or access denied.");
	}

	const trimmedNewName = newName.trim();

	// If it's a folder, update paths of all nested files/folders
	if (file.isFolder) {
		const oldFullPath = `${file.path}${file.name}/`;
		const newFullPath = `${file.path}${trimmedNewName}/`;

		// 1. Update all nested items' path
		await db
			.update(files)
			.set({
				path: sql`REPLACE(${files.path}, ${oldFullPath}, ${newFullPath})`,
				updatedAt: new Date(),
			})
			.where(
				and(like(files.path, `${oldFullPath}%`), eq(files.userId, userId))
			);
	}

	// 2. Rename the file or folder itself
	const [updated] = await db
		.update(files)
		.set({
			name: trimmedNewName,
			updatedAt: new Date(),
		})
		.where(and(eq(files.id, fileId), eq(files.userId, userId)))
		.returning();

	return updated;
}
