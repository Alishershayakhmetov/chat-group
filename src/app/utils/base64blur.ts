export const generateBase64Blur = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
  
          if (!ctx) return resolve("");
  
          // Resize image to a very small size (e.g., 10x10) for blur preview
          canvas.width = 10;
          canvas.height = 10;
          ctx.drawImage(img, 0, 0, 10, 10);
  
          // Convert canvas to base64
          const base64String = canvas.toDataURL("image/jpeg", 0.5); // Adjust quality as needed
          resolve(base64String);
        };
      };
    });
  };
  