import React from 'react';
import {
    Accordion,
    Button,
    useDisclosure,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons'
import { useRecoilValue } from 'recoil';
import { roomState } from '../recoil/room/atom';
import ListGroup from './ListGroup';
import CreateNewRoomPopUp from './CreateNewRoomPopUp';

export default function RoomDisplay(props) {
    const { socket } = props;
    const roomList = useRecoilValue(roomState);
    const { isOpen, onOpen, onClose } = useDisclosure();
    console.log(roomList);

    return (
        <>
            <Accordion allowMultiple color='green.900' p={5} borderRadius='0.5rem'>
                {roomList.map(({ roomName, members }, index) => {
                    return <ListGroup
                        key={`${roomName}${index}`}
                        members={members}
                        name={roomName}
                        socket={socket} />
                })}
            </Accordion>
            <Button leftIcon={<AddIcon />} colorScheme='green' variant='solid' onClick={onOpen}>
                Create new room
            </Button>
            <CreateNewRoomPopUp isOpen={isOpen} onClose={onClose} socket={socket} />
        </>
    );
}