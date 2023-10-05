import { LIGHT_BLUE, MEDIUM_BLUE } from "@/utils/colors";
import { Button, ButtonProps } from "@chakra-ui/react";

interface PrimaryButtonProps extends ButtonProps {
    text: string
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({onClick, text, ...props}) => {
    return (
        <Button
        bgColor={MEDIUM_BLUE}
        _hover={{ bgColor: LIGHT_BLUE}}
        color={'white'}
        onClick={onClick}
        {...props}
    >
        {text}
    </Button>
    )
   
}

export default PrimaryButton;