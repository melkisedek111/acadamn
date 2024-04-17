import { redirect, RedirectType, useRouter, useSearchParams } from "next/navigation";
import LoginForm from "./login-form";
import { getSession } from "@/lib/auth";

const Login = async (props: any) => {
    const session = await getSession();
    
    if(session) {
        redirect("/dashboard", RedirectType.push);
    }

    return (
        <div className="mt-28">
            <LoginForm />
        </div>
    )
}


export default Login;