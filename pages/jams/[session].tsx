import Queue from "@/lib/models/queue.model";
import { getQueueFromCode } from "@/lib/queue";
import { Status } from "@/types/generic";
import { serialize } from "@/utils/util";
import { GetServerSidePropsContext } from "next";

interface SessionProps {
    code: number,
    queue: Queue | null
}
export default function Session( {code, queue} : SessionProps) {
    return <div>{queue ? 'Found queue' : 'Did not find queue'}</div>
    
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const sessionCode = context?.params?.session;
    
    if(typeof sessionCode == "string") {
        const numberCode = Number(sessionCode);
        const queue = await getQueueFromCode(numberCode);

        if(queue.status == Status.SUCCESS && queue.data) {
            const serialized = serialize(queue.data);
            return {
                props: {
                    code: numberCode,
                    queue: serialized
                }
            }
        }
    }

    return {
        props: {
            code: Number(sessionCode),
            queue: null
        }
    }
}