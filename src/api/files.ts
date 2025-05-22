import { db } from "@/db";
import { files } from "@/db/schema";
import { sql, and, eq, like } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

interface CreateFileProps {
	name: string;
	userId: string;
	parentId: string;
    size: number;
    type: string;
    fileUrl: string;
    thumbnailUrl: string | null;
}


export async function createFile({
	name,
	userId,
	parentId,
    size,
    type,
    fileUrl,
    thumbnailUrl,
}: CreateFileProps) {
	if (!name.trim()) {
		throw new Error("Folder name is required");
	}

	let path = "/";

	if (parentId) {
		const [parent] = await db
			.select()
			.from(files)
			.where(
				and(
					eq(files.id, parentId),
					eq(files.userId, userId),
					eq(files.isFolder, true)
				)
			);

		if (!parent) {
			throw new Error("Parent folder does not exist.");
		}
		if (!parent.isFolder) {
			throw new Error("Parent is not a folder.");
		}

		path = `${parent.path}${parent.name}/`;
	}

	const [newFolder] = await db
		.insert(files)
		.values({
			id: uuidv4(),
			name: name.trim(),
			path,
			size,
			type,
			fileUrl,
			thumbnailUrl,
			userId,
			parentId,
			isFolder: false,
			isStarred: false,
			isTrash: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		.returning();

	return newFolder;
}

interface RenameFileProps {
	fileId: string;
	userId: string;
	newName: string;
}

interface RenameFileProps {
	fileId: string;
	userId: string;
	newName: string;
}

export async function renameFile({ fileId, userId, newName }: RenameFileProps) {
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

