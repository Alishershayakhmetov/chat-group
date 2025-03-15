import Image from "next/image";
import styles from "../styles/message.module.css";
import { attachment, message } from "../interfaces/interfaces";
import { extractTime } from "../utils/formatDate";
import UserImage from "./userImage";
import { Card, CardContent, Typography } from "@mui/material";
import { formatFileSize } from "../utils/formatFileSize";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

export const Message = ({ data }: { data: message }) => {
  console.log(data);
  return (
    <div className={styles.messageBox}>
      <div className={styles.profileImageBox}>
        <UserImage
          src={data.imgURL}
          alt="profile image"
          width={32}
          height={32}
        />
      </div>
      <div className={styles.rightBox}>
        <div className={styles.contentBox}>
          <div className={`${styles.relative} ${styles.messageHeader}`}>
            <span>{data.userName}</span>
            <span className={styles.time}>{extractTime(data.updatedAt)}</span>
          </div>

          {/* Render Media */}
          <RenderMedia attachments={data.attachments} />

          {/* <pre>{data.text}</pre> */}

          <Typography variant="body2" gutterBottom>
            {data.text}
          </Typography>

          {/* Download Media */}
          <DownloadMedia attachments={data.attachments} />
        </div>
      </div>
    </div>
  );
};

const RenderMedia = ({ attachments }: { attachments: attachment[] }) => {
  console.log(`check Attach: ${attachments}`);
  return (
    <div className={styles.mediaContainer}>
      {attachments
        .filter((attachment) => !attachment.saveAsMedia)
        .map((attachment, index) => (
          <div key={index} className={styles.mediaItem}>
            <MediaComponent
              url={attachment.fileURL}
              name={attachment.fileName}
            />
          </div>
        ))}
    </div>
  );
};

const DownloadMedia = ({ attachments }: { attachments: attachment[] }) => {
  return (
    <div className={styles.downloadContainer}>
      {attachments
        .filter((attachment) => attachment.saveAsMedia)
        .map((attachment) => (
          <Card
            key={attachment.fileURL}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: 1,
              cursor: "pointer",
              backgroundColor: "var(--bg-color-text-default)",
            }}
            onClick={() => downloadMedia(attachment.fileURL!)}
          >
            <InsertDriveFileIcon
              sx={{
                fontSize: 34,
                color: "var(--color-text-default)",
              }}
            />
            <CardContent
              sx={{ flex: 1, padding: "0", paddingBottom: "0 !important" }}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ color: "var(--color-text-default)" }}
              >
                {attachment.fileName}
              </Typography>
              <Typography variant="body2" color="var(--color-text-default)">
                {formatFileSize(attachment.fileSize)}
              </Typography>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

const MediaComponent = ({ url, name }: { url: string; name: string }) => {
  console.log(url, name);
  // Render the appropriate media type (image, video, etc.)
  if (name.endsWith(".mp4")) {
    return <video controls src={url} className={styles.video} />;
  } else if (name.endsWith(".jpg") || name.endsWith(".png")) {
    return <Image src={url} alt="Media" width={200} height={200} />;
  }
  return <a href={url}>View Media</a>;
};
/*
const downloadMedia = async (url: string, name: string) => {
  try {
    // Fetch the file as a Blob
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to download file");
    }

    const blob = await response.blob();

    // Create a temporary URL for the Blob
    const blobUrl = URL.createObjectURL(blob);

    // Create a link element and trigger the download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = name || "download"; // Use the file name from the URL or a default name
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};
*/
const downloadMedia = (url: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
