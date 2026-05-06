import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login", // redirect here if unauthenticated
    },
});

export const config = {
    matcher: ["/:path*"],
};