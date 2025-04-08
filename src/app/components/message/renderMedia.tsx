import { attachment } from "@/app/interfaces/interfaces";
import { Box, ImageList, ImageListItem, styled } from "@mui/material";
import { useState } from "react";
import PhotoViewer from "./viewer";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { useMobileContext } from "@/app/contexts/mobileContext";
import Image from "next/image";

const StyledImageList = styled(ImageList)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  margin: 0,
  "& .MuiImageListItem-root": {
    display: "flex",
  },
}));

const MediaContainer = styled("div")({
  width: "100%",
  height: "100%",
  position: "relative",
  overflow: "hidden",
});

const MediaContent = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const VideoIndicator = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  color: "white",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  borderRadius: "50%",
  padding: theme.spacing(1),
  zIndex: 1,
}));

export const RenderMedia = ({ attachments }: { attachments: attachment[] }) => {
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [photoViewerIndex, setPhotoViewerIndex] = useState(0);

  const {
    isMobile,
    handleSetIsMobile,
    showRightSlide,
    handleSetShowRightSlide,
  } = useMobileContext();

  if (attachments === undefined || !attachments.length) return null;

  const getLayoutConfig = (count: number) => {
    switch (count) {
      case 1:
        return { cols: 1, cellHeight: 400, rowHeight: 400 };
      case 2:
        return { cols: 2, cellHeight: 200, rowHeight: 250 };
      case 3:
        return {
          cols: 3,
          cellHeight: "auto",
          rowHeight: 180,
          layout: "1fr 1fr 1fr",
        };
      case 4:
        return {
          cols: 2,
          cellHeight: "auto",
          rowHeight: 180,
          layout: "1fr 1fr",
        };
      case 5:
        // Special layout: 1 large on left, 4 small stacked on right
        return {
          cols: 6, // Using 6 columns for more precise control
          rowHeight: isMobile ? [180, 90, 90] : [240, 120, 120],
          layout: "3fr 1fr 1fr 1fr", // 3/6 for first column, 1/6 for others
          structure: [
            {
              colSpan: 3,
              rowSpan: 2,
              gridColumn: "1 / span 3",
              gridRow: "1 / span 2",
            }, // Big left item
            {
              colSpan: 3,
              rowSpan: 1,
              gridColumn: "4 / span 3",
              gridRow: "1 / span 1",
            }, // Top right
            {
              colSpan: 3,
              rowSpan: 1,
              gridColumn: "4 / span 3",
              gridRow: "2 / span 1",
            }, // Bottom right
            {
              colSpan: 3,
              rowSpan: 1,
              gridColumn: "4 / span 3",
              gridRow: "3 / span 1",
            }, // Extra if needed
            {
              colSpan: 3,
              rowSpan: 1,
              gridColumn: "4 / span 3",
              gridRow: "4 / span 1",
            }, // Extra if needed
          ],
        };
      case 6:
        return {
          cols: 3,
          cellHeight: "auto",
          rowHeight: 150,
          layout: "1fr 1fr 1fr",
        };
      case 7:
        // New fixed 2-2-3 layout
        return {
          cols: 3,
          rowHeight: [150, 150, 100],
          layout: "1fr 1fr 1fr",
          structure: [
            // Row 1
            {
              colSpan: 1,
              rowSpan: 1,
              gridColumn: "1 / span 1",
              gridRow: "1 / span 1",
            }, // Row 1 - Item 1
            {
              colSpan: 1,
              rowSpan: 1,
              gridColumn: "2 / span 1",
              gridRow: "1 / span 1",
            }, // Row 1 - Item 2

            // Row 2
            {
              colSpan: 1,
              rowSpan: 1,
              gridColumn: "1 / span 1",
              gridRow: "2 / span 1",
            }, // Row 2 - Item 1
            {
              colSpan: 1,
              rowSpan: 1,
              gridColumn: "2 / span 1",
              gridRow: "2 / span 1",
            }, // Row 2 - Item 2

            // Row 3
            {
              colSpan: 1,
              rowSpan: 1,
              gridColumn: "1 / span 1",
              gridRow: "3 / span 1",
            }, // Row 3 - Item 1
            {
              colSpan: 1,
              rowSpan: 1,
              gridColumn: "2 / span 1",
              gridRow: "3 / span 1",
            }, // Row 3 - Item 2
            {
              colSpan: 1,
              rowSpan: 1,
              gridColumn: "3 / span 1",
              gridRow: "3 / span 1",
            }, // Row 3 - Item 3
          ],
        };
      case 8:
        return {
          cols: 4,
          cellHeight: "auto",
          rowHeight: 180,
          layout: "1fr 1fr 1fr 1fr",
        };
      case 9:
        return {
          cols: 3,
          cellHeight: "auto",
          rowHeight: 180,
          layout: "1fr 1fr 1fr",
        };
      case 10:
        // Special layout: first 2 items bigger
        return {
          cols: 4,
          rowHeight: isMobile ? [100, 100, 100, 100] : [160, 160, 100, 100], // First two rows taller
          layout: "1fr 1fr 1fr 1fr",
          structure: [
            { colSpan: 2, rowSpan: 2 }, // Big item 1
            { colSpan: 2, rowSpan: 2 }, // Big item 2
            { colSpan: 1, rowSpan: 1 }, // Smaller items
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
          ],
        };
      default:
        return {
          cols: 3,
          cellHeight: "auto",
          rowHeight: 120,
          layout: "1fr 1fr 1fr",
        };
    }
  };

  const { cols, rowHeight, layout, structure } = getLayoutConfig(
    attachments.length
  );

  const renderMediaItem = (item: attachment, index: number) => {
    const isVideo = item.fileName.endsWith(".mp4");
    const config = structure?.[index] || { colSpan: 1, rowSpan: 1 };

    return (
      <ImageListItem
        key={item.fileURL || index}
        cols={config.colSpan}
        rows={config.rowSpan}
        sx={{
          "&:hover": {
            zIndex: 2,
          },
        }}
      >
        <MediaContainer>
          <MediaContent
            src={item.fileURL}
            alt=""
            loading="lazy"
            style={{
              aspectRatio: "1/1",
            }}
            onClick={() => {
              setPhotoViewerIndex(index);
              setPhotoViewerOpen(true);
            }}
          />
          {isVideo && (
            <VideoIndicator>
              <PlayCircleOutlineIcon fontSize="large" />
            </VideoIndicator>
          )}
        </MediaContainer>
      </ImageListItem>
    );
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600 }}>
      <StyledImageList
        cols={cols}
        rowHeight={Array.isArray(rowHeight) ? rowHeight[0] : rowHeight}
        gap={8}
        sx={{
          gridTemplateColumns: layout,
          gridAutoRows: Array.isArray(rowHeight) ? "min-content" : rowHeight,
          "& .MuiImageListItem-root": {
            overflow: "hidden",
            borderRadius: 1,
          },
        }}
      >
        {attachments.map((item, index) => renderMediaItem(item, index))}
      </StyledImageList>
      {attachments && attachments.length > 0 && (
        <PhotoViewer
          open={photoViewerOpen}
          onClose={() => {
            setPhotoViewerOpen(false);
            setPhotoViewerIndex(0);
          }}
          currentIndex={photoViewerIndex}
          images={attachments.map((attachment) => ({
            url: attachment.fileURL,
            caption: attachment.fileName,
          }))}
        />
      )}
    </Box>
  );
};
