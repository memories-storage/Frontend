/**
 * Utility functions for file type detection and handling
 */

export const isVideoFile = (url) => {
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
};

export const isImageFile = (url) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  return imageExtensions.some(ext => url.toLowerCase().includes(ext));
};

export const getFileType = (url, type) => {
  if (type === 'folder') return 'folder';
  if (isVideoFile(url)) return 'video';
  if (isImageFile(url)) return 'image';
  return 'file';
};

export const getFileName = (url, type, name) => {
  if (type === 'folder') return name;
  return url.split('/').pop();
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const groupFilesByDate = (files) => {
  const grouped = {};
  files.forEach(file => {
    const date = file.uploadDateString;
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(file);
  });
  return grouped;
};

export const sortDatesDescending = (dates) => {
  return dates.sort((a, b) => new Date(b) - new Date(a));
}; 