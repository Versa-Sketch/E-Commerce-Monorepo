import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(12px); }
  to   { opacity: 1; transform: translateX(0); }
`;

export const PageOuter = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftPanel = styled.div`
  background: linear-gradient(145deg, #064e3b 0%, #065f46 40%, #10b981 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }

  &::before {
    content: '';
    position: absolute;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    top: -100px;
    right: -100px;
  }

  &::after {
    content: '';
    position: absolute;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    bottom: 60px;
    left: -60px;
  }
`;

export const BrandMark = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1;
`;

export const BrandIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

export const BrandName = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.3px;
`;

export const LeftContent = styled.div`
  z-index: 1;
`;

export const LeftHeading = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
`;

export const LeftSubtext = styled.p`
  font-size: 15px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.6;
  max-width: 320px;
`;

export const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
`;

export const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.8);
`;

export const FeatureDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6ee7b7;
  flex-shrink: 0;
`;

export const LeftFooter = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  z-index: 1;
`;

// ── Right (form) panel ───────────────────────────────────────────────────────

export const RightPanel = styled.div`
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
`;

export const FormCard = styled.div`
  width: 100%;
  max-width: 380px;
  animation: ${fadeUp} 0.25s ease;
`;

export const StepTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ecfdf5;
  color: #059669;
  font-size: 11.5px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 24px;
  letter-spacing: 0.02em;
`;

export const Heading = styled.h2`
  font-size: 26px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 6px;
  letter-spacing: -0.4px;
`;

export const SubHeading = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 32px;
  line-height: 1.5;
`;

export const PhoneNumber = styled.span`
  color: #111827;
  font-weight: 600;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 20px;
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #374151;
`;

export const PhoneInputWrapper = styled.div`
  display: flex;
  height: 46px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus-within {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

export const PhonePrefix = styled.div`
  display: flex;
  align-items: center;
  padding: 0 14px;
  background: #f9fafb;
  border-right: 1.5px solid #e5e7eb;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
  user-select: none;
`;

export const Input = styled.input`
  flex: 1;
  height: 100%;
  padding: 0 14px;
  border: none;
  font-size: 15px;
  color: #111827;
  background: transparent;
  outline: none;

  &::placeholder {
    color: #d1d5db;
    font-size: 14px;
  }
`;

export const OtpInput = styled.input`
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 22px;
  font-weight: 600;
  color: #111827;
  background: #fff;
  outline: none;
  letter-spacing: 0.3em;
  text-align: center;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  &::placeholder {
    color: #d1d5db;
    letter-spacing: normal;
    font-size: 14px;
    font-weight: 400;
  }
`;

export const SubmitButton = styled.button<{ $loading?: boolean }>`
  width: 100%;
  height: 48px;
  background: #10b981;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: ${({ $loading }) => ($loading ? 'not-allowed' : 'pointer')};
  opacity: ${({ $loading }) => ($loading ? 0.75 : 1)};
  transition: background 0.15s, transform 0.1s;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: #059669;
  }

  &:active:not(:disabled) {
    transform: scale(0.99);
  }
`;

export const ErrorBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #dc2626;
  line-height: 1.4;
  animation: ${slideIn} 0.2s ease;
`;

export const BackLink = styled.button`
  background: none;
  border: none;
  font-size: 13.5px;
  color: #10b981;
  cursor: pointer;
  padding: 0;
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;

  &:hover {
    color: #059669;
    text-decoration: underline;
  }
`;

export const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const HintText = styled.p`
  font-size: 12.5px;
  color: #9ca3af;
  margin-top: 12px;
  text-align: center;
`;
