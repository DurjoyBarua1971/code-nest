import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { ActivityLogEntry } from "./types";
import createClientForBrowser from "./supabase/client";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SITE_URL}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const supabase = createClientForBrowser();

export async function getCurrentUsername(): Promise<string | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log("Current user:", user);

  if (error || !user) {
    console.error("Failed to get user:", error);
    return null;
  }

  return user.user_metadata?.username || user.email || null;
}

export async function logActivity({
  user,
  problemName,
  action,
}: {
  user: string;
  problemName: string;
  action: "created" | "edited" | "deleted";
}) {
  const entry: Omit<ActivityLogEntry, "id"> = {
    user,
    problemName,
    action,
    date: new Date().toISOString(),
  };
  try {
    await api.post("/activityLog", entry);
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

// api.interceptors.response.use(
//   async (response) => {
//     if (
//       response.config.method === "get" &&
//       response.config.params?._page &&
//       response.config.params?._limit
//     ) {
//       let totalCount = response.headers["x-total-count"];

//       if (!totalCount) {
//         try {
//           const fullResponse = await axios.get(
//             `${response.config.baseURL}${response.config.url}`,
//             {
//               ...response.config,
//               params: {
//                 ...response.config.params,
//                 _page: undefined,
//                 _limit: undefined,
//               },
//             }
//           );
//           totalCount = fullResponse.data.length;
//           response.headers["x-total-count"] = totalCount.toString();
//         } catch (error) {
//           console.error("Error fetching total count:", error);
//           response.headers["x-total-count"] = "0";
//         }
//       }
//     }
//     return response;
//   },
//   (error) => Promise.reject(error)
// );
