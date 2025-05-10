import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { TextComponent } from '@/components/text/TextComponent';
import { CardComponent } from '@/components/ui/CardComponent';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { color } from '@/constants/color';
import { useColorScheme } from '@/hooks/useColorScheme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  return (
    <CardComponent>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme === 'light' ? color.light.primary : color.dark.primary}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <TextComponent variante='headline'>{title}</TextComponent>
      </TouchableOpacity>
      {isOpen && <CardComponent style={styles.content}>{children}</CardComponent>}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
