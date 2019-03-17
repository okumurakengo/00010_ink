import React from 'react';
import { Box } from 'ink';
import Row from './Row.jsx';

export default ({ cells }) => {
    return (
        <Box flexDirection="column">
            <Box>+----------------------+</Box>
            {cells.map((row, i) => {
                return (
                    <Box key={i}>
                        <Row row={row} />
                    </Box>
                );
            })}
            <Box>+----------------------+</Box>
        </Box>
    );
}
