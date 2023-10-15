import { checkPremium } from "@/lib/spotify";
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

        if(session && session.user.isPremium == undefined) {
          const premium = await checkPremium(session?.user.id);
          if(premium) {
            session.user.isPremium = true;
          } else {
            session.user.isPremium = false;

            return {
              redirect: {
                destination: '/?error=free_user',
                statusCode: 302
              }
            }
          }
        }
    
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