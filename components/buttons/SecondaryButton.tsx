import { LIGHT_BLUE, LIGHT_PURPLE, MEDIUM_BLUE } from "@/utils/colors";
import { Button, ButtonProps } from "@chakra-ui/react";

interface SecondaryButtonProps extends ButtonProps {
    text: string
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({onClick, text, ...props}) => {
    return (
        <Button
        bgColor={LIGHT_BLUE}
        _hover={{ bgColor: LIGHT_PURPLE}}
        color={'white'}
        onClick={onClick}
        {...props}
    >
        {text}
    </Button>
    )
   
}

export default SecondaryButton;