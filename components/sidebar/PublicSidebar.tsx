import publicNavigationConfig from "@/config/publicNavigation";
import { LIGHT_BLUE, MEDIUM_BLUE } from "@/utils/colors";
import { Box, Button, Link, VStack } from "@chakra-ui/react";
import { usePathname } from "next/navigation"

interface PublicSidebarProps {
    sessionCode: number
}

const PublicSidebar: React.FC<PublicSidebarProps> = ({ sessionCode }) => {
    const current = usePathname();

    return (
        <VStack gap={4} align="stretch">
            {publicNavigationConfig(sessionCode).map((item) => (
                <Box key={item.title}>
                    <Link href={item.href}>
                        <Button
                            bgColor={current == item.href ? MEDIUM_BLUE : "white"}
                            _hover={{ textDecoration: "none", bgColor: current == item.href ? LIGHT_BLUE : 'gray.100' }}
                            color={current == item.href ? "white" : MEDIUM_BLUE}
                        >
                            {item.title}
                        </Button>
                    </Link>

                </Box>
            ))}
        </VStack>
    )
}

export default PublicSidebar;