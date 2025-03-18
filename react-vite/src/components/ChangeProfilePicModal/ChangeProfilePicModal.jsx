import { useModal } from "../../context/Modal";
import { thunkDeleteImage, thunkUploadImages } from "../../redux/images";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

function ChangeProfilePicModal() {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const file_info = e.target[0].files[0];

    // const image = {
    // name: file_info.name,
    // size: file_info.size,
    // type: file_info.type,
    // };
    user && dispatch(thunkUploadImages(user.id, file_info));

    closeModal();
  };

  function handlePicDelete(e) {
    e.preventDefault();
    user && dispatch(thunkDeleteImage(user.id));
    closeModal();
  }

  return (
    <>
      <h3>
        Choose a new profile picture OR{" "}
        <button onClick={handlePicDelete}>Delete</button>
      </h3>
      <form onSubmit={handleSubmit}>
        <label>
          File Type
          <input type="file" />
        </label>
        <button type="submit" style={{ cursor: "pointer" }}>
          Submit
        </button>
      </form>
    </>
  );
}

export default ChangeProfilePicModal;


