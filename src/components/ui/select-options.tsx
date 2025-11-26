import React from 'react';
import {Platform, Pressable, type PressableProps} from 'react-native';
import {BottomSheetFlatList, type BottomSheetModal} from '@gorhom/bottom-sheet';
import {FlashList} from '@shopify/flash-list';
import {useColorScheme} from 'nativewind';
import type {SvgProps} from 'react-native-svg';
import Svg, {Path} from 'react-native-svg';

import colors from '@/components/ui/colors';
import {Modal} from './modal';
import {Text} from './text';

export type OptionType = {label: string; value: string | number};

type OptionsProps = {
  options: OptionType[];
  onSelect: (option: OptionType) => void;
  value?: string | number;
  testID?: string;
};

function keyExtractor(item: OptionType) {
  return `select-item-${item.value}`;
}

const List = Platform.OS === 'web' ? FlashList : BottomSheetFlatList;

export const Options = React.forwardRef<BottomSheetModal, OptionsProps>(
  ({options, onSelect, value, testID}, ref) => {
    const height = options.length * 70 + 100;
    const snapPoints = React.useMemo(() => [height], [height]);
    const {colorScheme} = useColorScheme();
    const isDark = colorScheme === 'dark';

    const renderSelectItem = React.useCallback(
      ({item}: {item: OptionType}) => (
        <Option
          key={`select-item-${item.value}`}
          label={item.label}
          selected={value === item.value}
          onPress={() => onSelect(item)}
          testID={testID ? `${testID}-item-${item.value}` : undefined}
        />
      ),
      [onSelect, value, testID],
    );

    return (
      <Modal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: isDark ? colors.neutral[800] : colors.white,
        }}>
        <List
          data={options}
          keyExtractor={keyExtractor}
          renderItem={renderSelectItem}
          testID={testID ? `${testID}-modal` : undefined}
          estimatedItemSize={52}
        />
      </Modal>
    );
  },
);

const Option = React.memo(
  ({
    label,
    selected = false,
    ...props
  }: PressableProps & {
    selected?: boolean;
    label: string;
  }) => {
    return (
      <Pressable
        className="flex-row items-center border-b border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800"
        {...props}>
        <Text className="flex-1 dark:text-neutral-100 ">{label}</Text>
        {selected && <Check />}
      </Pressable>
    );
  },
);

const Check = ({...props}: SvgProps) => (
  <Svg
    width={25}
    height={24}
    fill="none"
    viewBox="0 0 25 24"
    {...props}
    className="stroke-black dark:stroke-white">
    <Path
      d="m20.256 6.75-10.5 10.5L4.506 12"
      strokeWidth={2.438}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default Options;
