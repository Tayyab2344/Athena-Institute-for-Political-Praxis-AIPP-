export type OperationalUploadFolder =
  | "aipp/publications/covers"
  | "aipp/publications/documents"
  | "aipp/journals/covers"
  | "aipp/journals/documents"
  | "aipp/authors/avatars";

export type ApprovedMediaFolder =
  | OperationalUploadFolder
  | "aipp/test/phase7-1"
  | "aipp/test/phase7-2";

export const OPERATIONAL_UPLOAD_FOLDERS: readonly OperationalUploadFolder[] = [
  "aipp/publications/covers",
  "aipp/publications/documents",
  "aipp/journals/covers",
  "aipp/journals/documents",
  "aipp/authors/avatars"
];

export const OPERATIONAL_IMAGE_FOLDERS: readonly OperationalUploadFolder[] = [
  "aipp/publications/covers",
  "aipp/journals/covers",
  "aipp/authors/avatars"
];

export const OPERATIONAL_DOCUMENT_FOLDERS: readonly OperationalUploadFolder[] = [
  "aipp/publications/documents",
  "aipp/journals/documents"
];

export const APPROVED_MEDIA_FOLDERS: readonly ApprovedMediaFolder[] = [
  ...OPERATIONAL_UPLOAD_FOLDERS,
  "aipp/test/phase7-1",
  "aipp/test/phase7-2"
];

export const ASSOCIABLE_MEDIA_FOLDERS: readonly string[] = [
  ...APPROVED_MEDIA_FOLDERS,
  "aipp/test/phase7-3",
  "aipp/test/phase7-3-1",
  "aipp/test/phase7-4"
];

export const MEDIA_FOLDER_LABELS: Record<string, string> = {
  "aipp/publications/covers": "Publication Covers",
  "aipp/publications/documents": "Publication Documents",
  "aipp/journals/covers": "Journal & Issue Covers",
  "aipp/journals/documents": "Journal Issue PDFs",
  "aipp/authors/avatars": "Author Portraits",
  "aipp/test/phase7-1": "Test Archive (Phase 7.1)",
  "aipp/test/phase7-2": "Test Archive (Phase 7.2)",
  "aipp/test/phase7-3": "Test Archive (Phase 7.3)",
  "aipp/test/phase7-3-1": "Test Archive (Phase 7.3.1)",
  "aipp/test/phase7-4": "Test Archive (Phase 7.4)"
};

export function isApprovedMediaFolder(folder: string): folder is ApprovedMediaFolder {
  return (APPROVED_MEDIA_FOLDERS as readonly string[]).includes(folder);
}

export function isAssociableMediaFolder(folder: string): boolean {
  return ASSOCIABLE_MEDIA_FOLDERS.includes(folder);
}

export function getMediaFolderLabel(folder: string): string {
  return MEDIA_FOLDER_LABELS[folder] || folder;
}
