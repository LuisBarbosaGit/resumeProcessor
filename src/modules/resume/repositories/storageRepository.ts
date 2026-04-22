import type { MultipartFile } from "@fastify/multipart";
import { supabaseStorage } from "../../../infra/supabase/client.js";

export interface IStorageRepository {
  saveFile(file: MultipartFile, path: string): Promise<string>;
}

export class StorageRepository implements IStorageRepository {
  constructor(private readonly repository = supabaseStorage) {}

  async saveFile(file: MultipartFile, path: string) {
    const { error } = await this.repository.storage
      .from("resumes")
      .upload(path, file.file, {
        contentType: file.mimetype,
        upsert: true,
        duplex: "half",
      });

    if (error) {
      throw error;
    }

    const { data: publicUrl } = await this.repository.storage
      .from("resumes")
      .getPublicUrl(path);

    return publicUrl.publicUrl;
  }
}
