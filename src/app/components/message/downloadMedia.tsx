import { Card, CardContent, Typography } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { formatFileSize } from "../../utils/formatFileSize";
import styles from "../../styles/message.module.css";
import { attachment } from "@/app/interfaces/interfaces";

export const DownloadMedia = ({
  attachments,
}: {
  attachments: attachment[];
}) => {
  return (
    <div className={styles.downloadContainer}>
      {attachments
        ?.filter((att) => att.saveAsMedia)
        .map((att) => (
          <Card
            key={att.fileURL}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: 1,
              cursor: "pointer",
              backgroundColor: "var(--bg-color-text-default)",
            }}
            onClick={() => downloadMedia(att.fileURL!)}
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
                {att.fileName}
              </Typography>
              <Typography variant="body2" color="var(--color-text-default)">
                {formatFileSize(att.fileSize)}
              </Typography>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

const downloadMedia = (url: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
