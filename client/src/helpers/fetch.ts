import { getSession } from "@/lib/auth";
import { signOut } from "next-auth/react";
import { revalidatePath } from "next/cache";
import { cookies } from 'next/headers';
import { redirect, RedirectType } from "next/navigation";

type TFetchApiError = {
    error: string;
    details: {
        message: string
    }[]
}

export const fetchApi = async <TOutput>(url: string, options: RequestInit = {}): Promise<TOutput & TFetchApiError> => {
	const backendUrl = process.env.ENDPOINT_URL + url;
    const session = await getSession();
    let token = ""
    if(session) {
        const user = session.user;
        token = user.token;
    }

    const request = await fetch(backendUrl, {
		...options,
		headers: {
			...options.headers,
			Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            "Content-Type": "application/json",
		},
        credentials: "same-origin",
	});

    const response = await request.json();

    if(response.error) {
        const cookieStore = cookies();
        // console.log(cookieStore.getAll())
        // await fetch("http://localhost:3000/api/auth/logout", {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json"
        //     }
        // });
        // revalidatePath("/login");
        // redirect("/login")
    }

    return response;
};
