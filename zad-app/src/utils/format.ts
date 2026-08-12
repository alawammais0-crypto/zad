export function formatPrice(price: number): string {
  return `${price.toLocaleString('ar-SA')} ل.س`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
