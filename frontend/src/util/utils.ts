export function formatPrice(price:number):string  {
  if (isNaN(price) || price <= 0) return price.toString();

  const formattedPrice = price
    .toFixed(0)  
    .replace(/\B(?=(\d{3})+(?!\d))/g, ","); 


  return `${formattedPrice} ₫`;
}