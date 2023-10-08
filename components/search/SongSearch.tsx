import { TransformedSearchResponse } from "@/types/spotify";
import { Box, FlexProps, HStack, Image } from "@chakra-ui/react";
import { Flex, FormControl, FormHelperText, FormLabel, Text } from "@chakra-ui/react";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { ChangeEvent, useMemo, useState } from "react";
import { debounce } from "lodash";
import { trpc } from "@/utils/trpc";
import { formatMs, reduceArtists } from "@/utils/util";


interface SongSearchProps extends FlexProps {
    userId: string
}

const SongSearch: React.FC<SongSearchProps> = ({ userId, w = '40%', ...props }) => {
    const [query, setQuery] = useState<string>('');
    const { data, isRefetching, isFetched } = trpc.search.useQuery({ keywords: query, userId});

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const keywords = e.target.value;
        if(keywords.length >= 3) {
            setQuery(keywords);
        }
    } 

    const debouncedHandler = useMemo(() => debounce(changeHandler, 300), []);

    return (
        <Box w={w} {...props}>
            <FormControl >
                <AutoComplete openOnFocus>
                    <AutoCompleteInput placeholder="Search for songs..." variant="outline" onChange={debouncedHandler}/>
                    <AutoCompleteList>
                        {(isFetched || !isRefetching) && data?.map((item) => (
                            <AutoCompleteItem
                                key={`option-${item.uri}}`}
                                value={`${item.name}-${item.uri}`}
                            >
                                <HStack justifyContent={'space-between'} w='100%'>
                                    <HStack>
                                        <Image src={item.album.images[0].url} height={30} alt={`${item.name}-image`}/>
                                        <Text as='span' fontWeight={'bold'}>{item.name}</Text>
                                        <Text>- {reduceArtists(item.artists)}</Text>
                                    </HStack>
                                    <Text>{formatMs(item.duration_ms)}</Text>
                                </HStack>
                            </AutoCompleteItem>
                        ))}
                    </AutoCompleteList>
                </AutoComplete>
            </FormControl>
        </Box>
    )
}

export default SongSearch;

