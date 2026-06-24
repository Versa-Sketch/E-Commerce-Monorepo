import React, { useEffect, useState } from 'react';
import { ChoicePills } from '../Components/ChoicePills';
import { ContinueButton } from '../Components/ContinueButton';
import { DateField } from '../Components/DateField';
import { FilePickerField } from '../Components/FilePickerField';
import { FormField } from '../Components/FormField';
import { OnboardingStepScreen } from '../Components/OnboardingStepScreen';
import { useOnboardingStep } from '../hooks/useOnboardingStep';
import { useStepDraft } from '../hooks/useStepDraft';
import { useOnboardingStore } from '../Store/useOnboardingStore';
import { PickedDoc, VehicleType } from '../types/domain';
import { findDocUrl, toExistingDoc } from '../utils/documents';

const VEHICLE_OPTIONS: { value: VehicleType; label: string }[] = [
  { value: 'BICYCLE', label: 'Bicycle' },
  { value: 'BIKE', label: 'Bike' },
  { value: 'AUTO', label: 'Auto' },
  { value: 'VAN', label: 'Van' },
];

interface VehicleDraft {
  vehicle_type: VehicleType | undefined;
  vehicle_registration: string;
  vehicle_make_model: string;
  vehicle_color: string;
  dl_expiry: string;
  insurance_expiry: string;
  puc_expiry: string;
  dl_front: PickedDoc | null;
  dl_back: PickedDoc | null;
  rc: PickedDoc | null;
  insurance: PickedDoc | null;
  puc: PickedDoc | null;
  vehicle_photo: PickedDoc | null;
}

