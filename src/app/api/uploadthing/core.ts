import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const driverImageRouter = {
  driverImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1, 
    },
  })
    .middleware(async ({ req }) => {
      const body = await req.clone().json().catch(() => ({}));
      return { 
        kind: String(body?.input?.kind ?? 'driver') 
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for kind:", metadata.kind);
      console.log("File URL:", file.url);
      return { uploadedBy: "system", fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof driverImageRouter;
