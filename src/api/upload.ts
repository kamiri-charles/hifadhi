import { upload as uploadToImageKit } from "@imagekit/react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/supabaseClient";
import { createFile } from "./files";

interface UploadFileOptions {
	file: File;
	userId: string;
	parentId: string;
}

export async function uploadFile({
	file,
	userId,
	parentId,
}: UploadFileOptions): Promise<string | null> {
	if (!file) {
		console.error("No file provided.");
		return null;
	}

	const isMedia =
		file.type.startsWith("image/") || file.type.startsWith("video/");
	const fileId = uuidv4();
	const fileExtension = file.name.split(".").pop();
	const filePath = `uploads/${userId}/${fileId}.${fileExtension}`;
	let fileUrl: string | null = null;
	let thumbnailUrl: string | null = null;

	try {
		if (isMedia) {
			// Get auth params from your backend
			const auth = await fetch("https://hifadhi-micro.onrender.com/auth").then(
				(res) => res.json()
			);

			const response = await uploadToImageKit({
				file: file,
				fileName: file.name,
				publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
				...auth,
			});

			fileUrl = response.url ?? "";
			thumbnailUrl = response.thumbnailUrl || null;
		} else {
			const { error } = await supabase.storage
				.from("user-files") // Bucket name
				.upload(filePath, file);

			if (error) throw error;

			const { data: publicData } = supabase.storage
				.from("user-files")
				.getPublicUrl(filePath);

			fileUrl = publicData.publicUrl;
		}

		// Add file metadata to db
		await createFile({
			name: file.name,
			userId,
			parentId: parentId,
			size: file.size,
			type: isMedia ? file.type : file.type,
			fileUrl,
			thumbnailUrl,
		});

		return fileUrl;
	} catch (error) {
		console.error("Upload failed:", error);
		return null;
	}
}
