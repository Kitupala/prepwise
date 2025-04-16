"use client";

import { IKImage, IKUpload, ImageKitProvider } from "imagekitio-next";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!;
const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT!;
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

const authenticator = async () => {
  const res = await fetch(`${apiEndpoint}/api/auth/imagekit`);
  if (!res.ok) throw new Error("Failed to auth ImageKit");
  return await res.json();
};

interface ImageUploadProps {
  type: "image";
  accept: string;
  placeholder: string;
  folder: string;
  value?: string;
  onChange: (url: string) => void;
}

const ImageUpload = ({
  type,
  accept,
  placeholder,
  folder,
  value,
  onChange,
}: ImageUploadProps) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState(0);

  const onError = () => toast.error("Your upload failed. Please try again.");

  const onSuccess = (response: any) => {
    setFile(response);
    toast.success("Profile image upload was successful.");

    if (onChange && response?.filePath) {
      onChange(response.filePath);
    }
  };

  const onValidate = (file: File) => {
    if (type === "image" && file.size > 20 * 1024 * 1024) {
      toast.error("Image must be less than 20MB");
      return false;
    }
    return true;
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        validateFile={onValidate}
        onUploadStart={() => setProgress(0)}
        onUploadProgress={({ loaded, total }) =>
          setProgress(Math.round((loaded / total) * 100))
        }
        folder={folder}
        accept={accept}
        className="hidden"
      />

      <div className="flex w-full justify-center">
        {file?.filePath ? (
          <IKImage
            alt={file.filePath}
            path={file.filePath}
            width={300}
            height={300}
            className="border-muted-foreground/20 size-24 rounded-full border object-cover"
          />
        ) : (
          <Image
            src="/profile.svg"
            alt="user avatar"
            width={300}
            height={300}
            className="border-muted-foreground/20 size-24 overflow-hidden rounded-full border object-cover"
          />
        )}
      </div>

      <button
        className={cn("btn-upload", file.filePath && "cursor-default")}
        disabled={!!file.filePath}
        onClick={(e) => {
          e.preventDefault();
          // @ts-expect-error click does not exist on type never
          ikUploadRef.current?.click();
        }}
      >
        {file.filePath ? null : (
          <Image
            src="/upload.svg"
            alt="upload icon"
            width={15}
            height={15}
            className="object-contain"
          />
        )}
        <p className="text-muted-foreground text-sm">
          {file.filePath ? "Image uploaded" : placeholder}
        </p>
      </button>

      {progress > 0 && progress < 100 && (
        <div className="bg-light-400 w-full rounded-full">
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}
    </ImageKitProvider>
  );
};

export default ImageUpload;
