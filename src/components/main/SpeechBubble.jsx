import React from 'react'
import { useRecoilValue } from 'recoil';

import { userState } from '../../recoil/user/atom';

import { Avatar, Box, Grid, GridItem, Text } from '@chakra-ui/react';
import Emoji from "react-emoji-render";

export default function SpeechBubble({ msg }) {
    const { content, sender, timestamp, sender_name } = msg;
    const { id } = useRecoilValue(userState);

    const date = new Date(timestamp).toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'CET',
    });
    return (

        <Grid
            maxW='50%'
            gridTemplateColumns='3rem 1fr'
            gridTemplateRows='1fr 1rem'
            gap={sender === id ? '0.5rem 0' : '0.5rem'}
            alignSelf={sender === id ? 'flex-end' : 'flex-start'}>
            {sender === id ?
                null :
                <Box textAlign='center' fontSize='0.8rem'>
                    <Avatar
                        name={sender_name}
                        gridColumn='1 / span 1'
                        gridRow='1 / span 2'
                        bg={sender === id ? 'green.100' : 'green.300'} />
                    {sender_name}
                </Box>}
            <Text
                p='3rem'
                flexGrow={1}
                overflow='hidden'
                gridColumn='2 / span 2'
                gridRow='1 / span 1'
                alignSelf={sender === id ? 'flex-end' : 'flex-start'}
                borderRadius='lg'
                bg={sender === id ? 'green.100' : 'green.300'}>
                <Emoji text={content} />
            </Text>
            <GridItem
                gridColumn='2 / span 2'
                gridRow='2 / span 2'
                textAlign='right'
                fontSize='sm'>
                {date}
            </GridItem>
        </Grid>
    );
}