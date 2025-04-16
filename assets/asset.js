import ASSETS from "../public/list.json";
import { download } from "flyscrape/http";

function getFileExtension(url) {
  const cleanUrl = url.split(/[?#]/)[0];
  const parts = cleanUrl.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

export const config = {
  urls: ASSETS.Data.LIST.map((a) => a.LOGO_URL),
  concurrency: 25,
  cache: "file",
};

export default function ({ doc, url, absoluteURL }) {
  const asset = ASSETS.Data.LIST.find((asset) => asset.LOGO_URL === url);
  download(url, `${asset.SYMBOL}.${getFileExtension(url)}`);

  return {
    img: `${asset.SYMBOL}.${getFileExtension(url)}`,
  };
}