export function VehicleRoute() {
  const { stepError, isSubmitting, stepNumber, goNext, goBack } = useOnboardingStep('VEHICLE');
  const saveVehicle = useOnboardingStore((s) => s.saveVehicle);
  const prefill = useOnboardingStore((s) => s.prefill);
  const { draft, saveDraft } = useStepDraft<VehicleDraft>('VEHICLE');

  const [vehicleType, setVehicleType] = useState<VehicleType | undefined>(undefined);
  const [registration, setRegistration] = useState('');
  const [makeModel, setMakeModel] = useState('');
  const [color, setColor] = useState('');
  const [dlExpiry, setDlExpiry] = useState('');
  const [insuranceExpiry, setInsuranceExpiry] = useState('');
  const [pucExpiry, setPucExpiry] = useState('');
  const [dlFront, setDlFront] = useState<PickedDoc | null>(null);
  const [dlBack, setDlBack] = useState<PickedDoc | null>(null);
  const [rc, setRc] = useState<PickedDoc | null>(null);
  const [insurance, setInsurance] = useState<PickedDoc | null>(null);
  const [puc, setPuc] = useState<PickedDoc | null>(null);
  const [vehiclePhoto, setVehiclePhoto] = useState<PickedDoc | null>(null);

  useEffect(() => {
    if (draft) {
      setVehicleType(draft.vehicle_type);
      setRegistration(draft.vehicle_registration);
      setMakeModel(draft.vehicle_make_model);
      setColor(draft.vehicle_color);
      setDlExpiry(draft.dl_expiry);
      setInsuranceExpiry(draft.insurance_expiry);
      setPucExpiry(draft.puc_expiry);
      setDlFront(draft.dl_front);
      setDlBack(draft.dl_back);
      setRc(draft.rc);
      setInsurance(draft.insurance);
      setPuc(draft.puc);
      setVehiclePhoto(draft.vehicle_photo);
      return;
    }
    const vehicle = prefill?.vehicle;
    if (!vehicle) return;
    setVehicleType(vehicle.vehicle_type ?? undefined);
    setRegistration(vehicle.vehicle_registration ?? '');
    setMakeModel(vehicle.vehicle_make_model ?? '');
    setColor(vehicle.vehicle_color ?? '');
    setDlExpiry(vehicle.dl_expiry ?? '');
    setInsuranceExpiry(vehicle.insurance_expiry ?? '');
    setPucExpiry(vehicle.puc_expiry ?? '');
    setDlFront(toExistingDoc(findDocUrl(prefill?.documents, 'DL_FRONT')));
    setDlBack(toExistingDoc(findDocUrl(prefill?.documents, 'DL_BACK')));
    setRc(toExistingDoc(findDocUrl(prefill?.documents, 'RC')));
    setInsurance(toExistingDoc(findDocUrl(prefill?.documents, 'INSURANCE')));
    setPuc(toExistingDoc(findDocUrl(prefill?.documents, 'PUC')));
    setVehiclePhoto(toExistingDoc(findDocUrl(prefill?.documents, 'VEHICLE_PHOTO')));
  }, [draft, prefill]);

  useEffect(() => {
    saveDraft({
      vehicle_type: vehicleType,
      vehicle_registration: registration,
      vehicle_make_model: makeModel,
      vehicle_color: color,
      dl_expiry: dlExpiry,
      insurance_expiry: insuranceExpiry,
      puc_expiry: pucExpiry,
      dl_front: dlFront,
      dl_back: dlBack,
      rc,
      insurance,
      puc,
      vehicle_photo: vehiclePhoto,
    });
  }, [vehicleType, registration, makeModel, color, dlExpiry, insuranceExpiry, pucExpiry, dlFront, dlBack, rc, insurance, puc, vehiclePhoto, saveDraft]);

  const canContinue = !!dlFront && !!dlBack && !!rc && !!insurance;

  const handleContinue = async () => {
    if (!canContinue) return;
    try {
      await saveVehicle({
        vehicle_type: vehicleType,
        vehicle_registration: registration || undefined,
        vehicle_make_model: makeModel || undefined,
        vehicle_color: color || undefined,
        dl_expiry: dlExpiry || undefined,
        insurance_expiry: insuranceExpiry || undefined,
        puc_expiry: pucExpiry || undefined,
        dl_front: dlFront,
        dl_back: dlBack,
        rc,
        insurance,
        puc,
        vehicle_photo: vehiclePhoto,
      });
      goNext();
    } catch {
      // stepError (shown via OnboardingStepScreen) already reflects the failure.
    }
  };

  return (
    <OnboardingStepScreen
      title="Your vehicle"
      stepNumber={stepNumber}
      onBack={goBack}
      error={stepError}
      footer={<ContinueButton onPress={handleContinue} disabled={!canContinue} loading={isSubmitting} />}
    >
      <ChoicePills label="Vehicle Type" options={VEHICLE_OPTIONS} value={vehicleType} onChange={setVehicleType} />
      <FormField label="Registration Number" value={registration} onChangeText={setRegistration} placeholder="e.g. KA01AB1234" />
      <FormField label="Make & Model" value={makeModel} onChangeText={setMakeModel} placeholder="e.g. Honda Activa" />
      <FormField label="Colour" value={color} onChangeText={setColor} placeholder="e.g. Black" />
      <DateField label="Driving Licence Expiry" value={dlExpiry} onChange={setDlExpiry} />
      <FilePickerField label="Driving Licence Front (required)" value={dlFront} onChange={setDlFront} />
      <FilePickerField label="Driving Licence Back (required)" value={dlBack} onChange={setDlBack} />
      <FilePickerField label="Registration Certificate / RC (required)" value={rc} onChange={setRc} />
      <DateField label="Insurance Expiry" value={insuranceExpiry} onChange={setInsuranceExpiry} />
      <FilePickerField label="Insurance Document (required)" value={insurance} onChange={setInsurance} />
      <DateField label="PUC Expiry" value={pucExpiry} onChange={setPucExpiry} />
      <FilePickerField label="PUC Certificate" value={puc} onChange={setPuc} />
      <FilePickerField label="Vehicle Photo" value={vehiclePhoto} onChange={setVehiclePhoto} />
    </OnboardingStepScreen>
  );
}
