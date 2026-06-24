import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { ChoicePills } from '../Components/ChoicePills';
import { ContinueButton } from '../Components/ContinueButton';
import { FormField } from '../Components/FormField';
import { OnboardingStepScreen } from '../Components/OnboardingStepScreen';
import { useOnboardingStep } from '../hooks/useOnboardingStep';
import { useStepDraft } from '../hooks/useStepDraft';
import { useOnboardingStore } from '../Store/useOnboardingStore';
import { AccountType } from '../types/domain';
import { typography, spacing } from '../../../theme';
import { obColors } from '../theme';

interface BankDraft {
  account_holder_name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  account_type: AccountType;
  upi_id: string;
}

export function BankRoute() {
  const { stepError, isSubmitting, stepNumber, goNext, goBack } = useOnboardingStep('BANK');
  const saveBank = useOnboardingStore((s) => s.saveBank);
  const prefill = useOnboardingStore((s) => s.prefill);
  const { draft, saveDraft } = useStepDraft<BankDraft>('BANK');

  const [holderName, setHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('SAVINGS');
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    if (draft) {
      setHolderName(draft.account_holder_name);
      setBankName(draft.bank_name);
      setAccountNumber(draft.account_number);
      setIfsc(draft.ifsc_code);
      setAccountType(draft.account_type);
      setUpiId(draft.upi_id);
      return;
    }
    const bank = prefill?.bank;
    if (!bank) return;
    setHolderName(bank.account_holder_name ?? '');
    setBankName(bank.bank_name ?? '');
    setAccountNumber(bank.account_number ?? '');
    setIfsc(bank.ifsc_code ?? '');
    setAccountType(bank.account_type ?? 'SAVINGS');
    setUpiId(bank.upi_id ?? '');
  }, [draft, prefill]);

  useEffect(() => {
    saveDraft({ account_holder_name: holderName, bank_name: bankName, account_number: accountNumber, ifsc_code: ifsc, account_type: accountType, upi_id: upiId });
  }, [holderName, bankName, accountNumber, ifsc, accountType, upiId, saveDraft]);

  const canContinue = holderName.trim().length > 0 && bankName.trim().length > 0 && accountNumber.length > 0 && ifsc.length === 11;

  const handleContinue = async () => {
    if (!canContinue) return;
    try {
      await saveBank({
        account_holder_name: holderName,
        bank_name: bankName,
        account_number: accountNumber,
        ifsc_code: ifsc.toUpperCase(),
        account_type: accountType,
        upi_id: upiId || undefined,
      });
      goNext();
    } catch {
      // stepError (shown via OnboardingStepScreen) already reflects the failure.
    }
  };

  return (
    <OnboardingStepScreen
      title="Bank account for payouts"
      stepNumber={stepNumber}
      onBack={goBack}
      error={stepError}
      footer={<ContinueButton onPress={handleContinue} disabled={!canContinue} loading={isSubmitting} />}
    >
      <Text style={{ ...typography.small, color: obColors.textMuted, marginBottom: spacing.lg }}>
        We'll verify this account with a small refundable deposit (penny-drop) before activating payouts.
      </Text>
      <FormField label="Account Holder Name" value={holderName} onChangeText={setHolderName} placeholder="As per bank records" />
      <FormField label="Bank Name" value={bankName} onChangeText={setBankName} placeholder="e.g. State Bank of India" />
      <FormField label="Account Number" value={accountNumber} onChangeText={setAccountNumber} placeholder="Account number" keyboardType="number-pad" />
      <FormField
        label="IFSC Code"
        value={ifsc}
        onChangeText={(t) => setIfsc(t.toUpperCase())}
        placeholder="11-character IFSC"
        maxLength={11}
        hint={`${ifsc.length}/11 characters`}
      />
      <ChoicePills
        label="Account Type"
        options={[{ value: 'SAVINGS', label: 'Savings' }, { value: 'CURRENT', label: 'Current' }]}
        value={accountType}
        onChange={setAccountType}
      />
      <FormField label="UPI ID (optional)" value={upiId} onChangeText={setUpiId} placeholder="name@bank" />
    </OnboardingStepScreen>
  );
}
