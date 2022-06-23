import React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import ConversationWindow from '../src/components/ConversationWindow';
import RoomDisplay from '../src/components/RoomDisplay';
import MessageField from '../src/components/MessageField';

export default function Chat(props) {
    const { socket } = props;
    return (
        <Grid templateRows='repeat(4, 1fr)' templateColumns='repeat(4, 1fr)' w='100vw' h='100vh'>
            <GridItem gridRow='1 / span 3' gridColumn='1 / span 1' overflowY='scroll'>
                <RoomDisplay socket={socket} w='100%' bg='green.400' />
            </GridItem>
            <GridItem gridRow='4 / span 1' gridColumn='1 / span 1' w='100%'>
                Test
            </GridItem>
            <GridItem gridRow='1 / span 3' gridColumn='2 / span 3' w='100%'>
                <ConversationWindow />
            </GridItem>
            <GridItem gridRow='4 / span 1' gridColumn='2 / span 3' w='100%'>
                <MessageField socket={socket} />
            </GridItem>

        </Grid >
    );
}