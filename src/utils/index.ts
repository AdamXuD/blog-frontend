export const getTimestamp = () => {
  return Math.floor(Date.now() / 1000);
};

export const timeFormat = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export const sizeFormat = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  } else {
    return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }
};

export const generateFilename = (oldFilename: string) => {
  const getExt = (filename: string) => {
    const index = filename.lastIndexOf(".");
    return index === -1 ? "" : filename.slice(index + 1);
  };

  const randomStr = Math.random().toString(36).slice(-8);
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const filename = `${year}${month}${day}-${randomStr}.${getExt(oldFilename)}`;
  return filename;
};

export async function image2png(file: File, quality: number = 0.4) {
  return new Promise<File>((resolve, reject) => {
    const imgFile = new FileReader();
    imgFile.readAsDataURL(file);
    imgFile.onload = (e) => {
      const target = e.target;
      if (!target) {
        return reject("FileReader error");
      }
      const image = new Image();
      image.src = String(e.target.result);
      image.onload = async function () {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        if (!context) {
          return reject("Canvas error");
        }
        context.drawImage(image, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject("Canvas error");
            }
            resolve(new File([blob], "avatar.png", { type: "image/png" }));
          },
          "image/png",
          quality
        );
      };
    };
  });
}

export function generateUUID() {
  return "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/[x]/g, () => {
    return ((Math.random() * 16) | 0).toString(16);
  });
}

export function getPublicFileUrl(path: string) {
  return `${import.meta.env.VITE_BLOG_PUBLIC_PREFIX}${path}`;
}

export function isElemInView(elem: HTMLElement) {
  const viewWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const { top, right, bottom, left } = elem.getBoundingClientRect();
  return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight;
}

export function fetchWrapper(url: string, options?: RequestInit) {
  return fetch(url, options).then((res) =>
    res.ok ? res : Promise.reject(res)
  );
}
