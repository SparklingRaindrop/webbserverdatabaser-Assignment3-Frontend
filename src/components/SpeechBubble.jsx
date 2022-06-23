import { Box } from '@chakra-ui/react';
import React from 'react'

export default function SpeechBubble(props) {
    const { message, sender } = props;
    return (
        <Box maxW='60%' bg='yellow.200'>
            {message}
        </Box>
    );
}