// Workaround for @gorhom/bottom-sheet compatibility with react-native-reanimated v4
declare module 'react-native-reanimated/lib/typescript/Animated' {
    import type { EasingFunction as EasingFn } from 'react-native-reanimated';
    export namespace Animated {
        export type EasingFunction = EasingFn;
    }
}
