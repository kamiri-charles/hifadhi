import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "@/api/upload";
import { toast } from "sonner";
import { Scan } from "lucide-react";
import { upload_failure_placeholders, upload_success_placeholders } from "@/assets/punny_placeholders";

interface UploadPopoverProps {
	userId: string;
	parentId: string;
}

interface UploadItem {
	file: File;
	previewUrl: string;
	progress: number;
	status: "idle" | "uploading" | "success" | "error";
}

export function UploadPopover({ userId, parentId }: UploadPopoverProps) {
	const [uploads, setUploads] = useState<UploadItem[]>([]);

	const updateProgress = (index: number, value: Partial<UploadItem>) => {
		setUploads((prev) => {
			const updated = [...prev];
			updated[index] = { ...updated[index], ...value };
			return updated;
		});
	};

	const handleUpload = async (file: File, index: number) => {
		updateProgress(index, { status: "uploading", progress: 10 });

		try {
			const result = await uploadFile({
				file,
				userId,
				parentId,
			});

			if (result) {
				toast(`${file.name} uploaded successfully`, {
					description: upload_success_placeholders[Math.floor(Math.random() * upload_success_placeholders.length)]
				});
				updateProgress(index, { progress: 100, status: "success" });
			} else {
				throw new Error("Upload failed");
			}
		} catch (err) {
			toast(`Failed to upload ${file.name}`, {
				description: upload_failure_placeholders[Math.floor(Math.random()) * upload_failure_placeholders.length]
			});
			updateProgress(index, { status: "error" });
		}
	};

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const newUploads: UploadItem[] = acceptedFiles.map((file) => ({
				file,
				previewUrl: URL.createObjectURL(file),
				progress: 0,
				status: "idle" as const,
			}));

			const startIndex = uploads.length;
			const combined = [...uploads, ...newUploads];
			setUploads(combined);

			newUploads.forEach((fileObj, i) => {
				handleUpload(fileObj.file, startIndex + i);
			});
		},
		[uploads, userId, parentId]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: true,
	});

	const isUploading = uploads.some((u) => u.status === "uploading");

	// Reset after all uploads finish
	useEffect(() => {
		if (
			uploads.length > 0 &&
			uploads.every((u) => u.status === "success" || u.status === "error")
		) {
			const timer = setTimeout(() => {
				setUploads([]);
			}, 2000); // give users time to read status
			return () => clearTimeout(timer);
		}
	}, [uploads]);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className="bg-indigo-800 text-white hover:bg-blue-600">
					Upload
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-96 max-h-[75vh] overflow-auto">
				{/* Dropzone only shows if not uploading */}
				{!isUploading && (
					<div
						{...getRootProps()}
						className={`flex flex-col items-center gap-2 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
							isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
						}`}
					>
						<input {...getInputProps()} />
						<Scan size={40} />
						<p>
							{isDragActive
								? "Drop the files here..."
								: "Drag & drop files here, or click to select"}
						</p>
					</div>
				)}

				{/* Upload Progress Section */}
				{uploads.length > 0 && (
					<div className="mt-4 space-y-4">
						{uploads.map((upload, i) => (
							<div key={i} className="border rounded-md p-2 space-y-1">
								<div className="text-sm font-medium truncate">
									{upload.file.name}
								</div>
								{upload.file.type.startsWith("image/") && (
									<img
										src={upload.previewUrl}
										alt={upload.file.name}
										className="w-full h-32 object-cover rounded-md"
									/>
								)}
								{upload.file.type.startsWith("video/") && (
									<video
										src={upload.previewUrl}
										controls
										className="w-full h-32 object-cover rounded-md"
									/>
								)}
								<Progress value={upload.progress} />
								<p className="text-xs text-muted-foreground">
									{upload.status === "uploading"
										? "Uploading..."
										: upload.status === "success"
										? "Uploaded"
										: upload.status === "error"
										? "Failed"
										: ""}
								</p>
							</div>
						))}
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
