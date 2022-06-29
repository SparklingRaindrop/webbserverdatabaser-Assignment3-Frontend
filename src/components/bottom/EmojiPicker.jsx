import React, { useEffect, useRef, useState } from 'react';

import { Center, Grid, HStack, IconButton, VStack } from '@chakra-ui/react';
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons'

import { emoji } from '../../data/emoji';

const emojiList = Object.keys(emoji);
const emojiPerPage = 30;

export default function EmojiPicker(props) {
    const { onEmojiClick, setIsHidden } = props;
    const [index, setPager] = useState(0);
    const pickerContainer = useRef(null);
    const button = document.querySelector('.emojiPickerButton');

    useEffect(() => {

        function handleClickOutside(event) {
            if (
                pickerContainer.current &&
                !pickerContainer.current.contains(event.target)
            ) {
                setIsHidden(true);
            }
        }
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, [pickerContainer]);

    function handlePreviousPage() {
        setPager(prev => prev - emojiPerPage);
    }

    function handleNextPage() {
        setPager(prev => prev + emojiPerPage);
    }

    function handleOnClick(emoji) {
        onEmojiClick(emoji);
    }

    return (
        <>
            <VStack
                ref={pickerContainer}
                p='0.5rem'
                borderRadius='sm'
                bg='#F1F1F1'
                transform='translateY(-100%)'
                display='block'
                position='absolute'>
                <Grid
                    gridTemplateColumns='repeat(10, 1fr)'>
                    {emojiList.slice(index, index + emojiPerPage).map((emoji, index) => (
                        <Center
                            key={index}
                            w='2.5rem'
                            h='2.5rem'
                            border='1px'
                            cursor='pointer'
                            borderColor='gray.200'
                            onClick={() => handleOnClick(emoji)}>{emoji}</Center>
                    ))}
                </Grid>
                <HStack
                    w='100%'
                    px='1rem'
                    justifyContent='space-between'>
                    <IconButton
                        disabled={index === 0}
                        colorScheme='green'
                        icon={<ChevronLeftIcon />}
                        onClick={handlePreviousPage} />
                    <IconButton
                        disabled={index + 20 > emojiList.length}
                        colorScheme='green'
                        icon={<ChevronRightIcon />}
                        onClick={handleNextPage} />
                </HStack>
            </VStack>
        </>
    )
}
