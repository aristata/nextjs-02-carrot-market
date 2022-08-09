import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface ProfileResponse {
  ok: boolean;
  profile: User;
}

export default function useUser() {
  const router = useRouter();
  const { data, error } = useSWR<ProfileResponse>("/api/users/me");
  useEffect(() => {
    if (data && !data.ok && router.pathname !== "/enter") {
      router.replace("/enter");
    }
  }, [data, router]);
  return { user: data?.profile, isLoading: !data && !error };
  // const [user, setUser] = useState();
  // useEffect(() => {
  //   fetch("/api/users/me")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (!data.ok) {
  //         return router.push("/enter");
  //       }
  //       setUser(data.profile);
  //     });
  // }, [router]);
  // return user;
}
