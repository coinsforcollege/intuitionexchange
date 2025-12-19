/**
 * MobileSelectDrawer
 * A mobile-friendly bottom sheet selector that replaces standard dropdowns on mobile.
 * Uses Ant Design Drawer for smooth scrolling and proper touch handling.
 * Similar to how token selection works on the trade page.
 */

import React, { useState, useEffect } from 'react';
import { Drawer, Input, theme } from 'antd';
import { SearchOutlined, CheckOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import { fontWeights } from '@/theme/themeConfig';
import { useThemeMode } from '@/context/ThemeContext';

const { useToken } = theme;

export interface SelectOption {
  value: string;
  label: string;
  searchValue?: string;
}

interface MobileSelectDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  options: SelectOption[];
  value?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
}

const MobileSelectDrawer: React.FC<MobileSelectDrawerProps> = ({
  open,
  onClose,
  title,
  options,
  value,
  onSelect,
  placeholder = 'Search...',
}) => {
  const { token } = useToken();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const [searchTerm, setSearchTerm] = useState('');

  // Clear search when drawer opens (don't auto-focus to avoid keyboard covering the sheet)
  useEffect(() => {
    if (open) {
      setSearchTerm('');
    }
  }, [open]);

  // Filter options based on search term - only match from start of words
  const filteredOptions = options.filter((option) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const searchTarget = option.searchValue || option.label;
    // Match from the start of words only (not anywhere in the string)
    const words = searchTarget.toLowerCase().split(/[\s,()]+/);
    return words.some((word) => word.startsWith(searchLower));
  });

  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue);
    onClose();
  };

  return (
    <Drawer
      title={title}
      placement="bottom"
      height="70vh"
      open={open}
      onClose={onClose}
      destroyOnClose={false}
      styles={{
        wrapper: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
        },
        header: {
          borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
          paddingTop: token.paddingMD,
          paddingBottom: token.paddingMD,
        },
        body: {
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      {/* Search Input - Fixed at top, never scrolls */}
      <div
        style={{
          flexShrink: 0,
          padding: token.paddingMD,
          borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'}`,
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Input
          prefix={<SearchOutlined style={{ color: token.colorTextSecondary }} />}
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            height: 44,
            borderRadius: 12,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
          }}
          allowClear
        />
      </div>

      {/* Options List - Scrollable area below search, with extra bottom padding for keyboard */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        {filteredOptions.length === 0 ? (
          <div
            style={{
              padding: token.paddingXL,
              textAlign: 'center',
              color: token.colorTextTertiary,
            }}
          >
            No results found
          </div>
        ) : (
          <>
            {filteredOptions.map((option) => {
              const isSelected = option.value === value;
              return (
                <motion.div
                  key={option.value}
                  whileTap={{ scale: 0.98, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)' }}
                  onClick={() => handleSelect(option.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: `${token.paddingMD}px ${token.paddingLG}px`,
                    borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'}`,
                    backgroundColor: isSelected
                      ? (isDark ? 'rgba(13, 115, 119, 0.15)' : 'rgba(13, 115, 119, 0.08)')
                      : 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <span
                    style={{
                      fontSize: token.fontSize,
                      fontWeight: isSelected ? fontWeights.semibold : fontWeights.normal,
                      color: isSelected ? token.colorPrimary : token.colorText,
                    }}
                  >
                    {option.label}
                  </span>
                  {isSelected && (
                    <CheckOutlined
                      style={{
                        color: token.colorPrimary,
                        fontSize: token.fontSizeLG,
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </>
        )}
      </div>
    </Drawer>
  );
};

export default MobileSelectDrawer;

