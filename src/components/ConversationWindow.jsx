import React from 'react'
import { useRecoilValue } from 'recoil';
import { messageState } from '../recoil/message/atom';
import { Box, VStack, Heading, Flex } from '@chakra-ui/react';
import SpeechBubble from './SpeechBubble';
import { systemState } from '../recoil/system/atom';
import TypingNotification from './TypingNotification';
import { userState } from '../recoil/user/atom';

export default function ConversationWindow(props) {
    const { receiverName, receiverId } = props;
    const inboxes = useRecoilValue(messageState);
    const { typingNotification } = useRecoilValue(systemState);
    const { active_tab } = useRecoilValue(userState);

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
                    typingNotification &&
                        (typingNotification.typingBy.name === active_tab ||
                            typingNotification.room_name === active_tab) ?
                        <TypingNotification name={typingNotification.typingBy.name} /> :
                        null
                }
            </Flex>
        </VStack>
    )
}