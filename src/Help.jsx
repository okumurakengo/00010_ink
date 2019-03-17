import React from 'react';
import { Box } from 'ink';

export default () => {
    return (
        <Box margin={3} flexDirection="column">
            <Box>* ----------------------</Box>
            <Box margin={1}>← : press move left .</Box>
            <Box margin={1}>→ : press move right .</Box>
            <Box margin={1}>a : press rotate left .</Box>
            <Box margin={1}>f : press rotate right .</Box>
            <Box>---------------------- *</Box>
        </Box>
    );
}
