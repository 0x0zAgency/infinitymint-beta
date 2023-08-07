import { PathLike } from 'fs';
import { ParsedPath } from 'path';

export interface InfinityMintSVGSettings {
    viewbox?: string;
    padding?: string;
    outerPadding?: string;
    preserveColours?: boolean;
    transform?: {
        x?: string | number;
        y?: string | number;
        scale?: string | number;
    };
    style?: {
        filter?: {
            type: 'blur' | 'hue-rotate' | 'sepia';
            /**
             * will uniquely set a filter value based on the mint
             *
             * @default false
             */
            unique?: boolean;
            /**
             * @default 0
             */
            value?: number | string;
            minValue?: number | string;
            /**
             * @default "100%"
             */
            maxValue?: number | string;
        };
        stroke?: {
            colour: string;
            width: number;
        };
        fontFamily?: string;
        /**
         * will add the contents of these css files to the style tag of the svg, if unique member is true then will select one random css script from this array and only inject that
         */
        css?: PathLike[] | PathLike;
        /**
         * If the css member contains an array of paths, this will enable InfinityMint to uniquely pick a stylesheet based on the mint
         *
         * @default false
         */
        unique?: boolean;
    };
    background?: {
        image: PathLike | PathLike[];
        /**
         * @default false
         */
        imageRepeat?: boolean;
        /**
         * @default "center"
         */
        imagePosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
        /**
         * @default "contain"
         */
        imageSize?: 'contain' | 'cover';
        /**
         * If multiple images are defined in the image member then will pick a background image based on the mint
         *
         * @default false
         */
        unique?: boolean;
    };
    source?: ParsedPath;
}
