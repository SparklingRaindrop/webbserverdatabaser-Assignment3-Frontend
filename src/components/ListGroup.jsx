import React from 'react';
import {
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Box,
    Heading,
    useToast,
} from '@chakra-ui/react';
import { MinusIcon, PlusSquareIcon, DeleteIcon } from '@chakra-ui/icons';
import MemberList from './MemberList';

export default function ListGroup(props) {
    const { name, members, socket } = props;
    const toast = useToast();

    function handleDeleteRoom(name) { // TODO TEST THIS
        socket.emit('remove_room', name, (response) => {
            if (response.status !== 200) {
                toast({
                    title: 'Could not delete the room',
                    description: response.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: 'Successfully deleted',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
            }
        });
    }

    return (
        <AccordionItem border={0}>
            {({ isExpanded }) => (
                <>
                    <Heading>
                        <AccordionButton
                            bg='green.300'>
                            <Box flex='1' textAlign='left'>
                                {name} ({members.length})
                            </Box>
                            <DeleteIcon onClick={() => {
                                handleDeleteRoom(name);
                            }} />
                            {isExpanded ? <MinusIcon /> : <PlusSquareIcon />}
                        </AccordionButton>
                    </Heading>
                    <AccordionPanel pb={4} bg='green.200'>
                        <MemberList members={members} />
                    </AccordionPanel>
                </>
            )}
        </AccordionItem>
    );
}