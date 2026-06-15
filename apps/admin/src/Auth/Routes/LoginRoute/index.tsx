import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Shield } from 'lucide-react';
import { API_STATUS } from '../../../stores/constants/apiStatus';
import { useAuthStore } from '../../Providers/AuthProvider';
import { AUTH_ROLES } from '../../Constants/authConstants';
import {
  PageOuter,
  LeftPanel, BrandMark, BrandIcon, BrandName,
  LeftContent, LeftHeading, LeftSubtext, FeatureList, FeatureItem, FeatureDot,
  LeftFooter,
  RightPanel, FormCard,
  StepTag, Heading, SubHeading, PhoneNumber,
  FormGroup, Label,
  PhoneInputWrapper, PhonePrefix, Input,
  OtpInput,
  SubmitButton, Spinner,
  ErrorBox,
  BackLink,
  HintText,
} from './styledComponents';

const ADMIN_ROLE = AUTH_ROLES.ADMIN;

const LoginRouteComponent = () => {
  const store = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const isLoading = store.status === API_STATUS.FETCHING;

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    await store.requestOtp(`+91${phone}`, ADMIN_ROLE);
    if (store.status === API_STATUS.SUCCESS) {
      setStep('otp');
      store.resetStatus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    await store.verifyOtp(otp);
    if (store.status === API_STATUS.SUCCESS) {
      navigate('/', { replace: true });
    }
  };

  const handleBack = () => {
    setStep('phone');
    setOtp('');
    store.resetStatus();
  };

  return (
    <PageOuter>
      <LeftPanel>
        <BrandMark>
          <BrandIcon><Shield size={20} strokeWidth={2.5} /></BrandIcon>
          <BrandName>HyperAdmin</BrandName>
        </BrandMark>

        <LeftContent>
          <LeftHeading>
            Manage your<br />
            e-commerce<br />
            operations.
          </LeftHeading>
          <LeftSubtext>
            One powerful dashboard to oversee stores, orders,
            deliveries, and everything in between.
          </LeftSubtext>
          <FeatureList>
            {['Real-time order tracking', 'Multi-store management', 'Analytics & reporting', 'Role-based access'].map(f => (
              <FeatureItem key={f}>
                <FeatureDot />
                {f}
              </FeatureItem>
            ))}
          </FeatureList>
        </LeftContent>

        <LeftFooter>© 2025 HyperAdmin. All rights reserved.</LeftFooter>
      </LeftPanel>

      <RightPanel>
        {step === 'phone' ? (
          <FormCard>
            <StepTag>Step 1 of 2</StepTag>
            <Heading>Welcome back</Heading>
            <SubHeading>Enter your phone number to receive a one-time password.</SubHeading>

            <form onSubmit={handleRequestOtp}>
              <FormGroup>
                <Label htmlFor="phone">Phone Number</Label>
                <PhoneInputWrapper>
                  <PhonePrefix>🇮🇳 +91</PhonePrefix>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    autoFocus
                  />
                </PhoneInputWrapper>
              </FormGroup>

              {store.error && <ErrorBox>⚠ {store.error}</ErrorBox>}

              <SubmitButton type="submit" disabled={isLoading || phone.length < 10} $loading={isLoading}>
                {isLoading ? <><Spinner />Sending OTP…</> : 'Send OTP →'}
              </SubmitButton>

              <HintText>OTP will be sent via SMS to +91 {phone || 'XXXXXXXXXX'}</HintText>
            </form>
          </FormCard>
        ) : (
          <FormCard>
            <StepTag>Step 2 of 2</StepTag>
            <Heading>Verify OTP</Heading>
            <SubHeading>
              Enter the 6-digit code sent to{' '}
              <PhoneNumber>+91 {phone}</PhoneNumber>
            </SubHeading>

            <form onSubmit={handleVerifyOtp}>
              <FormGroup>
                <Label htmlFor="otp">One-Time Password</Label>
                <OtpInput
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="· · · ·"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />
              </FormGroup>

              {store.error && <ErrorBox>⚠ {store.error}</ErrorBox>}

              <SubmitButton type="submit" disabled={isLoading || otp.length < 4} $loading={isLoading}>
                {isLoading ? <><Spinner />Verifying…</> : 'Verify & Sign In →'}
              </SubmitButton>

              <BackLink type="button" onClick={handleBack}>
                ← Change phone number
              </BackLink>
            </form>
          </FormCard>
        )}
      </RightPanel>
    </PageOuter>
  );
};

export const LoginRoute = observer(LoginRouteComponent);
