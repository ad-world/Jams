import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { ContextMenu } from "@blueprintjs/core";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

export const requireAuth = (gssp: GetServerSideProps) => {
    return async (context: GetServerSidePropsContext) => {
        const { req, res } = context;
        const session = await getServerSession(
            req,
            res,
            authOptions
        );
    
      if(!session) {
        return {
          redirect: {
            destination: '/',
            statusCode: 302
          },
        }
      }

      return await gssp(context);
    }
}