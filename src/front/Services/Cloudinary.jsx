const Cloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "group_avatar");

    const res = await fetch("https://api.cloudinary.com/v1_1/ddvyou4tf/image/upload", {
        method: "POST",
        body: formData,
    });

    const data = await res.json();
    return data.secure_url;
};

export default Cloudinary;