export const isFileEntry = (item: Entry): item is FileEntry => item.isFile;

export const isDirectoryEntry = (item: Entry): item is DirectoryEntry =>
  item.isDirectory;
