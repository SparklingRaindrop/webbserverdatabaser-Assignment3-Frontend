import React, { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { messageState } from '../recoil/message/atom';
import { userState } from '../recoil/user/atom';
import { Box, VStack, Heading } from '@chakra-ui/react';
import SpeechBubble from './SpeechBubble';


export default function ConversationWindow() {
    const [messages, setMessages] = useRecoilState(messageState);
    const { id, current_room } = useRecoilValue(userState);
    console.log(messages);

    return (
        <VStack>
            <Box bg='green.100' w='100%' p={2}>
                <Heading>{current_room}</Heading>
            </Box>
            <VStack
                spacing={4}
            >
                {
                    messages ? messages.map(msg =>
                        <SpeechBubble
                            key={msg.timestamp + msg.content}
                            message={msg.content}
                            sender={msg.sender}
                            timestamp={msg.timestamp} />
                    ) :
                        <div>No message</div>
                }
            </VStack>
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