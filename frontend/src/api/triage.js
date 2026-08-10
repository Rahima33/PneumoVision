import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim() || "";
const isLocalDevApiUrl =
  /^https?:\/\/(localhost|127\.0\.0\.1):8000\/?$/.test(configuredApiUrl);
const API_URL =
  import.meta.env.PROD && isLocalDevApiUrl
    ? ""
    : configuredApiUrl.replace(/\/$/, "");

export async function runTriage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axios.post(`${API_URL}/triage`, formData);
  return data;
}
