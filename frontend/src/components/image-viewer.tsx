"use client";

import { useRef, useEffect } from "react";

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Element {
  id: string;
  semantic_role: string | null;
  bounding_box: BoundingBox;
}

interface ImageViewerProps {
  imageSrc: string;
  elements: Element[];
  selectedElementId?: string | null;
  onElementClick?: (id: string) => void;
}

const roleColors: Record<string, string> = {
  headline: "#3b82f6",
  cta: "#ef4444",
  brand: "#10b981",
  offer: "#f59e0b",
  legal: "#6b7280",
};

export function ImageViewer({
  imageSrc,
  elements,
  selectedElementId,
  onElementClick,
}: ImageViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      elements.forEach((el) => {
        const bb = el.bounding_box;
        const color = roleColors[el.semantic_role || ""] || "#6b7280";
        const isSelected = el.id === selectedElementId;

        ctx.strokeStyle = color;
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.strokeRect(bb.x, bb.y, bb.width, bb.height);

        if (el.semantic_role) {
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.8;
          ctx.fillRect(bb.x, bb.y - 18, ctx.measureText(el.semantic_role).width + 8, 18);
          ctx.globalAlpha = 1;
          ctx.fillStyle = "#fff";
          ctx.font = "12px sans-serif";
          ctx.fillText(el.semantic_role, bb.x + 4, bb.y - 5);
        }
      });
    };
    img.src = imageSrc;
  }, [imageSrc, elements, selectedElementId]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onElementClick || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const clicked = elements.find((el) => {
      const bb = el.bounding_box;
      return x >= bb.x && x <= bb.x + bb.width && y >= bb.y && y <= bb.y + bb.height;
    });
    if (clicked) onElementClick(clicked.id);
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className="w-full h-auto rounded-lg border border-gray-200 cursor-crosshair"
    />
  );
}
