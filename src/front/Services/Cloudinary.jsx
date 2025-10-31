const CloudinaryServices = {
  uploadGroupImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "group_avatar");
    formData.append("folder", "groups");

    const res = await fetch("https://api.cloudinary.com/v1_1/ddvyou4tf/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.secure_url) {
      throw new Error(data?.error?.message || "Error uploading group image");
    }

    return data.secure_url;
  },

  uploadEventImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "imagen");
    formData.append("folder", "events");

    const res = await fetch("https://api.cloudinary.com/v1_1/ddvyou4tf/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.secure_url) {
      throw new Error(data?.error?.message || "Error uploading event image");
    }

    return data.secure_url;
  },

  uploadPerfilImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "profile");
    formData.append("folder", "user_profile");

    const res = await fetch("https://api.cloudinary.com/v1_1/ddvyou4tf/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok || !data.secure_url) {
      throw new Error(data?.error?.message || "Error uploading event image");
    }
    return data.secure_url;
  },

};

export default CloudinaryServices;
