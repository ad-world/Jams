import navigationConfig from "@/config/navigation";
import { MAIN_PURPLE } from "@/utils/colors";
import { Box, Button, Link, VStack } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
    const current = usePathname();

    return (
        <VStack gap={4} align="stretch">
            {navigationConfig.map((item) => (
                <Box key={item.title}>
                    <Link
                        as={Button}
                        bgColor={current == item.href ? MAIN_PURPLE : "white"}
                        _hover={{ textDecoration: "none" }}
                        color={current == item.href ? "white" : MAIN_PURPLE}
                        href={item.href}
                    >
                        {item.title}
                    </Link>
                </Box>
            ))}
        </VStack>

    );
};

export default Sidebar;
