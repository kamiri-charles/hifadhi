import { db } from "@/db";
import { files } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

interface CreateFolderProps {
	name: string;
	userId: string;
	parentId?: string | null;
}

export async function getFolderById(folderId: string, userId: string) {
	const [folder] = await db
		.select()
		.from(files)
		.where(
			and(
				eq(files.id, folderId),
				eq(files.userId, userId),
				eq(files.isFolder, true)
			)
		);

	return folder ?? null;
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


interface GetFolderContentProps {
	userId: string;
	parentFolderId?: string | null;
}

export async function getFolderContent({
	userId,
	parentFolderId = null,
}: GetFolderContentProps) {
	const data = await db
		.select()
		.from(files)
		.where(
			and(
				eq(files.userId, userId),
				parentFolderId === null
					? isNull(files.parentId)
					: eq(files.parentId, parentFolderId)
			)
		)
		.orderBy(files.name);

	return data;
}

interface GetFolderSizeProps {
	userId: string;
	folderId: string;
}

export async function getFolderSize({ userId, folderId }: GetFolderSizeProps): Promise<number> {
	// Helper function to recursively get all sizes of files under a folder
	async function calculateSize(currentFolderId: string): Promise<number> {
		// Get children of the current folder
		const children = await db
			.select()
			.from(files)
			.where(and(eq(files.userId, userId), eq(files.parentId, currentFolderId)));

		let totalSize = 0;

		for (const item of children) {
			if (item.isFolder) {
				// Recursively calculate size of subfolder
				totalSize += await calculateSize(item.id);
			} else {
				// Add file size
				totalSize += item.size;
			}
		}

		return totalSize;
	}

	// Start the recursive calculation
	return calculateSize(folderId);
}
