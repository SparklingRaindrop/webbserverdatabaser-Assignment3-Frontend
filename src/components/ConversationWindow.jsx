import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { messageState } from '../recoil/message/atom';
import { userState } from '../recoil/user/atom';
import { Box, VStack, Heading, Flex } from '@chakra-ui/react';
import SpeechBubble from './SpeechBubble';
import { systemState } from '../recoil/system/atom';
import TypingNotification from './TypingNotification';


export default function ConversationWindow() {
    const [messages, setMessages] = useRecoilState(messageState);
    const { id, current_room } = useRecoilValue(userState);
    const { typingBy } = useRecoilValue(systemState);

    return (
        <VStack>
            <Box bg='green.100' w='100%' p={2}>
                <Heading>{current_room}</Heading>
            </Box>
            <Flex
                p={2}
                direction='column'
                gap={4}
                w='100%'
            >
                {
                    messages.length !== 0 ?
                        messages.map((msg, index) =>
                            <SpeechBubble
                                key={msg.timestamp + index}
                                msg={msg} />
                        ) :
                        <div>No message</div>
                }
                {
                    typingBy ?
                        <TypingNotification name={typingBy.name} /> :
                        null
                }
            </Flex>
        </VStack>
    )
}

{/* <div>
                <input type='text'
                    placeholder='Message'
                    value={directMessage}
                    onChange={(event) => setDirectMessage(event.target.value)} />
                <input type='text'
                    placeholder='Message to'
                    value={receiver}
                    onChange={(event) => setReceiver(event.target.value)} />
                <button onClick={handleDirectMessage}>Send</button>
            </div> */}