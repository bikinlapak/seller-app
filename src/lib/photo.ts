/*
 * On-device photo preparation (PRD §11 Privacy, FR-32): resize to at most
 * 1600 px and re-encode through a canvas. Re-encoding writes only pixels, so
 * EXIF — GPS included — never leaves the phone. seller-svc strips metadata
 * again as a second line of defence.
 */

export const MAX_EDGE = 1600;

export async function prepare(file: File, maxEdge = MAX_EDGE): Promise<Blob> {
	const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
	const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
	const canvas = document.createElement('canvas');
	canvas.width = Math.round(bitmap.width * scale);
	canvas.height = Math.round(bitmap.height * scale);
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('no 2d context');
	ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
	bitmap.close();
	const blob = await new Promise<Blob | null>((resolve) =>
		canvas.toBlob(resolve, 'image/jpeg', 0.85)
	);
	if (!blob) throw new Error('could not encode');
	return blob;
}
