import { Avatar, Box, Flex, Text, VStack } from '@chakra-ui/react';
import React from 'react'
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/user/atom';

export default function SpeechBubble({ msg }) {
    const { content, sender, timestamp, sender_name } = msg;
    const { id, userName } = useRecoilValue(userState);

    return (
        <Flex
            gap={2}
            direction='row'
            maxW='50%'
            alignSelf={sender === id ? 'flex-end' : 'flex-start'}>
            {sender === id ? null :
                <Avatar
                    name={sender_name}
                    bg={sender === id ? 'green.300' : 'green.100'} />}
            <Text
                p='3rem'
                flexGrow={1}
                overflow='hidden'
                alignSelf={sender === id ? 'flex-end' : 'flex-start'}
                borderRadius='lg'
                bg={sender === id ? 'green.300' : 'green.100'}>
                {content}
            </Text>
        </Flex >
    );
}