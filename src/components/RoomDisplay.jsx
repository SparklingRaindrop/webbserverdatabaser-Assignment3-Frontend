import React from 'react';
import {
    Accordion,
    Button,
    useDisclosure,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useRecoilValue } from 'recoil';
import { roomState } from '../recoil/room/atom';
import { membersState } from '../recoil/members/atom';
import ListGroup from './ListGroup';
import CreateNewRoomPopUp from './CreateNewRoomPopUp';
import ActiveMemberList from './ActiveMemberList';

export default function RoomDisplay(props) {
    const { socket } = props;

    const roomList = useRecoilValue(roomState);
    const memberList = useRecoilValue(membersState);
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Accordion allowMultiple color='green.900' p={5} borderRadius='0.5rem'>
                <ActiveMemberList members={memberList} />
                {roomList.map(({ roomName, members, password }, index) => {
                    return <ListGroup
                        key={`${roomName}${index}`}
                        members={members}
                        name={roomName}
                        socket={socket}
                        password={password} />
                })}
            </Accordion>
            <Button leftIcon={<AddIcon />} colorScheme='green' variant='solid' onClick={onOpen}>
                Create new room
            </Button>
            <CreateNewRoomPopUp isOpen={isOpen} onClose={onClose} socket={socket} />
        </>
    );
}