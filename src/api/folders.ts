import { db } from "@/db";
import { files } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

interface CreateFolderProps {
	name: string;
	userId: string;
	parentId?: string | null;
}

interface GetFoldersProps {
	userId: string;
	folderParentId?: string | null;
}

export async function getFilesAndFolders({
	userId,
	folderParentId = null,
}: GetFoldersProps) {
	const folders = await db
		.select()
		.from(files)
		.where(
			and(
				eq(files.userId, userId),
				eq(files.isFolder, true),
				folderParentId === null
					? isNull(files.parentId)
					: eq(files.parentId, folderParentId)
			)
		)
		.orderBy(files.name);

	return folders;
}

export async function createFolder({
	name,
	userId,
	parentId = null,
}: CreateFolderProps) {
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
			size: 0,
			type: "folder",
			fileUrl: "",
			thumbnailUrl: null,
			userId,
			parentId,
			isFolder: true,
			isStarred: false,
			isTrash: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		.returning();

	return newFolder;
}
