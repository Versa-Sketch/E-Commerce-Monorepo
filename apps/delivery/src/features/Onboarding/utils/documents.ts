import { DocumentItem, OnboardingStep, PickedDoc } from '../types/domain';

// Maps a documents[] doc_type back to which step owns it and which form
// field name to send it under when re-uploading via that step's PATCH
// endpoint. DL_FRONT/DL_BACK/RC/INSURANCE/PUC/VEHICLE_PHOTO are inferred from
// the AADHAAR_FRONT/PAN naming convention (flagged earlier as unconfirmed) —
// update here if the backend uses different strings.
export const DOC_TYPE_INFO: Record<string, { step: OnboardingStep; formKey: string; label: string }> = {
  PROFILE_PHOTO: { step: 'IDENTITY', formKey: 'profile_photo', label: 'Profile photo' },
  SELFIE: { step: 'IDENTITY', formKey: 'selfie', label: 'Selfie' },
  AADHAAR_FRONT: { step: 'KYC', formKey: 'aadhaar_front', label: 'Aadhaar front' },
  AADHAAR_BACK: { step: 'KYC', formKey: 'aadhaar_back', label: 'Aadhaar back' },
  PAN: { step: 'KYC', formKey: 'pan', label: 'PAN card' },
  DL_FRONT: { step: 'VEHICLE', formKey: 'dl_front', label: 'Driving licence front' },
  DL_BACK: { step: 'VEHICLE', formKey: 'dl_back', label: 'Driving licence back' },
  RC: { step: 'VEHICLE', formKey: 'rc', label: 'Registration certificate' },
  INSURANCE: { step: 'VEHICLE', formKey: 'insurance', label: 'Insurance document' },
  PUC: { step: 'VEHICLE', formKey: 'puc', label: 'PUC certificate' },
  VEHICLE_PHOTO: { step: 'VEHICLE', formKey: 'vehicle_photo', label: 'Vehicle photo' },
};

// Documents the admin flagged as not passing verification.
export function getRejectedDocuments(documents: DocumentItem[] | undefined): DocumentItem[] {
  return documents?.filter((d) => d.status === 'REJECTED') ?? [];
}

// Finds an already-uploaded document's remote URL by doc_type so a step
// screen can show it as an existing preview when resuming.
export function findDocUrl(documents: DocumentItem[] | undefined, docType: string): string | undefined {
  return documents?.find((d) => d.doc_type === docType)?.file_url;
}

// Wraps an existing remote file URL into the same PickedDoc shape used for
// freshly-picked local files, so FilePickerField can preview it identically.
// http.ts's submitFormData skips re-uploading any doc whose uri already
// starts with http(s) — only newly-picked local files get sent again.
export function toExistingDoc(url: string | null | undefined): PickedDoc | null {
  if (!url) return null;
  return { uri: url, name: url.split('/').pop() ?? 'document', type: 'image/jpeg' };
}
