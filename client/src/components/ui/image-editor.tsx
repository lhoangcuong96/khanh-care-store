"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDebounceEffect } from "@/hooks/use-debounced-effect";
import {
  FlipHorizontal,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import * as React from "react";
import ReactCrop, { PixelCrop, type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { canvasPreview } from "./canvas-preview";
import Image from "next/image";

interface ImageEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onSave: (editedImage: string) => void;
}

export function ImageEditor({
  open,
  onOpenChange,
  imageUrl,
  onSave,
}: ImageEditorProps) {
  const [crop, setCrop] = React.useState<Crop>();
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [flip, setFlip] = React.useState({
    horizontal: false,
    vertical: false,
  });

  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>();

  const imageRef = React.useRef<HTMLImageElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = React.useRef<HTMLCanvasElement>(null);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.1));
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFlipHorizontal = () => {
    setFlip((prev) => ({ ...prev, horizontal: !prev.horizontal }));
  };

  const handleReset = () => {
    setCrop(undefined);
    setZoom(1);
    setRotation(0);
    setFlip({ horizontal: false, vertical: false });
    if (imageRef.current) {
      const width = imageRef.current.width;
      const height = (width * 3) / 4;
      setCrop({
        unit: "px",
        width,
        height,
        x: 0,
        y: 0,
      });
    }
  };

  const handleSave = () => {
    if (!imageRef.current || !canvasRef.current || !crop) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match the crop dimensions
    canvas.width = crop.width;
    canvas.height = crop.height;

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Draw the cropped image
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    ctx.restore();

    onSave(canvas.toDataURL());
    onOpenChange(false);
  };

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imageRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imageRef.current,
          previewCanvasRef.current,
          completedCrop,
          zoom,
          rotation
        );
      }
    },
    100,
    [completedCrop, zoom, rotation]
  );

  React.useEffect(() => {
    if (open && imageRef.current) {
      const width = imageRef.current.width;
      const height = (width * 3) / 4;
      setCrop({
        unit: "px",
        width,
        height,
        x: 0,
        y: 0,
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hình ảnh sản phẩm</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-[1fr_200px] gap-4">
          <div className="space-y-4">
            <div className="relative border rounded-lg overflow-hidden bg-neutral-100">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={4 / 3}
                onComplete={(c) => setCompletedCrop(c)}
                className="max-h-[600px]"
              >
                <Image
                  ref={imageRef}
                  src={imageUrl}
                  alt="Edit"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg) scaleX(${
                      flip.horizontal ? -1 : 1
                    }) scaleY(${flip.vertical ? -1 : 1})`,
                    transformOrigin: "center",
                    maxWidth: "100%",
                    height: "auto",
                  }}
                  width={600}
                  height={800}
                  layout="responsive"
                />
              </ReactCrop>
            </div>
          </div>
          <div className="space-y-4">
            <div className="font-medium">Xem trước</div>
            <div
              className="border rounded-lg overflow-hidden bg-neutral-100"
              style={{ height: 200 * 0.75 }}
            >
              <canvas
                ref={previewCanvasRef}
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Thu nhỏ</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Phóng to</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRotateLeft}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Xoay trái</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRotateRight}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Xoay phải</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFlipHorizontal}
                >
                  <FlipHorizontal className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Lật</TooltipContent>
            </Tooltip>
            <Button variant="outline" onClick={handleReset} className="ml-2">
              Nhập Lại
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
            <Button onClick={handleSave}>Lưu</Button>
          </div>
        </div>
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </DialogContent>
    </Dialog>
  );
}
