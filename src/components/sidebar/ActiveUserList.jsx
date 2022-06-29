import React from 'react';

import {
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Box,
    Heading,
    IconButton,
} from '@chakra-ui/react';
import { PlusSquareIcon, MinusIcon } from '@chakra-ui/icons'

import MemberList from './MemberList';

export default function ActiveUserList(props) {
    const { members, handleSwitchTab } = props;
    return (
        <AccordionItem w='90%' m='auto' border={0}>
            {({ isExpanded }) => (
                <>
                    <Heading
                        overflow='hidden'
                        bg='green.300'>
                        <AccordionButton paddingRight={0}>
                            <Box
                                flex='1'
                                w='50%'
                                textAlign='left'>
                                Active Users ({members.length})
                            </Box>
                            {isExpanded ?
                                <IconButton
                                    variant='ghost'
                                    colorScheme='black'
                                    as='div'
                                    icon={<MinusIcon />}
                                />
                                :
                                <IconButton
                                    variant='ghost'
                                    colorScheme='black'
                                    as='div'
                                    icon={<PlusSquareIcon />}
                                />}
                        </AccordionButton>
                    </Heading>
                    <AccordionPanel pb={4} bg='green.200'>
                        <MemberList
                            members={members}
                            handleSwitchTab={handleSwitchTab} />
                    </AccordionPanel>
                </>
            )}
        </AccordionItem>
    );
}
