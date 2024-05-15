import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export type TFetchApiError = {
    error: string;
    details: {
        message: string
    }[]
}

export const fetchApi = async <TOutput>(url: string, options: RequestInit = {}): Promise<TOutput> => {
	const backendUrl = process.env.ENDPOINT_URL + url;

    const session = await getSession();
    let token = "";

    if(session) {
        const user = session.user;
        token = user.token;
    }

    const request = await fetch(backendUrl, {
		...options,
		headers: {
			Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            "Content-Type": "application/json",
            ...options.headers,
		},
        credentials: "same-origin",
	});

    const response = await request.json();

    if(response) {
        if (typeof response === "object") {
            if("error" in response) {
                if (response.error === "Unauthenticated") {
                    redirect("/logout");
                }
            }
        }
    }

    return response as TOutput;
};
