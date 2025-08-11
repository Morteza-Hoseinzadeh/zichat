import { useState, useRef } from 'react';

import { Box, Typography, Menu, MenuItem, InputBase } from '@mui/material';

import ConvertToEnglishDigit from '@/utils/functions/convertToEnglishDigit';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';

import { TbChevronDown } from 'react-icons/tb';

const countryCodes = [{ code: '+98', name: 'ایران', flag: 'IR' }];

export default function TabPhone({ form, setForm }) {
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [phoneError, setPhoneError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [displayValue, setDisplayValue] = useState('');
  const inputRef = useRef(null);

  const validatePhoneNumber = (phone) => {
    if (!phone) {
      setPhoneError('لطفا شماره تلفن را وارد کنید');
      return false;
    }

    if (selectedCountry.code === '+98' && !/^9\d{9}$/.test(phone)) {
      setPhoneError('شماره موبایل معتبر نیست (مثال: 9123456789)');
      return false;
    }

    setPhoneError('');
    return true;
  };

  const handlePhoneChange = (e) => {
    const rawValue = e.target.value;
    const englishValue = ConvertToEnglishDigit(rawValue).replace(/\D/g, ''); // Convert to English and remove non-digits

    setForm({ ...form, phone: englishValue }); // Store English digits
    setDisplayValue(ConvertToPersianDigit(englishValue)); // Display Persian digits
    validatePhoneNumber(englishValue);
  };

  const handleCountryClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setForm({ ...form, phone: '' });
    setDisplayValue('');
    setPhoneError('');
    setAnchorEl(null);
    inputRef.current.focus();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box dir="ltr" sx={{ mb: 4, animation: 'fadeIn 0.3s ease', '@keyframes fadeIn': { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'text.primary', fontSize: '1.1rem' }}>
        لطفا شماره تلفن همراه خود را وارد کنید
      </Typography>

      {/* Helper Text */}
      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mb: 2, textAlign: 'center', fontSize: '0.75rem', opacity: 0.8 }}>
        کد تایید به این شماره ارسال خواهد شد
      </Typography>

      {/* Input Container */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: 'background.paper', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', p: '4px', border: '1px solid', borderColor: phoneError ? 'error.main' : 'divider', transition: 'all 0.2s ease', '&:focus-within': { borderColor: 'primary.main', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' } }}>
        {/* Country Select Button */}
        <Box onClick={handleCountryClick} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: '10px 12px', backgroundColor: 'action.hover', borderRadius: '8px', cursor: 'pointer', minWidth: 100, transition: 'all 0.2s ease', '&:hover': { backgroundColor: 'action.selected' } }}>
          <img src={`https://flagcdn.com/w20/${selectedCountry.flag.toLowerCase()}.png`} alt={selectedCountry.name} width={20} height={15} style={{ objectFit: 'cover', borderRadius: '2px' }} />
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, fontSize: '0.85rem' }}>
            {ConvertToPersianDigit(selectedCountry.code)}
          </Typography>
          <TbChevronDown size={16} style={{ color: 'text.secondary' }} />
        </Box>

        {/* Divider */}
        <Box sx={{ width: '1px', height: '24px', backgroundColor: 'divider', opacity: 0.5 }} />

        {/* Phone Input */}
        <InputBase inputRef={inputRef} fullWidth placeholder="شماره تلفن" value={displayValue} onChange={handlePhoneChange} inputProps={{ dir: 'ltr', inputMode: 'numeric' }} />
      </Box>

      {/* Error Message */}
      {phoneError && (
        <Typography variant="caption" sx={{ color: 'error.main', display: 'block', mt: 1, textAlign: 'center', fontSize: '0.75rem' }}>
          {phoneError}
        </Typography>
      )}

      {/* Country Select Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} PaperProps={{ sx: { width: 220, maxHeight: 300, mt: 1, borderRadius: '12px', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)', border: '1px solid', borderColor: 'divider', py: 0.5 } }} MenuListProps={{ sx: { py: 0 } }}>
        {countryCodes.map((country) => (
          <MenuItem key={country.code} onClick={() => handleCountrySelect(country)} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, px: 1.5, m: 0.5, borderRadius: '8px', '&:hover': { backgroundColor: 'action.hover' } }}>
            <img src={`https://flagcdn.com/w20/${country.flag.toLowerCase()}.png`} alt={country.name} width={20} height={15} style={{ objectFit: 'cover', borderRadius: '2px' }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                {country.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                {ConvertToPersianDigit(country.code)}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
