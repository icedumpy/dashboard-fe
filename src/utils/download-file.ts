export const downloadFile = (data: Blob, fileName: string) => {
  const link = document.createElement("a");
  const url = window.URL.createObjectURL(data);
  link.href = url;
  link.download = fileName;
  link.click();
  link.remove();
};
