import request from "./request";

const gateway = {
  addUser(params) {
    return request("/faces/index", "post", {
      image: params.image,
      fullName: params.fullName,
    });
  },

  processImage(image) {
    return request("/process", "post", { image });
  },
};

export default gateway;
