import { User } from "../types";
import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<
      { email: string; password: string; username: string },
      { email: string; password: string; username: string }
    >({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),

    login: build.mutation<
      { token: string },
      { email: string; password: string }
    >({
      query: (userData) => ({
        url: "/login",
        method: "POST",
        body: userData,
      }),
    }),

    current: build.query<User, void>({
      query: () => ({
        url: "/current",
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    updateUser: build.mutation<User, { userData: User; id: string }>({
      query: ({ userData, id }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useCurrentQuery,
  useLazyCurrentQuery,
  useUpdateUserMutation,
} = userApi;
export const {
  endpoints: { register, login, current, updateUser },
} = userApi;
