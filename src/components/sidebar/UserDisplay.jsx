import React from 'react';
import { useRecoilValue } from 'recoil';

import { roomState } from '../../recoil/room/atom';
import { membersState } from '../../recoil/members/atom';

import {
    Accordion,
    Button,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

import RoomMemberList from './RoomMemberList';
import CreateNewRoomPopUp from './CreateNewRoomPopUp';
import ActiveUserList from './ActiveUserList';

export default function UserDisplay(props) {
    const { socket } = props;

    const roomList = useRecoilValue(roomState);
    const memberList = useRecoilValue(membersState);
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <VStack
            maxW='90%'
            m='auto'
            gap={2}
            justifyContent='center'>
            <Accordion
                borderRadius='0.5rem'
                color='green.900'
                allowMultiple>
                <ActiveUserList
                    members={memberList}
                    handleSwitchTab={handleSwitchTab} />
                {
                    roomList.map(({ roomName, members, password }, index) => {
                        return <RoomMemberList
                            key={`${roomName}${index}`}
                            members={members}
                            name={roomName}
                            socket={socket}
                            password={password} />
                    })
                }
            </Accordion>
            <Button
                leftIcon={<AddIcon />}
                colorScheme='green'
                variant='solid'
                onClick={onOpen}>
                Create new room
            </Button>
            <CreateNewRoomPopUp isOpen={isOpen} onClose={onClose} socket={socket} />
        </VStack >
    );
}