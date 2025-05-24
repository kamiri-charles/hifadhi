import { db } from "@/db";
import { files } from "@/db/schema";
import { and, eq } from "drizzle-orm";
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



