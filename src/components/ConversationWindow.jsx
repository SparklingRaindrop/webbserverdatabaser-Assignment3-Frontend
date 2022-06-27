import React from 'react'
import { useRecoilValue } from 'recoil';
import { messageState } from '../recoil/message/atom';
import { Box, VStack, Heading, Flex } from '@chakra-ui/react';
import SpeechBubble from './SpeechBubble';
import { systemState } from '../recoil/system/atom';
import TypingNotification from './TypingNotification';

export default function ConversationWindow(props) {
    const { receiverName, receiverId } = props;
    const inboxes = useRecoilValue(messageState);
    const { typingBy } = useRecoilValue(systemState);

    const targetInbox = receiverId ? inboxes[receiverId] : inboxes.current_room;
    if (!targetInbox) return <div>Loading</div>

    return (
        <VStack>
            <Box bg='green.100' w='100%' p={2}>
                <Heading>{receiverName}</Heading>
            </Box>
            <Flex
                p={2}
                direction='column'
                gap={4}
                w='100%'
            >
                {

                    targetInbox.length !== 0 ?
                        targetInbox.map((msg, index) =>
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