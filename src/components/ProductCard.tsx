"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useTransition } from "react";
import { BiLoaderAlt as SpinnerIcon } from "react-icons/bi";
import { FaStar as StarIcon } from "react-icons/fa";
import { FiShoppingCart as CartIcon } from "react-icons/fi";
import { addToCart } from "~/server/api/cart";
import { type Product } from "~/server/db/schema";
import { formatePriceForCurrency } from "~/utils/utils";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const [isPending, startTransition] = useTransition();
  const [showCheckIcon, setShowCheckIcon] = useState(false);

  async function handleAddToCart() {
    console.log("Add to cart", product);
    startTransition(async () => {
      await addToCart(product.id, 1);
      setShowCheckIcon(true);
      setTimeout(() => setShowCheckIcon(false), 2000);
    });
  }

  return (
    <div className="flex w-[300px] flex-col gap-4 overflow-hidden rounded-lg shadow-xl">
      <Image
        src={product.thumbnail}
        alt={product.name}
        width={300}
        height={300}
        className="aspect-square object-contain"
      />
      <div className="flex flex-col gap-2.5 p-4">
        <h3 className="line-clamp-1 text-lg font-medium capitalize text-zinc-600">
          {product.name}
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex w-fit items-center gap-1.5 rounded bg-green-600 px-2.5 py-1 text-xs text-white">
            4.2
            <StarIcon size={11} />
          </div>
          <span className="text-sm font-medium text-gray-400"> (1,76,161)</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xl font-semibold">
            {formatePriceForCurrency(product.discountedPrice)}
          </span>
          {product.discountedPrice !== product.originalPrice && (
            <span className="text-zinc-400 line-through">
              {formatePriceForCurrency(product.originalPrice)}
            </span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isPending || showCheckIcon}
          className="focus-visible:ring-ring text- relative mt-3 w-full rounded-md bg-zinc-900 px-4 py-3 font-medium text-white outline-none transition-colors hover:bg-zinc-900/90 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-90"
        >
          <div
            style={{ visibility: isPending ? "hidden" : "visible" }}
            className="flex w-full items-center justify-center gap-4"
          >
            {showCheckIcon ? <AnimatingCheckIcon /> : <CartIcon size={18} />}
            {showCheckIcon ? "Added!" : "Add to cart"}
          </div>
          {isPending && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <SpinnerIcon className="h-5 w-5 animate-spin" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

function AnimatingCheckIcon() {
  return (
    <svg
      className="h-5 w-5 overflow-visible text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <motion.path
        initial={{ pathLength: 0.2, scale: 1 }}
        animate={{ pathLength: 1, scale: 1.3 }}
        pathLength={0}
        strokeLinecap="round"
        strokeLinejoin="round"
        transition={{
          delay: 0.2,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export default ProductCard;
