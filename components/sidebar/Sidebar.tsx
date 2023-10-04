import navigationConfig from "@/config/navigation";
import { LIGHT_BLUE, MEDIUM_BLUE } from "@/utils/colors";
import { Box, Button, VStack } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Sidebar = () => {
    const current = usePathname();

    return (
        <VStack gap={4} align="stretch">
            {navigationConfig.map((item) => (
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

    );
};

export default Sidebar;
