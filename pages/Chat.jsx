import React, { useEffect } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import ConversationWindow from '../src/components/ConversationWindow';
import RoomDisplay from '../src/components/RoomDisplay';
import MessageField from '../src/components/MessageField';
import { useRecoilValue } from 'recoil';
import { messageState } from '../src/recoil/message/atom';
import { systemState } from '../src/recoil/system/atom';
import ConversationTabs from '../src/components/ConversationTabs';

export default function Chat(props) {
    const { socket } = props;
    const messages = useRecoilValue(messageState);
    const { typingBy } = useRecoilValue(systemState);

    useEffect(() => {
        const conversations = document.querySelector('.conversations');
        conversations.scrollTop = conversations.scrollHeight;
    }, [messages, typingBy]);

    return (
        <Grid templateRows='repeat(4, 1fr)' templateColumns='repeat(4, 1fr)' w='100vw' h='100vh'>
            <GridItem gridRow='1 / span 4' gridColumn='1 / span 1' overflowY='scroll'>
                <RoomDisplay socket={socket} w='100%' bg='green.400' />
            </GridItem>
            <GridItem
                w='100%'
                mb='2rem'
                gridRow='1 / span 3'
                gridColumn='2 / span 3'
                className='conversations'
                overflowY='scroll'>
                <ConversationTabs />
            </GridItem>
            <GridItem gridRow='4 / span 1' gridColumn='2 / span 3' w='100%'>
                <MessageField socket={socket} />
            </GridItem>

        </Grid >
    );
}