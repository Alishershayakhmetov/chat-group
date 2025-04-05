"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Modal,
  Box,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import {
  Close,
  ZoomIn,
  ZoomOut,
  NavigateBefore,
  NavigateNext,
} from "@mui/icons-material";

interface PhotoViewerProps {
  images: {
    url: string;
    caption?: string;
  }[];
  currentIndex: number;
  open: boolean;
  onClose: () => void;
}

export const PhotoViewer = ({
  images,
  currentIndex,
  open,
  onClose,
}: PhotoViewerProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [index, setIndex] = useState(currentIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset when image changes or modal opens
  useEffect(() => {
    if (open) {
      setIndex(currentIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      showControlsWithTimeout();
    }
  }, [open, currentIndex]);

  const showControlsWithTimeout = () => {
    setShowControls(true);
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 1000);
  };

  const handleInteraction = () => {
    showControlsWithTimeout();
  };

  const handleNext = () => {
    handleInteraction();
    if (index < images.length - 1) {
      setIndex(index + 1);
    }
  };

  const handlePrev = () => {
    handleInteraction();
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const handleZoomIn = () => {
    handleInteraction();
    setScale(Math.min(scale + 0.5, 7));
  };

  const handleZoomOut = () => {
    handleInteraction();
    if (Math.max(scale - 0.5, 1) === 1) {
      setPosition({ x: 0, y: 0 });
    }
    setScale(Math.max(scale - 0.5, 1));
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale(Math.min(Math.max(scale + delta, 1), 3));
    }
  };

  // Mouse/touch event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    handleInteraction();
    if (scale > 1) {
      e.preventDefault();
      setIsDragging(true);
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale > 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setStartPos({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    } else {
      // Allow swipe gestures between images when not zoomed
      setIsDragging(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - startPos.x,
        y: touch.clientY - startPos.y,
      });
    }
  };

  const handleDoubleClick = () => {
    setScale(scale === 1 ? 2 : 1);
    if (scale !== 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const keyDownHandler = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case "ArrowRight":
          handleNext();
          break;
        case "ArrowLeft":
          handlePrev();
          break;
        case "Escape":
          onClose();
          break;
        case "+":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
        default:
          break;
      }
    },
    [open, index, scale]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [keyDownHandler]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
      }}
    >
      <Box
        ref={containerRef}
        sx={{
          outline: "none",
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(0, 0, 0, 0.9)",
          cursor: isDragging ? "grabbing" : scale > 1 ? "grab" : "default",
          userSelect: "none",
        }}
        onClick={handleInteraction}
        onMouseMove={handleInteraction}
      >
        {/* Close Button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 2,
            bgcolor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            transition: "opacity 0.3s ease",
            opacity: showControls ? 1 : 0,
            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
          }}
        >
          <Close />
        </IconButton>

        {/* Navigation Arrows */}
        {index > 0 && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              bgcolor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              transition: "opacity 0.3s ease",
              opacity: showControls ? 1 : 0,
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
            }}
          >
            <NavigateBefore fontSize={isMobile ? "medium" : "large"} />
          </IconButton>
        )}

        {index < images.length - 1 && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              bgcolor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              transition: "opacity 0.3s ease",
              opacity: showControls ? 1 : 0,
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
            }}
          >
            <NavigateNext fontSize={isMobile ? "medium" : "large"} />
          </IconButton>
        )}

        {/* Zoom Controls (top-center) */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1,
            zIndex: 2,
            bgcolor: "rgba(0, 0, 0, 0.5)",
            borderRadius: 2,
            p: 1,
            transition: "opacity 0.3s ease",
            opacity: showControls ? 1 : 0,
          }}
        >
          <IconButton
            onClick={handleZoomOut}
            disabled={scale <= 1}
            sx={{ color: "white" }}
          >
            <ZoomOut />
          </IconButton>
          <IconButton
            onClick={handleZoomIn}
            disabled={scale >= 7}
            sx={{ color: "white" }}
          >
            <ZoomIn />
          </IconButton>
        </Box>

        {/* Image Counter (top-left) */}
        {images.length > 1 && (
          <Typography
            variant="body1"
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 2,
              bgcolor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              transition: "opacity 0.3s ease",
              opacity: showControls ? 1 : 0,
            }}
          >
            {index + 1} / {images.length}
          </Typography>
        )}

        {/* Image Name (bottom-center) */}
        {images[index].caption && (
          <Typography
            variant="body1"
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2,
              color: "white",
              textAlign: "center",
              maxWidth: "80%",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              px: 2,
              py: 1,
              borderRadius: 2,
              transition: "opacity 0.3s ease",
              opacity: showControls ? 1 : 0,
            }}
          >
            {images[index].caption}
          </Typography>
        )}

        {/* Image container */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={(e) => {
            handleMouseMove(e);
            // handleMouseMove(); // Also trigger controls visibility
          }}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          onWheel={handleWheel}
        >
          <Image
            src={images[index].url}
            alt={images[index].caption || "Enlarged photo"}
            fill
            style={{
              objectFit: "contain",
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              transition: isDragging ? "none" : "transform 0.2s ease",
              pointerEvents: "none",
            }}
            draggable={false}
            unoptimized
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default PhotoViewer;
