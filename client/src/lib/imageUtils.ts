export interface Company {
  logoUrl?: string | null;
  logoThumbnailUrl?: string | null;
  galleryImages?: string[] | null;
  galleryThumbnails?: string[] | null;
}

export function getLogoUrl(company: Company, useThumbnail: boolean = true): string | null {
  if (useThumbnail && company.logoThumbnailUrl) {
    return company.logoThumbnailUrl;
  }
  return company.logoUrl || null;
}

export function getGalleryImages(company: Company, useThumbnails: boolean = true): string[] {
  if (useThumbnails && company.galleryThumbnails && company.galleryThumbnails.length > 0) {
    return company.galleryThumbnails;
  }
  return company.galleryImages || [];
}

export function getGalleryFullImages(company: Company): string[] {
  return company.galleryImages || [];
}

export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
}

export function isLocalStorageUrl(url: string): boolean {
  return url.startsWith('/objects/') || url.startsWith('data:image/');
}

export function getOptimizedImageLoading(index: number): "eager" | "lazy" {
  return index === 0 ? "eager" : "lazy";
}
