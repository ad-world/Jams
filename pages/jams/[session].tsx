import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import SongSearch from "@/components/search/SongSearch";
import Sidebar from "@/components/sidebar/Sidebar";
import Queue from "@/lib/models/queue.model";
import { getQueueFromCode } from "@/lib/queue";
import { Status } from "@/types/generic";
import { LIGHT_BLUE } from "@/utils/colors";
import { serialize } from "@/utils/util";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { Box, Center, Flex, Heading, VStack, Text } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";

interface SessionProps {
    code: number,
    queue: Queue | null
}
export default function Session({ code, queue }: SessionProps) {
    if (!queue) {
        return (
            <Center minH='100vh' minW='100vw'>

                <VStack>
                    <Heading size='md'>Error 404: Jam not found</Heading>
                    <PrimaryButton text="Return to homepage" onClick={() => location.href = '/'} />
                </VStack>
            </Center>

        )
    }

    return (
        <Box minH={'100vh'} maxW={"100%"} mx="auto">
            <Flex minH='100vh'>
                <Box w='300px' p={8}>
                    <VStack h="100%" justifyContent={"space-between"}>
                        <div>
                            <Heading size={"2xl"} mb={2}>
                                Jams.
                            </Heading>
                            <Text mb={10}>
                                <ArrowUpIcon color={"green"} /> Session is
                                active
                            </Text>

                            <Sidebar />
                        </div>
                    </VStack>
                </Box>
                <Box flex="1" p={8} bgColor={LIGHT_BLUE}>
                    <Center bgColor={LIGHT_BLUE}>
                        <SongSearch onChoose={(uri) => console.log(uri)} userId={queue?.hostId.toString() ?? ''} />
                    </Center>
                </Box>
            </Flex>
        </Box>

    )

}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const sessionCode = context?.params?.session;

    if (typeof sessionCode == "string") {
        const numberCode = Number(sessionCode);
        const queue = await getQueueFromCode(numberCode);

        if (queue.status == Status.SUCCESS && queue.data) {
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