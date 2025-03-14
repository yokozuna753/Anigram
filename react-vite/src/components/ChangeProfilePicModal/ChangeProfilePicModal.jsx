import { useModal } from "../../context/Modal";

function ChangeProfilePicModal() {
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // user && dispatch(thunkLoadAnimeToWatchlists(user.id));

    closeModal();
  };

  return (
    <>
      <h2>Choose a new profile picture</h2>
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
