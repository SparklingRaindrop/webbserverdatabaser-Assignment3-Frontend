import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { userState } from '../../recoil/user/atom';
import { messageState } from '../../recoil/message/atom';

import {
    HStack,
    IconButton,
    ListItem,
    UnorderedList,
} from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons'

export default function MemberList(props) {
    const { members, handleSwitchTab } = props;

    const [user, setUser] = useRecoilState(userState);
    const setMessages = useSetRecoilState(messageState);

    function handleDM(receiver) {
        setUser(prev => ({
            ...prev,
            active_dm: [
                ...prev.active_dm,
                { [receiver.name]: receiver.id }
            ],
        }));
        setMessages(prev => {
            // When first time to talk to this user, create message box
            if (!prev.hasOwnProperty(receiver.id)) {
                return {
                    ...prev,
                    [receiver.id]: []
                }
            }
        });
        handleSwitchTab(user.active_dm.length + 1);
        setUser(prev => ({
            ...prev,
            active_tab: receiver.name,
        }))
    }

    return (
        <UnorderedList listStyleType='none'>
            {
                members.length > 0 ?
                    members.map(({ id, name }) => (
                        <ListItem key={id}>
                            <HStack
                                w='100%'
                                h='2rem'
                                justifyContent='space-between'
                                alignItems='center'>
                                <span>
                                    {name} {user.id !== id ? '' : '(You)'}
                                </span>
                                {user.id !== id && !user.active_dm.some(member => Object.values(member).includes(id)) ?
                                    <IconButton
                                        colorScheme='green'
                                        variant='ghost'
                                        onClick={() => handleDM({ id, name })}
                                        icon={<ChatIcon />} /> :
                                    null}
                            </HStack>
                        </ListItem>)) :
                    <ListItem>
                        No member
                    </ListItem>
            }
        </UnorderedList>
    );
}