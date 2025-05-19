export async function verifyProduct(upc: string) {
    try {
      const apiUrl = process.env.VERIFY_PRODUCT_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not defined in environment variables");
      }
  
      const res = await fetch(`${apiUrl}?upc=${upc}`);
      if (!res.ok) {
        return { error: "Verification API failed" };
      }
  
      const data = await res.json();
      if (data.code !== "OK" || !data.items || data.items.length === 0) {
        return { error: "Product not verified" };
      }
  
      return { data: data.items[0] };
    } catch (err) {
      return { error: "Error verifying product" };
    }
  }
  