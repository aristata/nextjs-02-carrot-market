import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function useUser() {
  const router = useRouter();
  const { data, error } = useSWR("/api/user/me");
  useEffect(() => {
    if (data && !data.ok) {
      router.replace("/enter");
    }
  }, [data, router]);
  return { user: data?.profile, isLoading: !data && !error };
  // const [user, setUser] = useState();
  // useEffect(() => {
  //   fetch("/api/user/me")
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
