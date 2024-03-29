import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";
import useUser from "@libs/client/useUser";
import { useEffect, useState } from "react";
import useMutation from "@libs/client/useMutation";

interface EditProfileForm {
  email?: string;
  phone?: string;
  name?: string;
  avatar?: FileList;
  formErrors?: string;
}
interface EditProfileResponse {
  ok: boolean;
  errorMessage?: string;
}
const EditProfile: NextPage = () => {
  const { user } = useUser();
  const [avatarPreviewURL, setAvatarPreviewURL] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors }
  } = useForm<EditProfileForm>();
  useEffect(() => {
    if (user?.name) setValue("name", user.name);
    if (user?.email) setValue("email", user.email);
    if (user?.phone) setValue("phone", user.phone);
    if (user?.avatar) setAvatarPreviewURL(user.avatar);
  }, [user, setValue]);
  const [editProfile, { data, loading }] =
    useMutation<EditProfileResponse>(`/api/users/me`);
  const onValid = async ({ email, phone, name, avatar }: EditProfileForm) => {
    if (loading) return;
    if (name === "" && email === "" && phone === "") {
      return setError("formErrors", {
        message: "name, email 그리고 phone 중 하나는 반드시 입력해야 합니다."
      });
    }
    // 아바타 처리
    if (avatar && avatar.length > 0 && user) {
      // 1. Cloud Flare 에 URL 요청하기
      const { uploadURL } = await (await fetch(`/api/files`)).json();

      // 2. URL 에 파일 업로드 하기
      const imageForm = new FormData();
      const fileName = `${user.id}_${Date.now()}`;
      imageForm.append("file", avatar[0], fileName);
      const {
        result: { id }
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: imageForm
        })
      ).json();

      const avatarUrl = `https://imagedelivery.net/lsllCjR7DyIdCm2ctTC0DQ/${id}/avatar`;
      editProfile({ name, email, phone, avatarUrl });
    } else {
      editProfile({ name, email, phone });
    }
  };
  useEffect(() => {
    if (data && !data.ok && data.errorMessage) {
      setError("formErrors", { message: data.errorMessage });
    }
  }, [data, setError]);

  const avatar = watch("avatar");
  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      setAvatarPreviewURL(URL.createObjectURL(file));
    }
  }, [avatar]);
  return (
    <Layout canGoBack title="Edit Profile">
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          {avatarPreviewURL ? (
            <img
              src={avatarPreviewURL}
              className="w-14 h-14 rounded-full bg-slate-500"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-500" />
          )}

          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("name")}
          required={false}
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("email")}
          required={false}
          label="Email address"
          name="email"
          type="email"
        />
        <Input
          register={register("phone")}
          required={false}
          label="Phone number"
          name="phone"
          type="text"
          kind="phone"
        />
        {errors.formErrors ? (
          <span className="my-2 text-red-500 text-center font-medium block">
            {errors.formErrors.message}
          </span>
        ) : null}
        <Button loading={loading} text="Update profile" />
      </form>
    </Layout>
  );
};

export default EditProfile;
