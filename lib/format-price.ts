

export default function formatPrice(price: number) {
   return new Intl.NumberFormat('id-ID', {
        currency: "IDR",
        style: "currency"
    }).format(price);
}