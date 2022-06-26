import { Box, Flex, HStack, VStack } from '@chakra-ui/react';
import React from 'react'
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/user/atom';

export default function SpeechBubble({ msg }) {
    const { content, sender, timestamp, sender_name } = msg;
    const { id, userName } = useRecoilValue(userState);
    console.log(msg);
    return (
        <Flex
            gap={2}
            direction='row'
            maxW='50%'
            alignSelf={sender === id ? 'flex-end' : 'flex-start'}>
            {sender === id ? null : <Avatar
                order={3}//{sender === id ? 3 : 1}
                name={sender_name}
                bg={sender === id ? 'green.300' : 'green.100'} />}
            <Box
                p='3rem'
                flexGrow={1}
                overflow='hidden'
                order={2}
                alignSelf={sender === id ? 'flex-end' : 'flex-start'}
                bg={sender === id ? 'green.300' : 'green.100'}>
                {content}
            </Box>
        </Flex >
    );
}

function Avatar(props) {
    const { name, bg } = props;

    return (
        <VStack>
            <Box w='2rem' h='2rem' borderRadius='full' bg={bg}>
                {name.charAt(0).toUpperCase()}
            </Box>
            <h5>{name}</h5>
        </VStack>

    );
}