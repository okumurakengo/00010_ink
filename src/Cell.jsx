import chalk from 'chalk';
import { GREEN, BLUE, RED, YELLOW, GREEN_BLIGHT, BLUE_BLIGHT } from './constans';

export default ({ color }) => {
    switch (color) {
        case GREEN:
            return chalk.green.bgGreen('[]');
        case BLUE:
            return chalk.blue.bgBlue('[]');
        case RED:
            return chalk.red.bgRed('[]');
        case YELLOW:
            return chalk.yellow.bgYellow('[]');
        case GREEN_BLIGHT:
            return chalk.greenBright.bgGreenBright('[]');
        case BLUE_BLIGHT:
            return chalk.blueBright.bgBlueBright('[]');
        default:
            return " .";
    }
}
