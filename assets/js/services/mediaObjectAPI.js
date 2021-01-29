import axios from "axios";
import { MEDIA_OBJECT_API } from "../config";

function upload(file) {
  let formData = new FormData();
  formData.append("file", file);
  return axios.post(MEDIA_OBJECT_API, formData).then(async (response) => {
    return response;
  });
}

export default {
  upload,
};
