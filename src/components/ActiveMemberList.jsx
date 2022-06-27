import {
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Box,
    Heading,
    IconButton,
} from '@chakra-ui/react';
import { PlusSquareIcon, MinusIcon } from '@chakra-ui/icons'
import React from 'react';
import MemberList from './MemberList';

export default function ActiveMemberList({ members }) {
    return (
        <AccordionItem border={0}>
            {({ isExpanded }) => (
                <>
                    <Heading>
                        <AccordionButton
                            as='div'
                            bg='green.300'>
                            <Box flex='1' textAlign='left'>
                                Active Users ({members.length})
                            </Box>
                            {isExpanded ?
                                <IconButton
                                    variant='ghost'
                                    colorScheme='black'
                                    icon={<MinusIcon />}
                                />
                                :
                                <IconButton
                                    variant='ghost'
                                    colorScheme='black'
                                    icon={<PlusSquareIcon />}
                                />}
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
