import { EXRSessionSupportType } from 'src/types';
import { getXRSupportTypes } from 'src/utils';

export const XR_SUPPORT_TYPES = await getXRSupportTypes();

export const IS_VR_SUPPORT = XR_SUPPORT_TYPES.has(EXRSessionSupportType.SUPPORTED_VR);

export const IS_AR_SUPPORT = XR_SUPPORT_TYPES.has(EXRSessionSupportType.SUPPORTED_AR);
