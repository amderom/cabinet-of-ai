/**
 * Link-preview images (the picture LinkedIn shows on a shared link). One per open
 * exhibit, named by `preview` in its exhibit.yaml, plus one for the site. Each is
 * made once at LinkedIn's recommended size; the build stops if one is not.
 * See ADR 007.
 */

export const PREVIEW_SIZE = { width: 1200, height: 627 } as const;

interface ImageFile {
  src: string;
  width: number;
  height: number;
}

export interface PreviewImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** The image tags' data, or a build error naming who needs fixing and how. */
export function previewImage(
  credit: { file?: ImageFile; alt?: string } | undefined,
  owner: string,
): PreviewImage | undefined {
  if (!credit) return undefined;
  const { file, alt } = credit;
  if (!file) throw new Error(`"${owner}": the preview credit has no image file`);
  if (!alt?.trim()) throw new Error(`"${owner}": the preview image needs alt text`);
  if (file.width !== PREVIEW_SIZE.width || file.height !== PREVIEW_SIZE.height) {
    throw new Error(
      `"${owner}": the preview image is ${file.width} × ${file.height}; it must be ${PREVIEW_SIZE.width} × ${PREVIEW_SIZE.height}`,
    );
  }
  return { src: file.src, alt, width: file.width, height: file.height };
}
