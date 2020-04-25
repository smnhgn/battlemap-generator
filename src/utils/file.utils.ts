export const isFileEntry = (item: Entry): item is FileEntry => item.isFile;

export const isDirectoryEntry = (item: Entry): item is DirectoryEntry =>
  item.isDirectory;

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
};
