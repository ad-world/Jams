import { ArrowUpIcon } from "@chakra-ui/icons"
import { Box, Flex, Heading, VStack, Text, HStack, ContainerProps} from "@chakra-ui/react"
import PublicSidebar from "../sidebar/PublicSidebar"
import { LIGHT_BLUE } from "@/utils/colors"

interface PublicLayoutProps extends ContainerProps {
    sessionCode: number,
    children: React.ReactNode
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ sessionCode, children, ...props }) => {
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
                                <ArrowUpIcon color={"green"} /> Session is active
                            </Text>
                            <PublicSidebar sessionCode={sessionCode} />
                        </div>
                    </VStack>
                </Box>
                <Box flex="1" bgColor={LIGHT_BLUE} {...props}>
                    {children}
                </Box>
            </Flex>
        </Box>
    )
}

export default PublicLayout;