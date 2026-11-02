"use client";

import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { recordTutorialStep, STOCK_STATUS_LABEL, type Product } from "@/lib/api";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, isInCart } = useCart();
  const { token } = useAuth();
  const inCart = isInCart(product.id);

  if (product.stock_status !== "available") {
    return <button type="button" disabled>{STOCK_STATUS_LABEL[product.stock_status]}</button>;
  }

  return (
    <button
      type="button"
      disabled={inCart}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          thumbnail_url: product.thumbnail_url,
        });
        if (token) recordTutorialStep(token, "added_to_cart");
      }}
    >
      {inCart ? "カートに追加済み" : "カートに追加"}
    </button>
  );
}
