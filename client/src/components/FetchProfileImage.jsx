import axios from "axios";

const fetchProfileImage = async (user_id) => {
    if (user_id) {
        try {
            const response = await axios.get(`http://localhost:3000/api/profile-image/${user_id}`);
            console.log("Response:", response);
            if (response.data.success) {
                return response.data.imagePath
            } else {
                return '/defaultProfileImage.png'
            }
        } catch (error) {
            console.log("Error al cargar la imagen de perfil:", error);
            return '/defaultProfileImage.png'
        }
    }
};

export default fetchProfileImage;