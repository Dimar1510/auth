import { Avatar, Button, Spinner } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "src/app/hooks";
import { selectCurrent, selectIsAuthenticated } from "src/app/userSlice";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "src/firebase";
import { useForm } from "react-hook-form";
import { User } from "src/app/types";
import FormInput from "src/components/ui/FormInput/FormInput";
import { useUpdateUserMutation } from "src/app/services/userApi";
import { hasErrorField } from "src/utils/has-error-field";
import { FaImage } from "react-icons/fa";
import ErrorMessage from "src/components/ui/error-message/ErrorMessage";

const Profile = () => {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const [update, { isLoading, isSuccess }] = useUpdateUserMutation();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const current = useAppSelector(selectCurrent);
  const [uploadImg, setUploadImg] = useState<string | undefined>();
  const [imgLoad, setImgLoad] = useState(false);

  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file]);

  if (!current) return;

  const { handleSubmit, control } = useForm<User>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: current?.email,
      username: current?.username,
      avatar: current?.avatar,
      password: "",
    },
  });

  const handleSetFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

      if (e.target.files[0].size > 5 * 1048576) {
        setError("Maximum file size is 5Mb");
        e.target.value = "";
      } else if (!allowedExtensions.exec(e.target.value)) {
        setError("Invalid file type");
        e.target.value = "";
      } else {
        setError("");
        setFile(e.target.files[0]);
      }
    }
  };

  const handleFileUpload = () => {
    if (!file) return;
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setImgLoad(true);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUploadImg(downloadURL);
        });
        setImgLoad(false);
      }
    );
  };

  const onSubmit = async (data: User) => {
    const id = current.id;
    try {
      await update({
        userData: {
          email: data.email,
          id,
          password: data.password,
          username: data.username,
          avatar: uploadImg,
        },
        id,
      }).unwrap();
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error);
      }
    }
  };

  if (current)
    return (
      <div className="flex flex-col items-center mt-10 gap-4">
        <h2>Profile</h2>

        <Avatar
          isBordered
          className="transition-transform"
          size="lg"
          src={
            uploadImg
              ? uploadImg
              : current?.avatar
              ? current.avatar
              : "src/assets/images/profile.png"
          }
        />
        <ErrorMessage error={error} />
        <form
          className="flex flex-col items-center gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {imgLoad ? (
            <Spinner />
          ) : (
            <>
              <input
                hidden
                type="file"
                id="file"
                accept="image/*"
                onChange={handleSetFile}
                required={false}
              />

              <label
                htmlFor={"file"}
                className="cursor-pointer flex items-center gap-2 ml-2 p-2 rounded-xl border border-default-500"
              >
                <FaImage />
                Upload avatar
              </label>
            </>
          )}

          <div className="break-all">
            {file &&
              !imgLoad &&
              "File uploaded successfully, now click Update to finish"}
          </div>
          <div className="flex flex-col gap-4">
            <FormInput
              control={control}
              name="email"
              label="Email"
              type="email"
              required="Field required"
            />
            <FormInput
              control={control}
              name="username"
              label="Username"
              type="text"
              required="Field required"
            />
            <FormInput
              control={control}
              name="password"
              label="Password"
              type="password"
            />
            <Button isLoading={isLoading} type="submit">
              Update
            </Button>
          </div>
          {isSuccess && !isLoading && (
            <p className="text-success-400">User successfully updated!</p>
          )}
        </form>
      </div>
    );
};

export default Profile;
