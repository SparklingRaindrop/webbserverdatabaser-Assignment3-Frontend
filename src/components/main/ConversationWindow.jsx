import React from 'react';
import { useRecoilValue } from 'recoil';

import { messageState } from '../../recoil/message/atom';
import { systemState } from '../../recoil/system/atom';
import { userState } from '../../recoil/user/atom';

import { VStack, Flex } from '@chakra-ui/react';

import SpeechBubble from './SpeechBubble';
import TypingIndicator from './TypingIndicator';

export default function ConversationWindow(props) {
    const { receiverId, tabIndex } = props;

    const inboxes = useRecoilValue(messageState);
    const { typingNotification } = useRecoilValue(systemState);
    const { active_tab } = useRecoilValue(userState);

    const targetInbox = receiverId ? inboxes[receiverId] : inboxes.current_room;

    return (
        <VStack>
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
                        ((typingNotification.receiver &&
                            tabIndex > 0 &&
                            active_tab === typingNotification.typingBy.name) ||
                            (typingNotification.room_name &&
                                tabIndex === 0 &&
                                active_tab === typingNotification.room_name)) ?
                        <TypingIndicator name={typingNotification.typingBy.name} /> :
                        null
                }
            </Flex>
        </VStack>
    )
}