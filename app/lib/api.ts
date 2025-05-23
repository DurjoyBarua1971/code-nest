import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SITE_URL}`,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

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
