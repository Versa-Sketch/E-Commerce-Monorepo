import { useMemo } from 'react';
import { validateIndianPhone } from '../utils/validators';

export function usePhoneValidation(phone: string) {
  return useMemo(() => {
    return validateIndianPhone(phone);
  }, [phone]);
}
